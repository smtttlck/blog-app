import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import IBlog, { IComment } from '../types/BlogTypes';
import * as blogService from '../services/blog.service';
import * as commentService from '../services/comment.service';
import * as followService from '../services/follow.service';

interface UseBlogScreenDataParams {
    blogId: string;
    token: string;
    currentUser: {
        id: string;
        username: string;
        email: string;
        picture_path?: string;
    };
}

// custom hook to manage the state and logic for fetching and displaying the blog details, comments, other blogs by the same author, and follow status for the blog screen
export const useBlogScreenData = ({ blogId, token, currentUser }: UseBlogScreenDataParams) => {
    const [blog, setBlog] = useState<IBlog | null>(null);
    const [newComment, setNewComment] = useState<string>('');
    const [comments, setComments] = useState<IComment[] | null>(null);
    const [otherBlogs, setOtherBlogs] = useState<IBlog[] | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followButtonDisabled, setFollowButtonDisabled] = useState<boolean>(false);

    useEffect(() => { // effect to load blog details, comments, other blogs by the same author, and follow status when the blogId or token changes
        let isActive = true;

        const loadBlogData = async () => {
            try {
                const blogData = await blogService.getBlogById(token, blogId);
                if (!isActive) return;

                setBlog(blogData);

                if (blogData?.authorId?._id) {
                    const [otherBlogsData, followStatus] = await Promise.all([
                        blogService.getOtherBlogsByAuthor(token, blogData.authorId._id, blogId),
                        followService.getFollowStatus(token, currentUser.id, blogData.authorId._id),
                    ]);

                    if (!isActive) return;

                    setOtherBlogs(otherBlogsData);
                    setIsFollowing(followStatus);
                } else {
                    setOtherBlogs([]);
                    setIsFollowing(false);
                }
            } catch (error) {
                console.error('Error loading blog data:', error);
            }
        };

        loadBlogData();

        return () => {
            isActive = false;
        };
    }, [blogId, token, currentUser.id]);

    useEffect(() => {
        let isActive = true;

        const loadComments = async () => {
            try {
                const commentData = await commentService.getCommentsByBlogId(token, blogId);
                if (isActive) {
                    setComments(commentData);
                }
            } catch (error) {
                console.error('Error loading comments:', error);
            }
        };

        loadComments();

        return () => {
            isActive = false;
        };
    }, [blogId, token]);

    // function to handle toggling the follow status of the blog's author with error handling and button state management
    const handleFollowToggle = async (authorId: string): Promise<void> => {
        setFollowButtonDisabled(true);
        try {
            await followService.toggleFollow(token, currentUser.id, authorId, isFollowing);
            setIsFollowing(prev => !prev);
        } finally {
            setFollowButtonDisabled(false);
        }
    };

    // function to handle adding a new comment with validation and error handling
    const handleCommentAdded = async (commentText: string): Promise<void> => {
        const trimmedText = commentText.trim();
        if (!trimmedText) return;

        const response: any = await commentService.addComment(token, currentUser.id, blogId, trimmedText);
        const lastComment: IComment = {
            _id: response?.data?._id,
            userId: {
                _id: currentUser.id || '',
                username: currentUser.username || '',
                email: currentUser.email || '',
                picture_path: currentUser.picture_path || '',
                __v: 0,
            },
            blogId,
            text: trimmedText,
            createdAt: new Date(),
        };

        setComments(prevComments => (prevComments ? [lastComment, ...prevComments] : [lastComment]));
        setNewComment('');
    };

    // function to handle deleting a comment with confirmation alert and error handling
    const handleCommentDeleted = (commentId: string) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await commentService.deleteComment(token, currentUser.id, blogId, commentId);
                            setComments(prevComments =>
                                prevComments ? prevComments.filter(comment => comment._id !== commentId) : null
                            );
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                        }
                    },
                },
            ]
        );
    };

    // function to handle deleting the blog with confirmation alert and error handling, returns true if deletion was successful
    const handleDeleteBlog = async (targetBlogId: string): Promise<boolean> => {
        try {
            await blogService.deleteBlog(token, targetBlogId);
            return true;
        } catch (error) {
            Alert.alert('Delete Error', `Failed to delete blog: ${error}`);
            return false;
        }
    };

    return {
        blog,
        newComment,
        setNewComment,
        comments,
        otherBlogs,
        isFollowing,
        setIsFollowing,
        followButtonDisabled,
        handleFollowToggle,
        handleCommentAdded,
        handleCommentDeleted,
        handleDeleteBlog,
    };
};
