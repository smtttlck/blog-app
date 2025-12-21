import { Blog, Home, Login } from "../screens";
import { AuthStackParamList, Route, UserStackParamList } from "../types/NavigationTypes";

type RoutesType = Route<keyof AuthStackParamList | keyof UserStackParamList>[]; // array of route objects

// define route constants
// each route includes name, component, and an optional isAuthRoute flag
// tab routes are also marked with isTabRoute flag
export const routes: RoutesType = [
    { name: 'Login', component: Login, isAuthRoute: false, isTabRoute: false },
    { name: 'Home', component: Home, isAuthRoute: true, isTabRoute: true },
    { name: 'Blog', component: Blog, isAuthRoute: true, isTabRoute: false },
];