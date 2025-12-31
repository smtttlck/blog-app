import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IBlog from '../types/BlogTypes';
import { blogDateConverter, imgPathConverter, profileImgPathConverter } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';
import { Fontisto as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';

interface ICardProps extends IBlog {
    userId: string;
    onPressCard?: (blogId: string) => void;
    onPressProfile?: (userId: string) => void;
};

const BlogCardHorizontal: React.FC<ICardProps> = ({
    _id, authorId, title, text, picture_path,
    updatedAt, userId, isBookmarked, commentCounter, onPressCard, onPressProfile,
}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPressCard?.(_id)}>

            {/* Blog Image */}
            <Image
                source={
                    (picture_path !== null && typeof picture_path === 'string')
                        ? { uri: imgPathConverter(picture_path) }
                        : require('../../assets/images/default-blog.jpg')
                }
                style={styles.image}
            />

            <View style={styles.content}>

                {/* Blog Title */}
                <Text style={[globalStyles.text, styles.title]} numberOfLines={2}>{title}</Text>

                {/* Blog Excerpt */}
                <Text style={[globalStyles.text, styles.excerpt]} numberOfLines={3}>{text}</Text>

                {/* Blog Meta */}
                <TouchableOpacity style={styles.profile} onPress={() => onPressProfile?.(authorId._id)}>
                    <Image
                        style={styles.profileImage}
                        source={
                            (authorId?.picture_path && typeof authorId.picture_path === 'string')
                                ? { uri: profileImgPathConverter(authorId.picture_path) }
                                : require('../../assets/images/default-blog.jpg') // default profile image
                        }
                    />
                    <View style={styles.profileContainer}>
                        <Text
                            style={[globalStyles.text, styles.profileUsername]}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {authorId?.username || 'Unknown User'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Footer Section */}
                <View style={styles.footer}>

                    <View style={styles.infos}>
                        <Text style={[globalStyles.text, styles.commentCounterText]}>
                            {blogDateConverter(updatedAt.toString())}
                        </Text>
                        <Text style={[globalStyles.text, styles.commentCounterText]}>•</Text>
                        <Text style={[globalStyles.text, styles.commentCounterText]}>
                            <Icon name="comment" /> {commentCounter}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.bookmarkButton}>
                        <Icon name={isBookmarked ? "bookmark-alt" : "bookmark"} size={fonts.size.xxl} color={colors.black} />
                    </TouchableOpacity>

                </View>
            </View>

        </TouchableOpacity>
    )
}

export default BlogCardHorizontal

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: 160,
        flexDirection: 'row',
        backgroundColor: 'white',
        overflow: 'hidden',
        marginVertical: 7,
    },
    image: {
        width: 100,
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    content: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: fonts.size.lg,
        fontWeight: fonts.weight.bold,
    },
    excerpt: {
        fontSize: fonts.size.sm,
        color: colors.grey,
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    profileContainer: {
        marginLeft: 7,
    },
    profileUsername: {
        fontSize: fonts.size.xsm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infos: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    commentCounterText: {
        fontSize: fonts.size.xsm,
        color: colors.grey,
    },
    bookmarkButton: {
        padding: 5,
    },
})