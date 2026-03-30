import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import IBlog, { ExploreSortField } from "../types/BlogTypes";
import * as blogService from "../services/blogService";
import { getUserIdFromToken } from "../utils/helperFuncs";
import useInfiniteScroll from "./useInfiniteScroll";

interface IUseExplorePageParams {
    token: string;
    userId: string;
}

const useExplorePage = ({ token, userId }: IUseExplorePageParams) => {
    const resolvedUserId = userId || getUserIdFromToken(token);

    // state variables
    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // location for query parameters
    const location = useLocation();

    // extract searchName and sort parameters from the URL query string
    const query = new URLSearchParams(location.search);
    const searchName = query.get("name");
    const sort = query.get("sort") as ExploreSortField | null;

    useEffect(() => { // reset state when searchName or sort changes
        document.title = "Blog App";
        setBlogs([]);
        setHasMore(true);
        setOffset(0);
    }, [searchName, sort]);

    // function to fetch blogs based on the current offset, searchName, and sort parameters
    const fetchBlogs = useCallback(async (currentOffset: number) => {

        setIsFetching(true);

        try {
            const data = await blogService.getBlogsByQuery(token, resolvedUserId, currentOffset, sort || undefined, searchName || undefined);

            if (data.length === 0) {
                setHasMore(false);
                return;
            }

            setBlogs((prevBlogs) => (prevBlogs ? [...prevBlogs, ...data] : [...data]));
        } finally {
            setIsFetching(false);
        }
    }, [resolvedUserId, searchName, sort, token]);

    // useEffect to fetch blogs when the component mounts or when the offset changes, as long as there are more blogs to fetch
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
        isFetching,
        loaderRef,
        searchName,
    };
};

export default useExplorePage;