import { Animated, Easing, FlatList, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import SearchInput from '../components/SearchInput';
import fonts from '../constants/fonts';
import { useEffect, useRef, useState } from 'react';
import IBlog from '../types/BlogTypes';
import * as api from "../api/api";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import BlogCardHorizontal from '../components/BlogCardHorizontal';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { colors } from '../constants/color';
import { sortOptionConverter } from '../utils/helpers';

interface DiscoverScreenProps {
    route: {
        params: {
            sort?: string;
            onlyBookmarks?: boolean;
        }
    }
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ route }) => {

    const user = useSelector((state: any) => state.user);

    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0); // for pagination
    const [isFetching, setIsFetching] = useState<boolean>(false); // to prevent multiple fetches
    const [hasMore, setHasMore] = useState<boolean>(true); // to check if more blogs are available
    const [searchQuery, setSearchQuery] = useState<string>(""); // for search input
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(""); // debounced search query

    const navigation = useNavigation<UserStackNavigationProp>();

    const spinValue = useRef(new Animated.Value(0)).current; // for loading spinner animation

    useEffect(() => { // loading spinner animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue, isFetching]);

    const spin = spinValue.interpolate({ // interpolate spin value to degrees
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    // debounce search query to avoid excessive API calls
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // reset blogs when debounced search query changes
    useEffect(() => {
        setBlogs([]);
        setHasMore(true);
        setOffset(0);
    }, [debouncedSearchQuery, route.params?.sort, route.params?.onlyBookmarks]);

    // fetch blogs function
    const fetchBlogs = async (offset: number) => {
        if (isFetching) return;
        setIsFetching(true);
        const fetchQuery: string =
            route.params?.onlyBookmarks
                ? `?limit=4&offset=${offset}&name=${debouncedSearchQuery}&onlyBookmarks=true&userId=${user.user?.id}`
                : `?limit=4&offset=${offset}&name=${debouncedSearchQuery}${route.params?.sort ? `&sort=${sortOptionConverter(route.params.sort)}&sortType=DESC` : ""}&userId=${user.user?.id}`;
        const data: IBlog[] = await api.fetchData("getBlog/", user.token, fetchQuery) || [];
        if (data.length === 0)
            setHasMore(false);
        else
            setBlogs(prevBlogs => [...(prevBlogs || []), ...data]);
        setIsFetching(false);
    }

    useEffect(() => {
        if (hasMore)
            fetchBlogs(offset);
    }, [offset, hasMore, debouncedSearchQuery]);

    const handleEndReached = () => {
        if (!isFetching && hasMore) {
            setOffset(prevOffset => prevOffset + 4);
        }
    };

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

            <FlatList
                data={blogs}
                keyExtractor={(blog, index) => `blog-${blog._id}-${index}`}
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
                        onPressBookmark={handlerBookmark}
                    />
                )}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={
                    <>
                        {/* Title and Search Input */}
                        <Text style={[globalStyles.text, styles.title]}>
                            {route.params?.sort ? route.params.sort : (route.params?.onlyBookmarks ? 'Bookmarks' : 'Discover')}
                        </Text>
                        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
                    </>
                }
                ListFooterComponent={
                    isFetching ?
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Icon name="spinner" size={fonts.size.xxl * 2} style={styles.loadingIcon} />
                        </Animated.View>
                        : (!hasMore && blogs && blogs.length > 0) ?
                            <View style={styles.emptyFooter}>
                            </View>
                            : null
                }
                style={styles.container}
            />


        </View>

    )
}

export default DiscoverScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        textAlign: 'left',
        fontSize: fonts.size.xl,
        paddingTop: 15,
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