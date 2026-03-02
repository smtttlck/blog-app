import { useEffect, useState } from 'react';
import { IUserWithFollowStatus } from '../types/UserTypes';
import * as followService from '../services/follow.service';
import * as userService from '../services/user.service';

interface UseConnectionsDataParams {
    token: string;
    currentUserId: string;
    userId: string;
    initialConnectionType: 'follower' | 'following';
}

export const useConnectionsData = ({ // custom hook to manage the state and logic for fetching and displaying the connections (followers or following) of a user
    token,
    currentUserId,
    userId,
    initialConnectionType,
}: UseConnectionsDataParams) => {
    const [users, setUsers] = useState<Array<IUserWithFollowStatus> | null>(null);
    const [connectionType, setConnectionType] = useState<'follower' | 'following'>(initialConnectionType);

    useEffect(() => { // effect to load connections whenever the token, currentUserId, userId, or connectionType changes
        let isActive = true;

        const loadConnections = async () => {
            setUsers(null);

            try {
                const follows = await followService.getConnections(token, connectionType, userId);

                if (!isActive) return;

                if (!follows || follows.length === 0) {
                    setUsers([]);
                    return;
                }

                // fetch user data and follow status for each connection in parallel
                const usersWithFollowStatus = await Promise.all(
                    follows.map(async (follow) => {
                        const otherUserId = connectionType === 'follower'
                            ? follow.followerUserId
                            : follow.followingUserId;

                        const userData = await userService.getUserById(token, otherUserId);
                        const isFollowed = await followService.getFollowStatus(token, currentUserId, otherUserId);

                        return {
                            ...userData,
                            isFollowed,
                        };
                    })
                );

                if (isActive) {
                    setUsers(usersWithFollowStatus);
                }
            } catch (error) {
                if (isActive) {
                    setUsers([]);
                }
                console.error('Error loading connections:', error);
            }
        };

        loadConnections();

        return () => {
            isActive = false;
        };
    }, [token, currentUserId, userId, connectionType]);

    return {
        users,
        connectionType,
        setConnectionType,
    };
};
