import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Bookmark, User, Lightbulb } from 'lucide-react-native';
import { colors } from '../../assets/theme';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LatihanScreen from '../screens/LatihanScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TipsScreen from '../screens/TipsScreen';
import LatihanDetail from '../screens/LatihanDetail';
import AddLatihanForm from '../screens/AddLatihanForm';
import EditLatihanForm from '../screens/EditLatihanForm';
import EditProfileForm from '../screens/EditProfileForm';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.blue(),
        tabBarInactiveTintColor: colors.grey(),
        tabBarStyle: {
          backgroundColor: colors.white(),
          borderTopWidth: 0.5,
          borderTopColor: colors.grey(0.2),
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { marginTop: 4, fontSize: 11, fontFamily: 'Pjs-Medium' },
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Beranda', tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
      <Tab.Screen name="Latihan" component={LatihanScreen} options={{ tabBarLabel: 'Latihan', tabBarIcon: ({ color }) => <Search color={color} size={24} /> }} />
      <Tab.Screen name="Bookmark" component={BookmarkScreen} options={{ tabBarLabel: 'Bookmark', tabBarIcon: ({ color }) => <Bookmark color={color} size={24} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} />
      <Tab.Screen name="Tips" component={TipsScreen} options={{ tabBarLabel: 'Tips', tabBarIcon: ({ color }) => <Lightbulb color={color} size={24} /> }} />
    </Tab.Navigator>
  );
}

export default function Router() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainApp" component={MainApp} />
      <Stack.Screen name="LatihanDetail" component={LatihanDetail} />
      <Stack.Screen name="AddLatihan" component={AddLatihanForm} />
      <Stack.Screen name="EditLatihan" component={EditLatihanForm} />
      <Stack.Screen name="EditProfile" component={EditProfileForm} />
    </Stack.Navigator>
  );
}