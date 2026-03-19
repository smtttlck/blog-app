import IBlog from "../types/BlogTypes";

// This file contains mock data and helper functions for testing components that require blog data. 

export const basicMockBlog: Omit<IBlog, 'userId'> & { userId: string } = {
    _id: '1',
    userId: 'test-user-id',
    authorId: {
        _id: 'author1',
        username: 'testuser',
        email: 'testuser@example.com',
        picture_path: 'path/to/profile.jpg',
        __v: 0,
    },
    title: 'Test Blog Title',
    text: 'This is a test blog content.',
    picture_path: 'path/to/blog.jpg',
    isBookmarked: false,
    commentCounter: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockBlogArray:  (Omit<IBlog, 'userId'> & { userId: string })[] = [
    basicMockBlog,
    basicMockBlog,
    basicMockBlog,
];

export const basicMockUserForProfileCard = {
    userId: 'user-1',
    username: 'testuser',
    blogCounter: 10,
    followerCounter: 20,
    followingCounter: 5,
};