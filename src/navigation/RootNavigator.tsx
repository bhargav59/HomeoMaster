import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from '../types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import BodyPartsScreen from '../screens/BodyPartsScreen';
import BodyPartDetailScreen from '../screens/BodyPartDetailScreen';
import AllRemediesScreen from '../screens/AllRemediesScreen';
import RemedyDetailScreen from '../screens/RemedyDetailScreen';
import ToolsScreen from '../screens/ToolsScreen';
import LearnScreen from '../screens/LearnScreen';
import RepertoryToolScreen from '../screens/RepertoryToolScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'BodyParts') {
                        iconName = focused ? 'body' : 'body-outline';
                    } else if (route.name === 'AllRemedies') {
                        iconName = focused ? 'flask' : 'flask-outline';
                    } else if (route.name === 'Tools') {
                        iconName = focused ? 'construct' : 'construct-outline';
                    } else if (route.name === 'Learn') {
                        iconName = focused ? 'school' : 'school-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0ea5e9',
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopColor: '#e2e8f0',
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                },
                headerStyle: {
                    backgroundColor: '#0ea5e9',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {},
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'HomeoMaster' }}
            />
            <Tab.Screen
                name="BodyParts"
                component={BodyPartsScreen}
                options={{ title: 'Body Parts' }}
            />
            <Tab.Screen
                name="AllRemedies"
                component={AllRemediesScreen}
                options={{ title: 'Remedies' }}
            />
            <Tab.Screen
                name="Tools"
                component={ToolsScreen}
                options={{ title: 'Tools' }}
            />
            <Tab.Screen
                name="Learn"
                component={LearnScreen}
                options={{ title: 'Learn' }}
            />
        </Tab.Navigator>
    );
}

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#0ea5e9',
                    },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {},
                }}
            >
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BodyPartDetail"
                    component={BodyPartDetailScreen}
                    options={({ route }) => ({ title: route.params.bodyPartName })}
                />
                <Stack.Screen
                    name="RemedyDetail"
                    component={RemedyDetailScreen}
                    options={{ title: 'Remedy Details' }}
                />
                <Stack.Screen
                    name="RepertoryTool"
                    component={RepertoryToolScreen}
                    options={{ title: 'Repertory Tool' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
