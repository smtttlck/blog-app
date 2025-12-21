import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { routes } from '../constants/routes';
import { UserStackParamList } from '../types/NavigationTypes';
import TabNavigator from './TabNavigator';
import Authorization from '../components/Authorization';

const Stack = createNativeStackNavigator<UserStackParamList>();

const UserStack: React.FC = () => {

  // higher-order component to wrap components with Authorization
  const WithAuth = (Component: React.ComponentType<any>) => (props: any) => (
    <Authorization>
      <Component {...props} />
    </Authorization>
  );

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"
    >
      { // add TabNavigator as the main entry point - wrap with auth
        routes.some(route => route.isTabRoute) && (
          <Stack.Screen 
            name="MainTabs" 
            component={WithAuth(TabNavigator)} 
          />
        )
      }
      { // mapping through routes that are not tab routes but require authentication
        routes.filter(route => route.isAuthRoute === true && !route.isTabRoute)
          .map((route) => (
            <Stack.Screen
              key={route.name}
              name={route.name as keyof UserStackParamList}
              component={WithAuth(route.component)} // wrap with Authorization
            />
          ))
      }
    </Stack.Navigator>
  )
}

export default UserStack

const styles = StyleSheet.create({})