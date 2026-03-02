import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import IBlog from '../types/BlogTypes';
import * as blogService from '../services/blog.service';
import * as followService from '../services/follow.service';
import * as userService from '../services/user.service';
import { useBookmark } from './useBookmark';

type BlogType = 'blogs' | 'bookmarks' | 'comments';

interface ProfileCounters {
    blogCounter: number;
    followerCounter: number;
    followingCounter: number;
}

interface ProfileUserInfo {
    username: string;
    picture_path?: string;
}

interface UseProfileScreenDataParams {
    token: string;
    currentUserId: string;
    profileUserId: string;
}

export const useProfileScreenData = ({
    token,
    currentUserId,
    profileUserId,
}: UseProfileScreenDataParams) => {

    /* 
        state to hold the fetched blogs, pagination offset, loading state, whether there are more blogs to load, 
        profile counters (blog count, follower count, following count), user info (username and profile picture), follow status, 
        selected blog type (blogs, bookmarks, or comments), whether the blog type has changed, and whether the follow/unfollow button is disabled 
    */
    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [counters, setCounters] = useState<ProfileCounters | null>(null);
    const [userInfo, setUserInfo] = useState<ProfileUserInfo | null>(null);
    const [isFollow, setIsFollow] = useState<boolean>(false);
    const [blogType, setBlogType] = useState<BlogType>('blogs');
    const [blogTypeChanged, setBlogTypeChanged] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const { toggleBookmark, isWaiting } = useBookmark(token, currentUserId);

    // function to fetch blogs for the profile screen based on the current offset, selected blog type, and whether the blog type has changed (to reset pagination)
    const fetchBlogs = async (currentOffset: number = offset) => {
        if (isFetching) return;

        if (blogTypeChanged) {
            setBlogs(null);
            setOffset(0);
            setHasMore(true);
            currentOffset = 0;
        }

        setIsFetching(true);
        try {
            const data: IBlog[] = await blogService.getProfileBlogs({
                token,
                userId: profileUserId,
                offset: currentOffset,
                blogType,
            }) || [];

            if (blogTypeChanged) {
                setBlogs(data);
                setOffset(6);
            } else if (data.length > 0) {
                setBlogs(prevBlogs => [...(prevBlogs || []), ...data]);
                setOffset(prev => prev + data.length);
            }

            setBlogTypeChanged(false);

            if (data.length < 6) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching profile blogs:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleLoadMore = () => { // function to handle loading more blogs when the user scrolls to the end of the list
        if (!isFetching && hasMore) {
            fetchBlogs();
        }
    };

    const handleTabChange = (type: BlogType) => { // function to handle changing the selected blog type (blogs, bookmarks, or comments) and reset the blog list and pagination
        setBlogType(type);
        setBlogTypeChanged(true);
    };

    const handleFollowToggle = async (id: string) => {
        setButtonDisabled(true);
        try {
            await followService.toggleFollow(token, currentUserId, id, isFollow);
            setIsFollow(prevIsFollow => {
                const nextIsFollow = !prevIsFollow;
                setCounters(prevCounters => {
                    if (!prevCounters) return prevCounters;

                    return {
                        ...prevCounters,
                        followerCounter: nextIsFollow
                            ? prevCounters.followerCounter + 1
                            : prevCounters.followerCounter - 1,
                    };
                });
                return nextIsFollow;
            });
        } finally {
            setButtonDisabled(false);
        }
    };

    /*
        useFocusEffect to load the profile header information (counters, user info, follow status) when the screen is focused, 
        and to load the initial set of blogs when the screen is focused or when the selected blog type changes
    */
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            setBlogTypeChanged(true);
            setBlogs(null);
            setUserInfo(null);
            setCounters(null);

            const loadProfileHeader = async () => {
                try {
                    const [blogCounter, followerCounter, followingCounter, userData, followStatus] = await Promise.all([
                        blogService.getBlogCountByUser(token, profileUserId),
                        followService.getFollowerCount(token, profileUserId),
                        followService.getFollowingCount(token, profileUserId),
                        userService.getUserById(token, profileUserId),
                        followService.getFollowStatus(token, currentUserId, profileUserId),
                    ]);

                    if (!isActive) return;

                    setCounters({ blogCounter, followerCounter, followingCounter });
                    setUserInfo({ username: userData.username, picture_path: userData.picture_path });
                    setIsFollow(followStatus);
                } catch (error) {
                    console.error('Error loading profile header:', error);
                }
            };

            loadProfileHeader();

            return () => {
                isActive = false;
            };
        }, [token, profileUserId, currentUserId])
    );

    useFocusEffect( // useFocusEffect to load the initial set of blogs when the screen is focused or when the selected blog type changes
        useCallback(() => {
            setOffset(0);
            setHasMore(true);
            setBlogTypeChanged(true);
            fetchBlogs(0);
        }, [profileUserId, blogType])
    );

    return {
        blogs,
        isFetching,
        hasMore,
        counters,
        userInfo,
        isFollow,
        blogType,
        blogTypeChanged,
        buttonDisabled,
        isWaiting,
        toggleBookmark,
        handleLoadMore,
        handleTabChange,
        handleFollowToggle,
    };
};
