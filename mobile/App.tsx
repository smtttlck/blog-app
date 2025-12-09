import { StyleSheet } from 'react-native';
import RootNavigation from './src/navigation/RootNavigation';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/redux/app/store';

export default function App() {

  // load custom fonts
  const [fontsLoaded] = useFonts({
    Questrial: require('./assets/fonts/Questrial-Regular.ttf'),
  });

  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}

const styles = StyleSheet.create({});
