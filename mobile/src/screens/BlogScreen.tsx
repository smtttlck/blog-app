import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
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
    const [comments, setComments] = useState<IComment[] | null>(null); // state for comments
    const [otherBlogs, setOtherBlogs] = useState<IBlog[] | null>(null); // state for user's other blogs

    useEffect(() => {
        // fetch blog data
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
            });

        scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // scroll to top when blogId changes

    }, [blogId])

    useEffect(() => {
        // fetch comments data for the blog
        api.fetchData(`getComment/${blogId}`, user.token, null)
            .then(data => setComments(data));
    }, [blogId])

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
                />

                {/* Comments section */}
                <CommentBox 
                    comments={comments}
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
