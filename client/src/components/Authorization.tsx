import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IAuthorizationProps {
    children: ReactNode;
}

const Authorization: React.FC<IAuthorizationProps> = ({ children }) => {

    const navigate = useNavigate();

    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        if (user.id === "") {
            navigate("/login");
        }
    }, [user, navigate]);

    return <>{user.id !== "" && children}</>;
}

export default Authorization