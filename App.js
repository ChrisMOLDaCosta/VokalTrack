import { NavigationContainer } from '@react-navigation/native';
import Router from './src/navigation/Router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import fontType from './assets/theme/fonts';
import colors from './assets/theme/colors';

export default function App() {
  const [loaded] = useFonts(fontType);
  
  if (!loaded) {
    return null;
  }
  
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </>
  );
}