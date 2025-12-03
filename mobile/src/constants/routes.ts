import LoginScreen from "../screens/LoginScreen";
import { AuthStackParamList, Route } from "../types/navigation";

// define route constants
export const routes: Route<keyof AuthStackParamList>[] = [
    { name: 'Login', component: LoginScreen },
];