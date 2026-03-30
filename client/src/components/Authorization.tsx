import { ReactNode } from "react";
import useAuthorization from "../hooks/useAuthorization";
import useAppSelector from "../hooks/useAppSelector";

interface IAuthorizationProps {
    children: ReactNode;
}

const Authorization: React.FC<IAuthorizationProps> = ({ children }) => {
    const user = useAppSelector((state) => state.user);
    const isAuthorized = useAuthorization(user.token);

    return <>{isAuthorized && children}</>;
}

export default Authorization