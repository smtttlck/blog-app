import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import * as api from "../api/api";
import { useSelector } from 'react-redux';
import IBlog, { IComment } from '../types/BlogTypes';
import ShowBlog from '../components/ShowBlog';
import { globalStyles } from '../styles/globalStyles';
import Carousel from '../components/Carousel';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import CommentBox from '../components/CommentBox';
import BackButton from '../components/BackButton';

interface BlogScreenProps { // props type for BlogScreen
    route: {
        params: {
            blogId: string;
        }
    }
}

const BlogScreen: React.FC<BlogScreenProps> = ({ route }) => {

    const { blogId } = route.params; // get blogId from route params

    const user = useSelector((state: any) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const scrollViewRef = useRef<ScrollView>(null); // ref for ScrollView

    // state for blog data
    const [blog, setBlog] = useState<IBlog | null>(null); // state for blog data
    const [newComment, setNewComment] = useState<string>(''); // state for new comment text
    const [comments, setComments] = useState<IComment[] | null>(null); // state for comments
    const [otherBlogs, setOtherBlogs] = useState<IBlog[] | null>(null); // state for user's other blogs
    const [isFollowing, setIsFollowing] = useState<boolean>(false); // state for follow status
    const [followButtonDisabled, setFollowButtonDisabled] = useState<boolean>(false); // to disable follow button during API call

    useEffect(() => { // fetch blog data
        api.fetchData(`getBlog/${blogId}`, user.token, null,)
            .then(data => {
                setBlog(data);
                // fetch other blogs by the same user
                if (data && data.authorId?._id && typeof data.authorId?._id === 'string') {
                    api.fetchData(
                        `getBlog`,
                        user.token,
                        `?authorId=${data.authorId._id}&excludeBlogId=${blogId}&sort=bookmarkCounter&sortType=DESC&limit=3`)
                        .then(otherBlogsData => setOtherBlogs(otherBlogsData));
                }
                // check if the current user is following the blog author
                if (data && data.authorId?._id && typeof data.authorId?._id === 'string') {
                    api.fetchData(
                        `getFollow/`,
                        user.token,
                        `?followerUserId=${user.user?.id}&followingUserId=${data?.authorId?._id}`)
                        .then((follow) => setIsFollowing(!!follow));
                }
            });

        scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // scroll to top when blogId changes

    }, [blogId])

    useEffect(() => {
        // fetch comments data for the blog
        api.fetchData(`getComment/${blogId}`, user.token, null)
            .then(data => setComments(data));
    }, [blogId])

    const handleFollowToggle = (id: string): void => { // handle follow/unfollow button press
        setFollowButtonDisabled(true);
        api.fetchData(
            `${isFollowing ? "delete" : "post"}Follow`,
            user.token,
            null,
            { followerUserId: user.user?.id, followingUserId: id })
            .then(() => {
                setIsFollowing(!isFollowing);
            })
            .finally(() => setFollowButtonDisabled(false));
    };

    const handleCommentAdded = (newComment: string) => { // handle new comment added
        api.fetchData(`postComment`, user.token, null, { // send new comment data to API
            userId: user.user?.id,
            blogId,
            text: newComment,
        }).then((response: any) => { // on successful API response, add the new comment to the comments list
            const lastComment: IComment = { // create a new comment object to add to the comments list
                _id: response?.data?._id,
                userId: {
                    _id: user.user?.id || '',
                    username: user.user?.username || '',
                    email: user.user?.email || '',
                    picture_path: user.user?.picture_path || '',
                    __v: 0,
                },
                blogId,
                text: newComment,
                createdAt: new Date(),
            }
            setComments(prevComments => prevComments ? [lastComment, ...prevComments] : [lastComment]);
            setNewComment('');
        });
    };

    const handleCommentDeleted = (commentId: string) => {
        Alert.alert(
            "Delete Comment",
            "Are you sure you want to delete this comment?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        api.fetchData('deleteComment', user.token, null, {
                            _id: commentId,
                            userId: user.user?.id,
                            blogId
                        }).then(() => {
                            setComments(prevComments => prevComments ? prevComments.filter(comment => comment._id !== commentId) : null);
                        }).catch((error) => {
                            console.error("Error deleting comment:", error);
                        });
                    }
                }
            ]
        );
    };

    return (

        // KeyboardAvoidingView to handle keyboard appearance
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >

            {/* Back button to navigate back */}
            <BackButton />

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                style={styles.scrollViewContainer}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                contentContainerStyle={styles.scrollContent}
            >
                {/* Blog section */}
                <ShowBlog
                    comments={comments}
                    {...blog}
                    onPressProfile={(userId: string) => navigation.navigate('Profile', { userId })}
                    isFollowing={isFollowing}
                    setIsFollowing={setIsFollowing}
                    followButtonDisabled={followButtonDisabled}
                    onPressFollowButton={handleFollowToggle}
                />

                {/* Comments section */}
                <CommentBox
                    newComment={newComment}
                    setNewComment={setNewComment}
                    comments={comments}
                    onCommentAdded={handleCommentAdded}
                    onCommentDeleted={handleCommentDeleted}
                />

                { // Other blogs carousel if there are other blogs
                    otherBlogs && otherBlogs.length > 0 && (
                        <Carousel
                            title="More from this author"
                            datas={otherBlogs}
                            onPressCard={(blogId: string) => navigation.navigate('Blog', { blogId })}
                        />
                    )
                }
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

export default BlogScreen

const styles = StyleSheet.create({
    scrollViewContainer: {
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
});
