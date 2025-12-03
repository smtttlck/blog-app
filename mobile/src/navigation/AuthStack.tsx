import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { routes } from '../constants/routes';
import { AuthStackParamList, Route } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
        screenOptions={{ headerShown: false }}
    >
        {routes.map((route: Route<keyof AuthStackParamList>) => ( // mapping through routes array
            <Stack.Screen
                key={route.name}
                name={route.name as keyof AuthStackParamList}
                component={route.component}
            />
        ))}
    </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})