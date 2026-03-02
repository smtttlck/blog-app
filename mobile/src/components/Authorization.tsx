import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../redux/features/user";
import { AppDispatch } from "../redux/app/store";
import { useAppSelector } from "../redux/app/hooks";

interface IAuthorizationProps {
    children: ReactNode;
}

const Authorization: React.FC<IAuthorizationProps> = ({ children }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { token } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!token) { 
            // If token is lost during app usage, trigger logout
            dispatch(logoutThunk());
        }
    }, [token, dispatch]);

    return <>{token && children}</>; // render children only if user is logged in
}

export default Authorization