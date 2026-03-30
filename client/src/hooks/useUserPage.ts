import { useCallback, useEffect, useState } from "react";
import IBlog from "../types/BlogTypes";
import * as blogService from "../services/blogService";
import * as followService from "../services/followService";
import * as userService from "../services/userService";
import { IProfileCounters } from "../types/ProfileTypes";
import { getUserIdFromToken } from "../utils/helperFuncs";
import useInfiniteScroll from "./useInfiniteScroll";

interface IUseUserPageParams {
    token: string;
    currentUserId: string;
    profileUserId?: string;
}

interface IUserInfo {
    username: string;
    picture_path: string;
}

const useUserPage = ({ token, currentUserId, profileUserId }: IUseUserPageParams) => {
    const resolvedCurrentUserId = currentUserId || getUserIdFromToken(token);

    // state variables
    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [counters, setCounters] = useState<IProfileCounters>({
        blogCounter: 0,
        followerCounter: 0,
        followingCounter: 0,
    });
    const [userInfo, setUserInfo] = useState<IUserInfo>({
        username: "",
        picture_path: "",
    });
    const [isFollow, setIsFollow] = useState<boolean>(false);

    // reset blogs, offset, and hasMore when the profile user ID changes
    useEffect(() => {
        setBlogs([]);
        setOffset(0);
        setHasMore(true);
    }, [profileUserId]);

    // fetch user data, counters, and follow status when the profile user ID changes
    useEffect(() => {
        if (!profileUserId) {
            return;
        }

        let isMounted = true;

        // fetch the blog count, follower count, following count, user data, and follow status in parallel for the profile user
        const loadUserData = async () => {
            const [blogCounter, followerCounter, followingCounter, userData, isFollowing] = await Promise.all([
                blogService.getBlogCountByAuthor(token, profileUserId),
                followService.getFollowerCountByAuthor(token, profileUserId),
                followService.getFollowingCountByAuthor(token, profileUserId),
                userService.getUserById(token, profileUserId),
                followService.getFollowStatus(token, resolvedCurrentUserId, profileUserId),
            ]);

            if (!isMounted) {
                return;
            }

            setCounters({ blogCounter, followerCounter, followingCounter });
            setIsFollow(isFollowing);
            setUserInfo({
                username: userData.username,
                picture_path: userData.picture_path || "",
            });
        };

        loadUserData();

        return () => {
            isMounted = false;
        };
    }, [profileUserId, resolvedCurrentUserId, token]);

    // fetch blogs for the profile user with pagination when the offset changes
    const fetchBlogs = useCallback(async (currentOffset: number) => {
        if (!profileUserId) {
            return;
        }

        setIsFetching(true);

        try {
            const data = await blogService.getBlogsByAuthor(token, profileUserId, currentOffset, resolvedCurrentUserId);

            if (data.length === 0) {
                setHasMore(false);
                return;
            }

            setBlogs((prevBlogs) => (prevBlogs ? [...prevBlogs, ...data] : [...data]));
        } finally {
            setIsFetching(false);
        }
    }, [profileUserId, resolvedCurrentUserId, token]);

    // fetch more blogs when the offset changes and there are more blogs to fetch
    useEffect(() => {
        if (hasMore) {
            fetchBlogs(offset);
        }
    }, [fetchBlogs, hasMore, offset]);

    const onLoadMore = useCallback(() => {
        setOffset((prevOffset) => prevOffset + 4);
    }, []);

    const loaderRef = useInfiniteScroll({
        hasMore,
        isFetching,
        onLoadMore,
    });

    return {
        blogs,
        counters,
        isFetching,
        isFollow,
        loaderRef,
        setIsFollow,
        userInfo,
    };
};

export default useUserPage;