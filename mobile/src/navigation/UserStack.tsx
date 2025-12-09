import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { routes } from '../constants/routes';
import { Route, UserStackParamList } from '../types/NavigationTypes';

const Stack = createNativeStackNavigator<UserStackParamList>();

const UserStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      { // mapping through routes array to create screens that do not require authentication
        routes.filter(route => route.isAuthRoute === true)
          .map((route) => (
            <Stack.Screen
              key={route.name}
              name={route.name as keyof UserStackParamList}
              component={route.component}
            />
          ))}
    </Stack.Navigator>
  )
}

export default UserStack

const styles = StyleSheet.create({})