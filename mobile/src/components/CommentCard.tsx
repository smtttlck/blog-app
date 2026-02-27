import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IComment } from '../types/BlogTypes';
import { blogDateConverter, imgPathConverter, profileImgPathConverter } from '../utils/helpers';
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import { Feather as Icon } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

interface CommentCardProps extends IComment {
    onCommentDeleted?: (commentId: string) => void; // callback to notify parent component of deleted comment
}

const CommentCard: React.FC<CommentCardProps> = ({ _id, userId, text, createdAt, onCommentDeleted }) => {

    const user = useSelector((state: any) => state.user);

    let imgPath; // initialize imgPath variable
    try {
        imgPath = profileImgPathConverter(userId.picture_path); // convert profile image path
    } catch {
        imgPath = imgPathConverter(userId.picture_path); // fallback to old converter if new one fails
    }
    const profileImagePath = imgPath; // use the resolved image path

    return (
        <View style={styles.commentCard}>

            <Image
                source={profileImagePath ? { uri: profileImagePath } : require('../../assets/images/default-blog.jpg')}
                style={styles.commentProfileImage}
                resizeMode="cover"
            />
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={[globalStyles.text, styles.userNameText]}>{userId.username}</Text>
                    <View style={styles.commentDateContainer}>
                        {user.user?.id === userId._id &&  // only show delete button if the comment belongs to the current user
                            <TouchableOpacity onPress={() => _id && onCommentDeleted && onCommentDeleted(_id)}>
                                <Icon name="trash-2" size={fonts.size.lg} color={colors.red} />
                            </TouchableOpacity>
                        }
                        <Text style={styles.commentDate}>{blogDateConverter(createdAt.toString())}</Text>
                    </View>
                </View>
                <Text style={[globalStyles.text, styles.commentText]}>{text}</Text>
            </View>

        </View>
    )
}

export default CommentCard

const styles = StyleSheet.create({
    commentCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 12,
    },
    commentProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userNameText: {
        fontSize: fonts.size.sm,
        fontWeight: 'bold',
    },
    commentDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    commentText: {
        fontSize: fonts.size.md,
        marginBottom: 2,
    },
    commentDate: {
        fontSize: fonts.size.xsm,
        color: colors.grey,
    },
});