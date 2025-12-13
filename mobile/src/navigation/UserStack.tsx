import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { routes } from '../constants/routes';
import { UserStackParamList } from '../types/NavigationTypes';
import TabNavigator from './TabNavigator';
import Authorization from '../components/Authorization';

const Stack = createNativeStackNavigator<UserStackParamList>();

const UserStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"
    >
      { // add TabNavigator as the main entry point
        routes.some(route => route.isTabRoute) && (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        )
      }
      { // mapping through routes that are not tab routes but require authentication
        routes.filter(route => route.isAuthRoute === true && !route.isTabRoute)
          .map((route) => (
            <Stack.Screen
              key={route.name}
              name={route.name as keyof UserStackParamList}
            >
              {() => ( // wrap route component with Authorization
                <Authorization>
                  <route.component />
                </Authorization>
              )}
            </Stack.Screen>
          ))
      }
    </Stack.Navigator>
  )
}

export default UserStack

const styles = StyleSheet.create({})