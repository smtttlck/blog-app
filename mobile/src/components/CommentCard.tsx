import { Image, StyleSheet, Text, View } from 'react-native';
import { IComment } from '../types/BlogTypes';
import { blogDateConverter, profileImgPathConverter } from '../utils/helpers';
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';

const CommentCard: React.FC<IComment> = ({ userId, blogId, text, createdAt }) => {

    const profileImagePath = profileImgPathConverter(userId.picture_path); // Convert profile image path
    
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
                <Text style={styles.commentDate}>{blogDateConverter(createdAt.toString())}</Text>
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
    commentText: {
        fontSize: fonts.size.md,
        marginBottom: 2,
    },
    commentDate: {
        fontSize: fonts.size.xsm,
        color: colors.grey,
    },
});