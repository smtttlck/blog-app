import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { globalStyles } from '../styles/globalStyles';
import * as api from "../api/api";
import TopBar from '../components/TopBar';
import Composer from '../components/Composer';
import Carousel from '../components/Carousel';
import IBlog from '../types/BlogTypes';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';

const HomeScreen: React.FC = () => {

    const user = useSelector((state: any) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    // state for posts
    const [newPosts, setNewPosts] = useState<IBlog[]>([]);
    const [topPosts, setTopPosts] = useState<IBlog[]>([]);

    useEffect(() => {

        // Latest Published
        api.fetchData("getBlog", user.token, `?sort=createdAt&sortType=DESC&limit=6&userId=${user.user?.id}`)
            .then(data => setNewPosts(data));

        // Most Bookmarked
        api.fetchData("getBlog", user.token, `?sort=bookmarkCounter&sortType=DESC&limit=6&userId=${user.user?.id}`)
            .then(data => setTopPosts(data));

    }, [user.token, user.user?.id]);

    const handlerBookmarksButton = () => { // navigate to Discover screen with onlyBookmarks filter
        navigation.navigate('Discover', { onlyBookmarks: true });
    }

    const handlerBookmark = (
        blogId: string, 
        isBookmarked: boolean, 
        setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>,
        setIsBookmarkedState: React.Dispatch<React.SetStateAction<boolean>>
    ) => { // toggle bookmark for a blog
        setIsWaiting(true); // set waiting state to true while waiting for API response
        api.fetchData((isBookmarked) ? "deleteBookmark" : "postBookmark", user.token, null, { // if already bookmarked, delete it; otherwise, create bookmark
            blogId,
            userId: user.user?.id
        })
        .then(() => setIsBookmarkedState(!isBookmarked)) // toggle bookmark state
        .finally(() => setIsWaiting(false)); // set waiting state to false after API response is received
    }

    return (
        <View style={globalStyles.container}>

            {/* Top Navigation Bar */}
            <TopBar 
                onPressBookmarks={handlerBookmarksButton}
            />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 65 }}
                showsVerticalScrollIndicator={false}
            >

                {/* Composer */}
                <Composer />

                {/* Carousels */}
                <Carousel
                    title="Latest Published"
                    datas={newPosts}
                    onPressCard={(blogId: string) => navigation.navigate('Blog', { blogId })}
                    onPressArrow={() => navigation.navigate('Discover', { sort: 'Latest Published' })}
                    onPressProfile={(userId: string) => navigation.navigate('Profile', { userId })}
                    onPressBookmark={handlerBookmark}
                />
                <Carousel
                    title="Most Bookmarked"
                    datas={topPosts}
                    onPressCard={(blogId: string) => navigation.navigate('Blog', { blogId })}
                    onPressArrow={() => navigation.navigate('Discover', { sort: 'Most Bookmarked' })}
                    onPressProfile={(userId: string) => navigation.navigate('Profile', { userId })}
                    onPressBookmark={handlerBookmark}
                />

            </ScrollView>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})