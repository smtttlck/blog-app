import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/user";
import useAppSelector from "./useAppSelector";

const useNavbar = () => {

    // get the current path, navigation function, dispatch function, and user data from the Redux store
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // extract the current page path from the URL and create a ref for the search bar input
    const pagePath = location.pathname.split("/")[1] || "";
    const searchBarRef = useRef<HTMLInputElement>(null);
    const user = useAppSelector((state) => state.user);

    // function to handle search action, which navigates to the explore page with the search query as a URL parameter
    const handleSearch = () => {
        navigate(`/explore?name=${searchBarRef.current?.value || ""}`);
    };

    // function to handle logout action, which dispatches the logout action to the Redux store and navigates to the login page
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return {
        handleLogout,
        handleSearch,
        pagePath,
        searchBarRef,
        user,
    };
};

export default useNavbar;