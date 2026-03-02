import { useState } from 'react';
import * as bookmarkService from '../services/bookmark.service';

export const useBookmark = (token: string, userId: string) => {

    const [isWaiting, setIsWaiting] = useState(false); // state to indicate whether the bookmark action is in progress

    const toggleBookmark = async (blogId: string, isBookmarked: boolean) => {
        if (!token || !userId) return; // if token or userId is not available, do not perform bookmark action
        try {
            setIsWaiting(true); // set waiting state to true while waiting for API response
            if (isBookmarked) {
                await bookmarkService.deleteBookmark(token, blogId, userId); // delete bookmark if it is currently bookmarked
            } else {
                await bookmarkService.addBookmark(token, blogId, userId); // add bookmark if it is not currently bookmarked
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error); // log any errors that occur during bookmark action
        } finally {
            setIsWaiting(false); // set waiting state to false after bookmark action is completed
        }
    };

    return { toggleBookmark, isWaiting }; // return the toggleBookmark function and isWaiting state to be used in the component
};
