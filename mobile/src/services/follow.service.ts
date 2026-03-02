import * as api from '../api/api';
import { IFollowConnection } from '../types/ConnectionTypes';

export const getConnections = async (
    token: string,
    connectionType: 'follower' | 'following',
    userId: string,
): Promise<IFollowConnection[]> => {
    return api.fetchData(`getFollow/${connectionType}/${userId}`, token, null);
};

// service function to get the follower count for a user
export const getFollowerCount = async (token: string, userId: string): Promise<number> => {
    return api.fetchData(`getFollow/follower/${userId}`, token, '?onlyCount=true');
};

// service function to get the following count for a user
export const getFollowingCount = async (token: string, userId: string): Promise<number> => {
    return api.fetchData(`getFollow/following/${userId}`, token, '?onlyCount=true');
};

export const getFollowStatus = async (
    token: string,
    followerUserId: string,
    followingUserId: string,
): Promise<boolean> => { // service function to check if the current user is following the profile user
    const response = await api.fetchData(
        'getFollow/',
        token,
        `?followerUserId=${followerUserId}&followingUserId=${followingUserId}`,
    );

    return Boolean(response);
};

export const toggleFollow = async ( // service function to toggle the follow status between the current user and the profile user
    token: string,
    followerUserId: string,
    followingUserId: string,
    isCurrentlyFollowed: boolean,
) => {
    return api.fetchData(
        `${isCurrentlyFollowed ? 'delete' : 'post'}Follow`,
        token,
        null,
        { followerUserId, followingUserId },
    );
};
