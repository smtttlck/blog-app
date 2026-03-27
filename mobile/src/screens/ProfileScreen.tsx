import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import React from 'react';
import { useAppSelector } from '../redux/app/hooks';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../constants/color';
import BlogCardHorizontal from '../components/BlogCardHorizontal';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import { FontAwesome as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import ProfileCardSkeleton from '../components/ProfileCardSkeleton';
import { useProfileScreenData } from '../hooks/useProfileScreenData';
import { useLoadingSpin } from '../hooks/useLoadingSpin';
import BackButton from '../components/BackButton';

interface ProfileScreenProps {
    route: {
        params: {
            userId: string;
        };
    };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route }) => {

    const user = useAppSelector((state) => state.user);

    // use userId from route params if available, otherwise use logged in user's id
    const userId: string = route?.params?.userId || user.user?.id;

    const navigation = useNavigation<UserStackNavigationProp>();

    // use custom hook to manage the state and logic for fetching and displaying the profile data, blogs, bookmarks, and comments for the profile screen
    const {
        blogs,
        isFetching,
        hasMore,
        counters,
        userInfo,
        isFollow,
        blogType,
        blogTypeChanged,
        buttonDisabled,
        isWaiting,
        toggleBookmark,
        handleLoadMore,
        handleTabChange,
        handleFollowToggle,
    } = useProfileScreenData({
        token: user.token as string,
        currentUserId: user.user?.id,
        profileUserId: userId,
    });

    const spin = useLoadingSpin();

    return (
        <View style={globalStyles.container}>

            {/* Show back button if viewing another user's profile */}
            {userId !== user.user?.id && <BackButton />}

            <FlatList
                data={blogs || []}
                renderItem={({ item }) => (
                    <BlogCardHorizontal // blog cards
                        key={item._id}
                        userId={item.authorId._id}
                        _id={item._id}
                        authorId={item.authorId}
                        title={item.title}
                        text={item.text}
                        picture_path={item.picture_path}
                        createdAt={item.createdAt}
                        updatedAt={item.updatedAt}
                        isBookmarked={item.isBookmarked}
                        commentCounter={item.commentCounter}
                        onPressCard={(blogId: string) => navigation.navigate('Blog', { blogId })}
                        onPressProfile={(userId: string) => navigation.navigate('Profile', { userId })}
                        onPressBookmark={toggleBookmark}
                        isWaiting={isWaiting}
                    />
                )}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListHeaderComponent={
                    <>
                        {/* Profile Card */}
                        {(userInfo && counters) ? (
                            <ProfileCard
                                userId={userId}
                                username={userInfo?.username}
                                picture_path={userInfo?.picture_path}
                                blogCounter={counters?.blogCounter}
                                followerCounter={counters?.followerCounter}
                                followingCounter={counters?.followingCounter}
                                isFollow={isFollow}
                                followButtonVisibility={userId !== user.user?.id}
                                followButtonDisabled={buttonDisabled}
                                onPressFollowers={() => navigation.navigate('Connections', { userId, connectionType: 'follower' })}
                                onPressFollowing={() => navigation.navigate('Connections', { userId, connectionType: 'following' })}
                                onPressFollowButton={handleFollowToggle}
                                onPressSettings={() => navigation.navigate('Settings')}
                            />
                        ) : (
                            <ProfileCardSkeleton />
                        )}

                        {/* Bar for blogs/comments/bookmarks list */}
                        <View style={[styles.tabBar, (blogTypeChanged) && { opacity: 0.5, pointerEvents: 'none' }]}>
                            <TouchableOpacity style={[styles.tabButton, blogType === "blogs" && { borderBottomColor: colors.yellow }]}
                                onPress={() => handleTabChange('blogs')}
                            >
                                <Text style={[globalStyles.text, blogType === "blogs" && { fontWeight: "bold" }]}>
                                    Blogs
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabButton, blogType === "bookmarks" && { borderBottomColor: colors.yellow }]}
                                onPress={() => handleTabChange('bookmarks')}
                            >
                                <Text style={[globalStyles.text, blogType === "bookmarks" && { fontWeight: "bold" }]}>
                                    Bookmarks
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabButton, blogType === "comments" && { borderBottomColor: colors.yellow }]}
                                onPress={() => handleTabChange('comments')}
                            >
                                <Text style={[globalStyles.text, blogType === "comments" && { fontWeight: "bold" }]}>
                                    Comments
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                ListFooterComponent={
                    (isFetching || blogTypeChanged) ?
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Icon name="spinner" size={fonts.size.xxl * 2} style={styles.loadingIcon} />
                        </Animated.View>
                        : (!hasMore && blogs && blogs.length > 0) ?
                            <View style={styles.emptyFooter}>
                            </View>
                            : null
                }
            />
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    tabBar: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    tabButton: {
        width: '33.33%',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderBottomWidth: 2,
        borderBottomColor: colors.skeletonLight,
    },
    loadingIcon: {
        alignSelf: 'center',
        marginVertical: 100,
        color: colors.black,
    },
    emptyFooter: {
        height: 65,
    },
})