import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Compass, Bookmark, User, Lightbulb } from 'lucide-react-native';
import { colors } from '../../assets/theme';

// IMPORT SEMUA SCREEN
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
import NotificationScreen from '../screens/NotificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;
const TAB_BAR_PADDING_BOTTOM = Platform.OS === 'ios' ? 25 : 10;

// COMPONENT MAIN APP (TAB NAVIGATOR)
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.blue(),
        tabBarInactiveTintColor: colors.grey(0.5),
        tabBarStyle: {
          backgroundColor: colors.white(),
          borderTopWidth: 0.5,
          borderTopColor: colors.grey(0.12),
          height: TAB_BAR_HEIGHT,
          paddingBottom: TAB_BAR_PADDING_BOTTOM,
          paddingTop: 8,
          elevation: 10,
          shadowColor: colors.black(0.08),
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          marginTop: 4,
          fontSize: 11,
          fontFamily: 'Pjs-Medium',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'Beranda', 
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
      <Tab.Screen 
        name="LatihanTab" 
        component={LatihanScreen} 
        options={{ 
          tabBarLabel: 'Latihan', 
          tabBarIcon: ({ color, focused }) => (
            <Compass color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
      <Tab.Screen 
        name="BookmarkTab" 
        component={BookmarkScreen} 
        options={{ 
          tabBarLabel: 'Bookmark', 
          tabBarIcon: ({ color, focused }) => (
            <Bookmark color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Profil', 
          tabBarIcon: ({ color, focused }) => (
            <User color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
      <Tab.Screen 
        name="TipsTab" 
        component={TipsScreen} 
        options={{ 
          tabBarLabel: 'Tips', 
          tabBarIcon: ({ color, focused }) => (
            <Lightbulb color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}

// COMPONENT ROUTER UTAMA
export default function Router() {
  return (
    <Stack.Navigator 
      initialRouteName="SplashScreen" 
      screenOptions={{ 
        headerShown: false, 
        ...TransitionPresets.SlideFromRightIOS,
        cardStyle: { backgroundColor: colors.white() }
      }}
    >
      {/* AUTH SCREENS */}
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/* MAIN APP */}
      <Stack.Screen name="MainApp" component={MainApp} />
      
      {/* NOTIFICATION SCREEN */}
      <Stack.Screen name="Notification" component={NotificationScreen} />
      
      {/* DETAIL & FORM SCREENS */}
      <Stack.Screen name="LatihanDetail" component={LatihanDetail} />
      <Stack.Screen name="AddLatihan" component={AddLatihanForm} />
      <Stack.Screen name="EditLatihan" component={EditLatihanForm} />
      <Stack.Screen name="EditProfile" component={EditProfileForm} />
    </Stack.Navigator>
  );
}