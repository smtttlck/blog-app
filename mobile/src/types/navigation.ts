export type Route<K extends keyof AuthStackParamList> = { // generic route type
    name: K;
    component: React.ComponentType<any>;
};

export type AuthStackParamList = { // parameters for auth stack
    Login: undefined;
}