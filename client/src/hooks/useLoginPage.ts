import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAppSelector from "./useAppSelector";

const useLoginPage = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        if (user.token !== "") {
            navigate("/", { replace: true });
        }
    }, [navigate, user.token]);
};

export default useLoginPage;