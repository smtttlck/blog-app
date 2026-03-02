import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { profileImgPathConverter } from '../utils/helpers';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import CommentCard from './CommentCard';
import { AntDesign as Icon } from '@expo/vector-icons';
import { IComment } from '../types/BlogTypes';
import { useAppSelector } from '../redux/app/hooks';

interface CommentBoxProps {
    newComment: string; // new comment text
    setNewComment: (text: string) => void; // function to set new comment text in parent component
    comments: IComment[] | null;
    onCommentAdded?: (newComment: string) => void; // callback to notify parent component of new comment
    onCommentDeleted?: (commentId: string) => void; // callback to notify parent component of deleted comment
}

const CommentBox: React.FC<CommentBoxProps> = ({ comments, newComment, setNewComment, onCommentAdded, onCommentDeleted }) => {

    const user = useAppSelector((state) => state.user);

    const profileImagePath = profileImgPathConverter(user.user?.picture_path); // Convert profile image path

    return (
        <View style={styles.container}>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
                <Text style={[globalStyles.text, styles.commentsTitle]}>Comments</Text>
                {comments && comments.map((comment, index) => (
                    <CommentCard key={comment._id || index} {...comment} onCommentDeleted={onCommentDeleted} />
                ))}
            </View>

            {/* Add Comment Section */}
            <View style={styles.commentInputContainer}>
                <Image
                    source={profileImagePath ? { uri: profileImagePath } : require('../../assets/images/default-blog.jpg')}
                    style={styles.commentProfileImage}
                    resizeMode="cover"
                />
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    placeholderTextColor={colors.grey}
                    multiline
                    returnKeyType="send"
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => {
                    if (newComment.length > 0 && onCommentAdded) {
                        onCommentAdded(newComment);
                    }
                }}>
                    <Icon name="arrow-up" size={fonts.size.xxl} color={colors.black} />
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default CommentBox

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    commentsSection: {
        marginBottom: 20,
    },
    commentsTitle: {
        fontSize: fonts.size.xl,
        fontWeight: fonts.weight.bold,
        paddingHorizontal: 5,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: colors.white,
    },
    commentProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentInput: {
        flex: 1,
        height: 50,
        backgroundColor: colors.skeletonLight,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: fonts.size.md,
        color: colors.black,
        marginRight: 10,
    },
    sendButton: {
        padding: 8,
        borderRadius: 25,
        backgroundColor: colors.skeletonLight,
    },
})