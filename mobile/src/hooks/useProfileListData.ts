import { useEffect, useState } from 'react';
import { IUserWithFollowStatus } from '../types/UserTypes';
import * as followService from '../services/follow.service';

interface UseProfileListDataParams {
    users?: Array<IUserWithFollowStatus> | null;
    token: string;
    currentUserId: string;
}

export const useProfileListData = ({ users, token, currentUserId }: UseProfileListDataParams) => {

    // state to hold the follow status of each user and whether the follow/unfollow button is disabled for each user
    const [userFollowStatus, setUserFollowStatus] = useState<{ [key: string]: boolean }>({});
    const [buttonDisabled, setButtonDisabled] = useState<{ [key: string]: boolean }>({});

    useEffect(() => { // initialize the follow status for each user when the users prop changes
        if (users) {
            const initialStatus: { [key: string]: boolean } = {};
            users.forEach(userItem => {
                initialStatus[userItem._id] = userItem.isFollowed || false;
            });
            setUserFollowStatus(initialStatus);
        }
    }, [users]);

    // function to handle toggling the follow status of a user with optimistic UI updates and error handling
    const handleFollowToggle = async (targetUserId: string) => {
        if (!token || !currentUserId) return;

        const currentStatus = userFollowStatus[targetUserId];
        const newStatus = !currentStatus;

        setUserFollowStatus(prev => ({
            ...prev,
            [targetUserId]: newStatus,
        }));

        setButtonDisabled(prev => ({
            ...prev,
            [targetUserId]: true,
        }));

        try {
            await followService.toggleFollow(token, currentUserId, targetUserId, currentStatus);
        } catch (error) {
            setUserFollowStatus(prev => ({
                ...prev,
                [targetUserId]: currentStatus,
            }));
        } finally {
            setButtonDisabled(prev => ({
                ...prev,
                [targetUserId]: false,
            }));
        }
    };

    return {
        userFollowStatus,
        buttonDisabled,
        handleFollowToggle,
    };
};
