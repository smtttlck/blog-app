import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import { AuthStackParamList, Route, UserStackParamList } from "../types/NavigationTypes";

type RoutesType = Route<keyof AuthStackParamList | keyof UserStackParamList>[]; // array of route objects

// define route constants
// each route includes name, component, and an optional isAuthRoute flag
export const routes: RoutesType = [
    { name: 'Login', component: LoginScreen, isAuthRoute: false },
    { name: 'Home', component: HomeScreen, isAuthRoute: true },
];