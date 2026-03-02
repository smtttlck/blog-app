import { useEffect, useState } from 'react';
import IBlog from '../types/BlogTypes';
import * as blogService from '../services/blog.service';

interface UseDiscoverBlogsParams {
    token: string;
    userId: string;
    sort?: string;
    onlyBookmarks?: boolean;
}

// custom hook to fetch blogs for the Discover screen with pagination, search, and sorting options
export const useDiscoverBlogs = ({ token, userId, sort, onlyBookmarks }: UseDiscoverBlogsParams) => {

    // state to hold the fetched blogs, pagination offset, loading state, and search query
    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

    useEffect(() => { // debounce the search query to avoid excessive API calls while typing
        const timeoutId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => { // reset blogs and pagination when search query, sort option, or bookmark filter changes
        setBlogs([]);
        setHasMore(true);
        setOffset(0);
    }, [debouncedSearchQuery, sort, onlyBookmarks]);

    const fetchBlogs = async (newOffset: number) => { // fetch blogs from the API based on the current offset, search query, sort option, and bookmark filter

        if (isFetching || !token || !userId) return;

        setIsFetching(true);

        const data: IBlog[] = await blogService.getDiscoverBlogs({
            token,
            userId,
            offset: newOffset,
            searchQuery: debouncedSearchQuery,
            sort,
            onlyBookmarks,
        }) || [];

        if (data.length === 0) {
            setHasMore(false);
        } else {
            setBlogs(prevBlogs => [...(prevBlogs || []), ...data]);
        }

        setIsFetching(false);
    };

    useEffect(() => {
        if (hasMore) {
            fetchBlogs(offset);
        }
    }, [offset, hasMore, debouncedSearchQuery]);

    const handleEndReached = () => { // handle the event when the user scrolls to the end of the list
        if (!isFetching && hasMore) {
            setOffset(prevOffset => prevOffset + 4);
        }
    };

    return {
        blogs,
        isFetching,
        hasMore,
        searchQuery,
        setSearchQuery,
        handleEndReached,
    };
};
