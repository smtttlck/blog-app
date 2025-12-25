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
    }, [debouncedSearchQuery, route.params?.sort]);

    // fetch blogs function
    const fetchBlogs = async (offset: number) => {
        if (isFetching) return;
        setIsFetching(true);
        const fetchQuery: string =
            `?limit=4&offset=${offset}&name=${debouncedSearchQuery}${route.params?.sort ? `&sort=${sortOptionConverter(route.params.sort)}&sortType=DESC` : ""}&userId=${user.user?.id}`;
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
                        onPress={(blogId: string) => navigation.navigate('Blog', { blogId }
                        )}
                    />
                )}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={
                    <>
                        {/* Title and Search Input */}
                        <Text style={[globalStyles.text, styles.title]}>
                            {route.params?.sort ? route.params.sort : 'Discover'}
                        </Text>
                        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
                    </>
                }
                ListFooterComponent={
                    isFetching ?
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Icon name="spinner" size={fonts.size.xxl * 2} style={styles.loadingIcon} />
                        </Animated.View>
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
})