import HomeScreen from './src/screens/HomeScreen';
import LatihanScreen from './src/screens/LatihanScreen';
import BookmarkScreen from './src/screens/BookmarkScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TipsScreen from './src/screens/TipsScreen';
import { fontType } from './assets/theme';
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts(fontType);
  if (!loaded) return null;
  return <TipsScreen/>;
}