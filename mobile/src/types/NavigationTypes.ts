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
    Discover: { sort?: string }; // parameters for Discover screen
    Profile: { userId: string }; // parameters for Profile screen
    MyProfile: undefined; // no parameters for MyProfile screen
    Connections: { userId: string; connectionType: 'follower' | 'following' }; // parameters for Connections screen
    Settings: undefined; // no parameters for Settings screen
}

export type TabParamList = { // parameters for tab navigator
    Home: undefined; // no parameters for Home tab
    Discover: undefined; // no parameters for Discover tab
    MyProfile: undefined; // no parameters for MyProfile tab
}

// navigation prop type for user stack
export type UserStackNavigationProp = NativeStackNavigationProp<UserStackParamList>;