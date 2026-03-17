import { StyleSheet } from 'react-native';
import RootNavigation from './src/navigation/RootNavigation';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/redux/app/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

  // load custom fonts
  const [fontsLoaded] = useFonts({
    Questrial: require('./assets/fonts/Questrial-Regular.ttf'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <RootNavigation />
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
