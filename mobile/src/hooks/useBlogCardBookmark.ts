import { useEffect, useState } from 'react';

type OnPressBookmark = (blogId: string, isBookmarked: boolean) => Promise<void> | void;

export const useBlogCardBookmark = (
    blogId: string,
    isBookmarked: boolean | undefined,
    onPressBookmark?: OnPressBookmark,
) => {
    const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

    useEffect(() => {
        setIsBookmarkedState(isBookmarked);
    }, [isBookmarked]);

    const handleBookmarkPress = async () => { // function to handle bookmark button press
        const currentBookmarkState = Boolean(isBookmarkedState);
        try {
            await onPressBookmark?.(blogId, currentBookmarkState);
            setIsBookmarkedState(!currentBookmarkState);
        } catch (error) {
            console.error('Error while toggling bookmark in BlogCard:', error);
        }
    };

    return { isBookmarkedState, handleBookmarkPress };
};
