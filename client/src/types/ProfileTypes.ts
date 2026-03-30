export type ProfileBlogType = "blogs" | "bookmarks" | "comments";

export interface IProfileCounters {
    blogCounter: number;
    followerCounter: number;
    followingCounter: number;
}