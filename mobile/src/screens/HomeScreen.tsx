import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../redux/app/hooks';
import { globalStyles } from '../styles/globalStyles';
import TopBar from '../components/TopBar';
import Composer from '../components/Composer';
import Carousel from '../components/Carousel';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import { useBlogs } from '../hooks/useBlogs';
import { useBookmark } from '../hooks/useBookmark';

const HomeScreen: React.FC = () => {

    const user = useAppSelector((state) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const [refreshing, setRefreshing] = useState(false);

    const { blogs: newPosts, refetch: refetchLatest } = useBlogs(user.token as string, user.user?.id, "latest"); // fetch latest published blogs using custom hook
    const { blogs: topPosts, refetch: refetchMostBookmarked } = useBlogs(user.token as string, user.user?.id, "mostBookmarked"); // fetch most bookmarked blogs using custom hook

    const { toggleBookmark, isWaiting } = useBookmark(user.token as string, user.user?.id); // get the toggleBookmark function from custom hook

    const handlerBookmarksButton = () => { // navigate to Discover screen with onlyBookmarks filter
        navigation.navigate('Discover', { onlyBookmarks: true });
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([refetchLatest(), refetchMostBookmarked()]);
        } finally {
            setRefreshing(false);
        }
    }, [refetchLatest, refetchMostBookmarked]);

    return (
        <View style={globalStyles.container}>

            {/* Top Navigation Bar */}
            <TopBar 
                onPressBookmarks={handlerBookmarksButton}
            />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 65 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
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
                    onPressBookmark={toggleBookmark}
                    isWaiting={isWaiting}
                />
                <Carousel
                    title="Most Bookmarked"
                    datas={topPosts}
                    onPressCard={(blogId: string) => navigation.navigate('Blog', { blogId })}
                    onPressArrow={() => navigation.navigate('Discover', { sort: 'Most Bookmarked' })}
                    onPressProfile={(userId: string) => navigation.navigate('Profile', { userId })}
                    onPressBookmark={toggleBookmark}
                    isWaiting={isWaiting}
                />

            </ScrollView>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})