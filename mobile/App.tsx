import { StyleSheet } from 'react-native';
import RootNavigation from './src/navigation/RootNavigation';
import { useFonts } from 'expo-font';

export default function App() {

  // load custom fonts
  const [fontsLoaded] = useFonts({
    Questrial: require('./assets/fonts/Questrial-Regular.ttf'),
  });

  return (
    <RootNavigation />
  );
}

const styles = StyleSheet.create({});
