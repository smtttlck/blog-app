export interface ILoginValues { // for login form
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface IRegisterValues extends ILoginValues { // for registration form
    email: string;
}

export interface AuthState { // for authentication state
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse { // response from login API
  token: string;
  user: any;
}
