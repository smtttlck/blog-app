import { useEffect, useState } from "react";
import IBlog from "../types/BlogTypes";
import * as blogService from "../services/blogService";
import { getUserIdFromToken } from "../utils/helperFuncs";

interface IUseHomePageParams {
    token: string;
    userId: string;
}

const useHomePage = ({ token, userId }: IUseHomePageParams) => {
    const resolvedUserId = userId || getUserIdFromToken(token);

    // state variables
    const [isNewUser, setIsNewUser] = useState<boolean>(false);
    const [newPosts, setNewPosts] = useState<IBlog[]>([]);
    const [topPosts, setTopPosts] = useState<IBlog[]>([]);
    const [isFetchingNewPosts, setIsFetchingNewPosts] = useState<boolean>(true);
    const [isFetchingTopPosts, setIsFetchingTopPosts] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        document.title = "Blog App";

        if (localStorage.getItem("newUser")) { // check if the user is new
            setIsNewUser(true);
            localStorage.removeItem("newUser");
        }

        // fetch new posts and top posts for the home page
        blogService.getBlogs(token, resolvedUserId, "latest", 6)
            .then((data) => {
                if (isMounted) {
                    setNewPosts(data);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsFetchingNewPosts(false);
                }
            });

        blogService.getBlogs(token, resolvedUserId, "mostBookmarked", 6)
            .then((data) => {
                if (isMounted) {
                    setTopPosts(data);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsFetchingTopPosts(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [resolvedUserId, token]);

    return {
        isNewUser,
        newPosts,
        topPosts,
        isFetchingNewPosts,
        isFetchingTopPosts,
    };
};

export default useHomePage;