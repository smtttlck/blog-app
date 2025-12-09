export type Route<K extends keyof AuthStackParamList | keyof UserStackParamList> = { // generic route type
    name: K; // name of the route
    component: React.ComponentType<any>; // component associated with the route
    isAuthRoute?: boolean; // optional flag to indicate if the route requires authentication
};

export type AuthStackParamList = { // parameters for auth stack
    Login: undefined; // no parameters for Login screen
}

export type UserStackParamList = { // parameters for user stack
    Home: undefined; // no parameters for Home screen
}