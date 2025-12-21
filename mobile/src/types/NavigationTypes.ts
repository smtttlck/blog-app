import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type Route<K extends keyof AuthStackParamList | keyof UserStackParamList> = { // generic route type
    name: K; // name of the route
    component: React.ComponentType<any>; // component associated with the route
    isAuthRoute?: boolean; // optional flag to indicate if the route requires authentication
    isTabRoute?: boolean; // optional flag to indicate if the route is a tab route
};

export type AuthStackParamList = { // parameters for auth stack
    Login: undefined; // no parameters for Login screen
}

export type UserStackParamList = { // parameters for user stack
    MainTabs: undefined; // no parameters for MainTabs navigator
    Home: undefined; // no parameters for Home screen
    Blog: { blogId: string }; // parameters for Blog screen
}

export type TabParamList = { // parameters for tab navigator
    Home: undefined; // no parameters for Home tab
}

// navigation prop type for user stack
export type UserStackNavigationProp = NativeStackNavigationProp<UserStackParamList>;