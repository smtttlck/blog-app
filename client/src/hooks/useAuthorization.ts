import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthorization = (token: string) => { // custom hook to check if the user is authorized
    const navigate = useNavigate();

    useEffect(() => {
        if (token === "") {
            navigate("/login", { replace: true });
        }
    }, [navigate, token]);

    return token !== "";
};

export default useAuthorization;