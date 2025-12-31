import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IBlog from '../types/BlogTypes';
import { Image } from 'react-native';
import { blogDateConverter, imgPathConverter, profileImgPathConverter } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import { Fontisto as Icon } from '@expo/vector-icons';

interface ICardProps extends IBlog {
    userId: string;
    onPressCard?: (blogId: string) => void;
    onPressProfile?: (userId: string) => void;
};

const BlogCard: React.FC<ICardProps> = ({
    _id, authorId, title, text, picture_path,
    updatedAt, userId, isBookmarked, commentCounter, onPressCard, onPressProfile
}) => {

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPressCard?.(_id)}>

            {/* Bookmark Button */}
            <TouchableOpacity style={styles.bookmarkButton}>
                <Icon name={isBookmarked ? "bookmark-alt" : "bookmark"} size={fonts.size.xxl} color="black" />
            </TouchableOpacity>

            {/* Blog Image */}
            <Image
                source={
                    (picture_path !== null && typeof picture_path === 'string')
                        ? { uri: imgPathConverter(picture_path) }
                        : require('../../assets/images/default-blog.jpg')
                }
                style={styles.image}
            />

            {/* Blog Title */}
            <View>
                <Text
                    style={[globalStyles.text, styles.titleText]}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                >
                    {title}
                </Text>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => onPressProfile?.(authorId?._id)}>
                    <Image
                        style={styles.profileImage}
                        source={
                            (authorId?.picture_path && typeof authorId.picture_path === 'string')
                                ? { uri: profileImgPathConverter(authorId.picture_path) }
                                : require('../../assets/images/default-blog.jpg') // default profile image
                        }
                    />
                </TouchableOpacity>
                <View style={styles.profileContainer}>
                    <TouchableOpacity onPress={() => onPressProfile?.(authorId?._id)}>
                        <Text
                            style={[globalStyles.text, styles.profileUsername]}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {authorId?.username || 'Unknown User'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.profileSubText}>
                        <Text style={[globalStyles.text, styles.blogDate]}>
                            {blogDateConverter(updatedAt.toString())}
                        </Text>
                        <Text style={[globalStyles.text, styles.blogDate]}>•</Text>
                        <Text style={[globalStyles.text, styles.commentCounterText]}>
                            <Icon name="comment" /> {commentCounter}
                        </Text>
                    </View>
                </View>
            </View>


        </TouchableOpacity>
    )
}

export default BlogCard

const styles = StyleSheet.create({
    container: {
        width: 165,
        minHeight: 250,
        maxHeight: 275,
    },
    bookmarkButton: {
        position: 'absolute',
        top: 5,
        right: 7,
        zIndex: 1,
        backgroundColor: colors.whiteOverlay,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    titleText: {
        fontWeight: fonts.weight.bold,
    },
    footer: {
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
    profileSubText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    blogDate: {
        fontSize: fonts.size.xsm,
        color: colors.grey,
        marginRight: 7,
    },
    commentCounterText: {
        fontSize: fonts.size.sm,
        color: colors.black,
    },
})