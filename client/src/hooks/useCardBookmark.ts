import { useEffect, useState } from "react";
import * as bookmarkService from "../services/bookmarkService";
import { getUserIdFromToken } from "../utils/helperFuncs";

interface IUseCardBookmarkParams {
    token: string;
    blogId: string;
    userId: string;
    isInitiallyBookmarked?: boolean;
}

const useCardBookmark = ({ blogId, isInitiallyBookmarked, token, userId }: IUseCardBookmarkParams) => {
    const resolvedUserId = userId || getUserIdFromToken(token);
    const [bookmark, setBookmark] = useState<boolean>(Boolean(isInitiallyBookmarked));

    useEffect(() => {
        setBookmark(Boolean(isInitiallyBookmarked));
    }, [isInitiallyBookmarked]);

    const handleBookmark = async () => {
        if (!token || !resolvedUserId) {
            return;
        }

        if (bookmark) {
            await bookmarkService.deleteBookmark(token, blogId, resolvedUserId);
            setBookmark(false);
            return;
        }

        await bookmarkService.createBookmark(token, blogId, resolvedUserId);
        setBookmark(true);
    };

    return {
        bookmark,
        handleBookmark,
    };
};

export default useCardBookmark;