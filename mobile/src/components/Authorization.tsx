import { useNavigation } from "@react-navigation/native";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";

interface IAuthorizationProps {
    children: ReactNode;
}

const Authorization: React.FC<IAuthorizationProps> = ({ children }) => {

    const navigation = useNavigation();

    const { token } = useSelector((state: any) => state.user);

    useEffect(() => {
        if (!token) { // if user is not logged in, navigate to Login screen
            navigation.navigate("Login" as never);
        }
    }, [token, navigation]);

    return <>{token && children}</>; // render children only if user is logged in
}

export default Authorization