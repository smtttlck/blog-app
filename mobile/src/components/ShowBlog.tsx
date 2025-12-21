import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IBlog, { IComment } from '../types/BlogTypes';
import { colors } from '../constants/color';
import { blogDateConverter, imgPathConverter, profileImgPathConverter } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import ShowBlogSkeleton from './ShowBlogSkeleton';
import { Fontisto as Icon } from '@expo/vector-icons';

interface ShowBlogProps extends Partial<IBlog> {
    comments: IComment[] | null;
}

const ShowBlog: React.FC<ShowBlogProps> = ({ comments, ...blog }) => {

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

                    {/* Action Buttons */}
                    <TouchableOpacity style={styles.bookmarkButton}>
                        <Icon name={"bookmark"} size={fonts.size.xxl} color={colors.black} />
                    </TouchableOpacity>
                </View>

                {/* Author Info */}
                <View style={styles.profileContainer}>

                    <Image
                        source={{ uri: profileImgPathConverter(blog.authorId?.picture_path as string) }}
                        style={styles.profileImageSmall}
                        resizeMode="cover"
                    />
                    <View style={styles.profileInfo}>
                        <Text style={[globalStyles.text, styles.profileName]}>{blog.authorId?.username}</Text>
                        <TouchableOpacity style={styles.followButton}>
                            <Text style={[globalStyles.text, styles.followText]}>Follow</Text>
                        </TouchableOpacity>
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
    bookmarkButton: {
        position: 'absolute',
        top: 5,
        right: 7,
        padding: 6,
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