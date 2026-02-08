const fs = require('fs');
const readline = require('readline');
const path = require('path');

const SQL_FILE = path.join(__dirname, '../../oorep_temp/oorep.sql');
const OUTPUT_FILE = path.join(__dirname, '../src/data/oorepRemedies.json');

// Data Stores
const remedies = {};      // id -> { id, abbrev, name }
const books = {};         // id -> { title, author }
const chapters = {};      // id -> { bookId, remedyId, heading }
const remedyText = {};    // remedyId -> [ { source, chapter, section, text } ]

async function processLineByLine() {
    if (!fs.existsSync(SQL_FILE)) {
        console.error("SQL file not found:", SQL_FILE);
        return;
    }

    const fileStream = fs.createReadStream(SQL_FILE);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let currentTable = null;
    let lineCount = 0;

    console.log("Starting OOREP SQL parse (corrected order)...");

    for await (const line of rl) {
        lineCount++;
        
        // Detect COPY blocks
        if (line.startsWith('COPY public.remedy (')) {
            currentTable = 'remedy';
            console.log(`Line ${lineCount}: Found Remedy table`);
            continue;
        } else if (line.startsWith('COPY public.mminfo (')) {
            currentTable = 'mminfo';
            console.log(`Line ${lineCount}: Found MMInfo (Books) table`);
            continue;
        } else if (line.startsWith('COPY public.mmchapter (')) {
            currentTable = 'mmchapter';
            console.log(`Line ${lineCount}: Found MMChapter table`);
            continue;
        } else if (line.startsWith('COPY public.mmsection (')) {
            currentTable = 'mmsection';
            console.log(`Line ${lineCount}: Found MMSection table`);
            continue;
        } else if (line.startsWith('COPY public.rubricremedy')) {
            console.log(`Line ${lineCount}: Reached rubricremedy (end of relevant text data). Stopping parse.`);
            break; 
        } else if (line.startsWith('\\.')) {
            currentTable = null;
            continue;
        }

        if (!currentTable || line.trim() === '') continue;

        try {
            const parts = line.split('\t'); 

            if (currentTable === 'mminfo') {
                // id(0), abbrev(1), lang(2), fulltitle(3), authorlastname(4)...
                const id = parts[0];
                const title = parts[3];
                const author = parts[4] || 'Unknown';
                books[id] = { id, title: cleanText(title), author: cleanText(author) };
            }
            else if (currentTable === 'mmchapter') {
                // id(0), mminfo_id(1), heading(2), remedy_id(3)
                const id = parts[0];
                const bookId = parts[1];
                const heading = parts[2];
                const remedyId = parts[3];
                
                if (remedyId && remedyId !== '\\N') {
                    chapters[id] = { id, bookId, heading: cleanText(heading), remedyId };
                }
            }
            else if (currentTable === 'mmsection') {
                // id(0), mmchapter_id(1), depth(2), parent(3), succ(4), heading(5), content(6)
                // Note: content might be undefined if empty string
                const chapterId = parts[1];
                const heading = parts[5];
                const content = parts[6] || '';

                if (chapters[chapterId]) {
                    const remedyId = chapters[chapterId].remedyId;
                    const bookId = chapters[chapterId].bookId;

                    if (!remedyText[remedyId]) {
                        remedyText[remedyId] = [];
                    }

                    remedyText[remedyId].push({
                        source: books[bookId]?.title || 'Unknown Source',
                        chapter: chapters[chapterId].heading,
                        section: cleanText(heading),
                        text: cleanText(content)
                    });
                }
            }
            else if (currentTable === 'remedy') {
                // id(0), nameabbrev(1), namelong(2), namealt(3)
                const id = parts[0];
                const abbrev = parts[1];
                const name = parts[2];
                remedies[id] = { 
                    id, 
                    abbrev, 
                    name: cleanText(name),
                    source: "OOREP Import",
                    materiaMedica: [] // Will populate later
                };
            }

        } catch (err) {
            console.log("Error parsing line:", line.substring(0, 50), err.message);
        }
    }

    // Merge Step
    console.log("Merging collected MM text into remedies...");
    let matchCount = 0;
    const finalRemedies = [];

    // Identify which remedies have text
    const remedyIdsWithText = Object.keys(remedyText);
    
    for (const refId of remedyIdsWithText) {
        if (remedies[refId]) {
            remedies[refId].materiaMedica = remedyText[refId];
            finalRemedies.push(remedies[refId]);
            matchCount++;
        }
    }

    // Also include remedies that might not have text but are in the remedy table? 
    // Usually we only want ones with content. Let's stick to ones with text for now 
    // to avoid polluting the app with empty entries.

    console.log(`Found ${Object.keys(remedies).length} total remedies definitions.`);
    console.log(`Found text for ${remedyIdsWithText.length} remedies.`);
    console.log(`Successfully merged ${matchCount} remedies with Materia Medica.`);
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalRemedies, null, 2));
    console.log(`Saved to ${OUTPUT_FILE}`);
}

function cleanText(str) {
    if (!str) return '';
    return str.replace(/\\N/g, '')
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '')
              .trim();
}

processLineByLine();
