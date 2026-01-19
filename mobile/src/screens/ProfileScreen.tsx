import { Animated, Easing, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import React, { useEffect, useRef, useState } from 'react';
import * as api from "../api/api";
import { useSelector } from 'react-redux';
import IUser from '../types/UserTypes';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../constants/color';
import IBlog from '../types/BlogTypes';
import BlogCardHorizontal from '../components/BlogCardHorizontal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import { FontAwesome as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import ProfileCardSkeleton from '../components/ProfileCardSkeleton';

interface ProfileScreenProps {
    route: {
        params: {
            userId: string;
        };
    };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route }) => {

    const user = useSelector((state: any) => state.user);

    // use userId from route params if available, otherwise use logged in user's id
    const userId: string = route?.params?.userId || user.user?.id;

    const navigation = useNavigation<UserStackNavigationProp>();

    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0); // for pagination
    const [isFetching, setIsFetching] = useState<boolean>(false); // to prevent multiple fetches
    const [hasMore, setHasMore] = useState<boolean>(true); // to check if more blogs are available
    const [counters, setCounters] = useState<any>({}); // to store blog, follower, following counters
    const [userInfo, setUserInfo] = useState<any>({}); // to store user info
    const [isFollow, setIsFollow] = useState<boolean>(false); // to check if the logged in user follows this profile
    const [blogType, setBlogType] = useState<"blogs" | "bookmarks" | "comments">("blogs"); // to switch between blogs, bookmarks, comments
    const [blogTypeChanged, setBlogTypeChanged] = useState<boolean>(false); // to track blog type change
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false); // to disable follow button during API call

    const spinValue = useRef(new Animated.Value(0)).current; // for loading spinner animation
    const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

    const handleFollowToggle = (id: string): void => { // handle follow/unfollow button press
        setButtonDisabled(true);
        api.fetchData(
            `${isFollow ? "delete" : "post"}Follow`,
            user.token,
            null,
            { followerUserId: user.user?.id, followingUserId: id })
            .then(() => {
                setIsFollow(!isFollow);
                // update follower counter
                setCounters((prevCounters: any) => ({
                    ...prevCounters,
                    followerCounter: isFollow ? prevCounters.followerCounter - 1 : prevCounters.followerCounter + 1
                }));
            })
            .finally(() => setButtonDisabled(false));
    };

    useEffect(() => { // loading spinner animation
        if (isFetching || blogTypeChanged) {
            if (!spinAnimation.current) {
                spinAnimation.current = Animated.loop(
                    Animated.timing(spinValue, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                );
                spinAnimation.current.start();
            }
        } else {
            if (spinAnimation.current) {
                spinAnimation.current.stop();
                spinAnimation.current = null;
                spinValue.setValue(0);
            }
        }
    }, [isFetching, blogTypeChanged]);

    const spin = spinValue.interpolate({ // interpolate spin value to degrees
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const fetchBlogs = async (currentOffset: number = offset) => { // fetch blogs based on blogType
        if (isFetching) return; // prevent multiple simultaneous fetches

        if (blogTypeChanged) {
            setBlogs(null);
            setOffset(0);
            setHasMore(true);
            currentOffset = 0;
        }

        setIsFetching(true);
        let query: string = `?limit=6&offset=${currentOffset}`;
        if (blogType === "bookmarks")
            query += `&onlyBookmarks=true&userId=${userId}`;
        else if (blogType === "blogs")
            query += `&authorId=${userId}`;
        else if (blogType === "comments")
            query += `&onlyComments=true&userId=${userId}`;

        try {
            const data: IBlog[] = await api.fetchData("getBlog/", user.token, query) || [];

            if (blogTypeChanged) { // if blog type changed, reset blogs state
                setBlogs(data);
                setOffset(6);
            } else if (data.length > 0) { // append new blogs to existing list for pagination
                setBlogs(prevBlogs => [...(prevBlogs || []), ...data]);
                setOffset(prev => prev + data.length);
            }
            setBlogTypeChanged(false);

            // Check if there are more blogs to load
            if (data.length < 6) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setIsFetching(false);
        }
    }

    useFocusEffect( // fetch user info and counters when screen is focused
        React.useCallback(() => {
            setBlogTypeChanged(true); // to show loading spinner while fetching blogs
            setBlogs(null); // reset blogs to show loading spinner
            setUserInfo({}); // reset user info to show skeleton
            setCounters({}); // reset counters to show skeleton

            const getCounters = async () => {
                const blogCounter: number = await api.fetchData(`getBlog/count/${userId}`, user.token, null);
                const followerCounter: number = await api.fetchData(`getFollow/follower/${userId}`, user.token, "?onlyCount=true");
                const followingCounter: number = await api.fetchData(`getFollow/following/${userId}`, user.token, "?onlyCount=true");
                setCounters({ blogCounter, followerCounter, followingCounter });
            };

            getCounters();

            api.fetchData(`getUser/${userId}`, user.token, null)
                .then((data: IUser) => {
                    api.fetchData("getFollow/", user.token, `?followerUserId=${user.user?.id}&followingUserId=${userId}`)
                        .then(follow => {
                            setIsFollow(!!follow);
                            setUserInfo({ username: data.username, picture_path: data.picture_path });
                        });
                });
        }, [userId])
    );

    useFocusEffect( // refetch blogs when screen is focused or blogType/userId changes
        React.useCallback(() => {
            setOffset(0);
            setHasMore(true);
            setBlogTypeChanged(true);
            fetchBlogs(0);
        }, [userId, blogType])
    );


    const handleLoadMore = () => { // load more blogs when end is reached
        if (!isFetching && hasMore) {
            fetchBlogs();
        }
    };

    return (
        <View style={globalStyles.container}>
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
                    />
                )}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListHeaderComponent={
                    <>
                        {/* Profile Card */}
                        {(userInfo && Object.keys(userInfo).length > 0 && counters && Object.keys(counters).length > 0) ? (
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
                            />
                        ) : (
                            <ProfileCardSkeleton />
                        )}

                        {/* Bar for blogs/comments/bookmarks list */}
                        <View style={[styles.tabBar, (blogTypeChanged) && { opacity: 0.5, pointerEvents: 'none' }]}>
                            <TouchableOpacity style={[styles.tabButton, blogType === "blogs" && { borderBottomColor: colors.yellow }]}
                                onPress={() => {
                                    setBlogType("blogs");
                                    setBlogTypeChanged(true);
                                }}
                            >
                                <Text style={[globalStyles.text, blogType === "blogs" && { fontWeight: "bold" }]}>
                                    Blogs
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabButton, blogType === "bookmarks" && { borderBottomColor: colors.yellow }]}
                                onPress={() => {
                                    setBlogType("bookmarks");
                                    setBlogTypeChanged(true);
                                }}
                            >
                                <Text style={[globalStyles.text, blogType === "bookmarks" && { fontWeight: "bold" }]}>
                                    Bookmarks
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabButton, blogType === "comments" && { borderBottomColor: colors.yellow }]}
                                onPress={() => {
                                    setBlogType("comments");
                                    setBlogTypeChanged(true);
                                }}
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