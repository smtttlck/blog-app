import { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/app/hooks';
import ShowBlog from '../components/ShowBlog';
import { globalStyles } from '../styles/globalStyles';
import Carousel from '../components/Carousel';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import CommentBox from '../components/CommentBox';
import BackButton from '../components/BackButton';
import { useBlogScreenData } from '../hooks/useBlogScreenData';

interface BlogScreenProps { // props type for BlogScreen
    route: {
        params: {
            blogId: string;
        }
    }
}

const BlogScreen: React.FC<BlogScreenProps> = ({ route }) => {

    const { blogId } = route.params; // get blogId from route params

    const user = useAppSelector((state) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const scrollViewRef = useRef<ScrollView>(null); // ref for ScrollView

    // use custom hook to manage the state and logic for fetching and displaying the blog details, comments, 
    // other blogs by the same author, and follow status for the blog screen
    const {
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
    } = useBlogScreenData({
        blogId,
        token: user.token as string,
        currentUser: {
            id: user.user?.id,
            username: user.user?.username,
            email: user.user?.email,
            picture_path: user.user?.picture_path,
        },
    });

    useEffect(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [blogId]);

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
                    onPressDeleteBlog={async (targetBlogId: string) => {
                        const isDeleted = await handleDeleteBlog(targetBlogId);
                        if (isDeleted) {
                            navigation.goBack();
                        }
                    }}
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
