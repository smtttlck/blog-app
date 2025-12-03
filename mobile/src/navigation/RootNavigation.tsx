import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';

const RootNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  )
}

export default RootNavigation

const styles = StyleSheet.create({})