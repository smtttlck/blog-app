import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IBlog, { IComment } from '../types/BlogTypes';
import { colors } from '../constants/color';
import { blogDateConverter, imgPathConverter, profileImgPathConverter } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import ShowBlogSkeleton from './ShowBlogSkeleton';
import { Fontisto as Icon, Feather as Icon2 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as api from "../api/api";
import { UserStackNavigationProp } from '../types/NavigationTypes';
import { useNavigation } from '@react-navigation/native';

interface ShowBlogProps extends Partial<IBlog> {
    comments: IComment[] | null;
    onPressProfile?: (userId: string) => void;
    isFollowing?: boolean;
    setIsFollowing?: (isFollowing: boolean) => void;
    followButtonDisabled?: boolean;
    onPressFollowButton?: (authorId: string) => void;
}

const ShowBlog: React.FC<ShowBlogProps> = ({
    comments, onPressProfile, isFollowing, setIsFollowing,
    followButtonDisabled, onPressFollowButton, ...blog
}) => {

    const user = useSelector((state: any) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const handlerDelete = () => { // delete button handler
        Alert.alert(
            "Delete Blog",
            "Are you sure you want to delete this blog?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => { // call api to delete blog
                        api.fetchData(`deleteBlog/${blog._id}`, user.token, null, null).then(() => {
                            navigation.goBack(); // navigate back to the previous screen after deletion
                        }).catch((err) => {
                            alert(`Failed to delete blog: ${err}`); // show error message on failure
                        });
                    }
                }
            ]
        );
    }

    return (
        blog?.title ? (
            <View style={styles.container}>

                {/* Blog Image */}
                <Image
                    source={{ uri: imgPathConverter(blog.picture_path as string) }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <View>
                    {/* Blog Title */}
                    <Text style={[globalStyles.text, styles.title]}>{blog.title}</Text>

                    {/* Edit & Delete Button (only show if the current user is the author) */}
                    {user.user.id === blog.authorId?._id && (
                        <>
                            <TouchableOpacity
                                style={[styles.editButton, styles.miniButton]}
                                onPress={() => navigation.navigate('MainTabs', { screen: 'Write', params: { blogId: blog._id as string } })}
                            >
                                <Icon2 name={"edit"} size={fonts.size.xxl} color={colors.black} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.deleteButton, styles.miniButton]} onPress={handlerDelete}>
                                <Icon name={"trash"} size={fonts.size.xxl} color={colors.black} />
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Bookmark Button */}
                    <TouchableOpacity style={[styles.bookmarkButton, styles.miniButton]}>
                        <Icon name={"bookmark"} size={fonts.size.xxl} color={colors.black} />
                    </TouchableOpacity>
                </View>

                {/* Author Info */}
                <View style={styles.profileContainer}>

                    <TouchableOpacity onPress={() => onPressProfile?.(blog.authorId?._id as string)}>
                        <Image
                            source={{ uri: profileImgPathConverter(blog.authorId?.picture_path as string) }}
                            style={styles.profileImageSmall}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>

                    <View style={styles.profileInfo}>
                        <TouchableOpacity onPress={() => onPressProfile?.(blog.authorId?._id as string)}>
                            <Text style={[globalStyles.text, styles.profileName]}>{blog.authorId?.username}</Text>
                        </TouchableOpacity>
                        {user.user?.id !== blog.authorId?._id && (
                            <TouchableOpacity
                                style={[
                                    styles.followButton,
                                    { backgroundColor: followButtonDisabled ? colors.grey : colors.yellow }
                                ]}
                                onPress={() => onPressFollowButton?.(blog.authorId?._id as string)}
                                disabled={followButtonDisabled}
                            >
                                <Text style={[globalStyles.text, styles.followText]}>
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={[globalStyles.text, styles.dateText]}>
                        {blogDateConverter(blog.createdAt?.toString() || '')}
                    </Text>

                </View>

                {/* Blog Content */}
                <Text style={[globalStyles.text, styles.blogText]}>
                    {blog.text}
                </Text>

            </View>
        ) : (
            <ShowBlogSkeleton />
        )
    )
}

export default ShowBlog

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    image: {
        width: '100%',
        height: 450,
        borderRadius: 10,
    },
    title: {
        fontSize: fonts.size.xxl,
        fontWeight: fonts.weight.bold,
        marginVertical: 10,
        paddingHorizontal: 5,
    },
    miniButton: {
        position: 'absolute',
        top: 10,
        padding: 6,
    },
    editButton: {
        right: 90,
    },
    deleteButton: {
        right: 45,
    },
    bookmarkButton: {
        right: 7,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    profileImageSmall: {
        width: 70,
        height: 70,
        borderRadius: 40,
    },
    profileInfo: {
        marginLeft: 7,
        alignContent: 'flex-end',
    },
    profileName: {
        fontSize: fonts.size.sm,
        color: colors.grey,
    },
    followButton: {
        backgroundColor: colors.yellow,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    followText: {
        color: colors.white,
        fontSize: fonts.size.sm,
    },
    dateText: {
        marginLeft: 'auto',
        fontSize: fonts.size.sm,
        color: colors.grey,
    },
    blogText: {
        fontSize: fonts.size.lg,
        lineHeight: 24,
        paddingHorizontal: 10,
        marginTop: 10,
    },
})