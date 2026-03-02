import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import SearchInput from '../components/SearchInput';
import fonts from '../constants/fonts';
import { useAppSelector } from '../redux/app/hooks';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import BlogCardHorizontal from '../components/BlogCardHorizontal';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { colors } from '../constants/color';
import { useBookmark } from '../hooks/useBookmark';
import { useDiscoverBlogs } from '../hooks/useDiscoverBlogs';
import { useLoadingSpin } from '../hooks/useLoadingSpin';

interface DiscoverScreenProps {
    route: {
        params: {
            sort?: string;
            onlyBookmarks?: boolean;
        }
    }
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ route }) => {

    const user = useAppSelector((state) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    // use custom hook to fetch blogs based on route params and manage pagination
    const {
        blogs,
        isFetching,
        hasMore,
        searchQuery,
        setSearchQuery,
        handleEndReached,
    } = useDiscoverBlogs({
        token: user.token as string,
        userId: user.user?.id,
        sort: route.params?.sort,
        onlyBookmarks: route.params?.onlyBookmarks,
    });

    const spin = useLoadingSpin(); // get the animated value for loading spinner from custom hook

    const { toggleBookmark, isWaiting } = useBookmark(user.token as string, user.user?.id); // get the toggleBookmark function from custom hook

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
                        onPressBookmark={toggleBookmark}
                        isWaiting={isWaiting}
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