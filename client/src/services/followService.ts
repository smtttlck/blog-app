import * as api from "../api/Api";

// follow service functions for toggling follow/unfollow between users
export const toggleFollow = async (token: string, followerUserId: string, followingUserId: string, isCurrentlyFollowing: boolean): Promise<void> => {
    const values = { followerUserId: followerUserId, followingUserId: followingUserId };
    return api.fetchData(`${isCurrentlyFollowing ? "delete" : "post"}Follow`, token, values, null);
}

// follow service functions for getting the follow status between two users
export const getFollowStatus = async (token: string, followerUserId: string, followingUserId: string): Promise<boolean> => {
    const query = `?followerUserId=${followerUserId}&followingUserId=${followingUserId}`;
    const response = await api.fetchData('getFollow/', token, null, query);
    return Boolean(response);
};

// follow service functions for getting the follower count of an author
export const getFollowerCountByAuthor = async (token: string, authorId: string): Promise<number> => {
    const query = "?onlyCount=true";
    return api.fetchData(`getFollow/follower/${authorId}`, token, null, query);
};

// follow service functions for getting the following count of an author
export const getFollowingCountByAuthor = async (token: string, authorId: string): Promise<number> => {
    const query = "?onlyCount=true";
    return api.fetchData(`getFollow/following/${authorId}`, token, null, query);
};