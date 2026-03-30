import useAppSelector from "./useAppSelector";
import { getUserIdFromToken } from "../utils/helperFuncs";

const useWritePage = () => {
    const user = useAppSelector((state) => state.user);

    return {
        authorId: user.id || getUserIdFromToken(user.token),
        token: user.token,
    };
};

export default useWritePage;