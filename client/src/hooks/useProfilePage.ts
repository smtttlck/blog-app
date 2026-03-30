import { useCallback, useEffect, useState } from "react";
import IBlog from "../types/BlogTypes";
import { IProfileCounters, ProfileBlogType } from "../types/ProfileTypes";
import * as blogService from "../services/blogService";
import * as followService from "../services/followService";
import { getUserIdFromToken } from "../utils/helperFuncs";
import useInfiniteScroll from "./useInfiniteScroll";

interface IUseProfilePageParams {
    token: string;
    userId: string;
    username: string;
}

const useProfilePage = ({ token, userId, username }: IUseProfilePageParams) => {
    const resolvedUserId = userId || getUserIdFromToken(token);

    // state variables
    const [blogType, setBlogType] = useState<ProfileBlogType>("blogs");
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [counters, setCounters] = useState<IProfileCounters>({
        blogCounter: 0,
        followerCounter: 0,
        followingCounter: 0,
    });

    // fetch profile counters and set document title on component mount and when username changes
    useEffect(() => {
        if (!token || !resolvedUserId) {
            return;
        }

        let isMounted = true;
        document.title = username;

        const getCounters = async () => {
            const [blogCounter, followerCounter, followingCounter] = await Promise.all([
                blogService.getBlogCountByAuthor(token, resolvedUserId),
                followService.getFollowerCountByAuthor(token, resolvedUserId),
                followService.getFollowingCountByAuthor(token, resolvedUserId),
            ]);

            if (isMounted) {
                setCounters({ blogCounter, followerCounter, followingCounter });
            }
        };

        getCounters();

        return () => {
            isMounted = false;
        };
    }, [resolvedUserId, token, username]);

    // reset blogs, hasMore, and offset when blogType or user changes
    useEffect(() => {
        setBlogs([]);
        setHasMore(true);
        setOffset(0);
    }, [blogType, resolvedUserId]);

    // fetch blogs based on the current blogType and offset
    const fetchBlogs = useCallback(async (currentOffset: number) => {
        if (!token || !resolvedUserId) {
            return;
        }

        setIsFetching(true);

        try {
            const data = (blogType === "bookmarks" || blogType === "comments")
                ? await blogService.getProfileBlogs(token, resolvedUserId, currentOffset, blogType)
                : await blogService.getBlogsByAuthor(token, resolvedUserId, currentOffset, resolvedUserId);

            if (data.length === 0) {
                setHasMore(false);
                return;
            }

            setBlogs((prevBlogs) => [...prevBlogs, ...data]);
        } finally {
            setIsFetching(false);
        }
    }, [blogType, resolvedUserId, token]);

    // fetch blogs when prerequisites are ready and pagination advances
    useEffect(() => {
        if (hasMore && token && resolvedUserId) {
            fetchBlogs(offset);
        }
    }, [fetchBlogs, hasMore, offset, resolvedUserId, token]);

    const onLoadMore = useCallback(() => {
        if (!token || !resolvedUserId) {
            return;
        }

        setOffset((prevOffset) => prevOffset + 6);
    }, [resolvedUserId, token]);

    const loaderRef = useInfiniteScroll({
        hasMore: hasMore && Boolean(token) && Boolean(resolvedUserId),
        isFetching,
        onLoadMore,
    });

    return {
        blogType,
        blogs,
        counters,
        isFetching,
        loaderRef,
        setBlogType,
    };
};

export default useProfilePage;