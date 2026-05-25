import { NavigationContainer } from '@react-navigation/native';
import Router from './src/navigation/Router';
import { fontType } from './assets/theme';
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts(fontType);
  if (!loaded) return null;
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}