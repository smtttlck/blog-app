import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { imgPathConverter } from '../utils/helpers';
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import { Ionicons as Icon } from '@expo/vector-icons/';

interface ProfileCardProps {
    userId: string;
    username?: string;
    picture_path?: string;
    blogCounter?: number;
    followerCounter?: number;
    followingCounter?: number;
    isFollow?: boolean;
    followButtonVisibility?: boolean;
    followButtonDisabled?: boolean;
    onPressFollowers?: () => void;
    onPressFollowing?: () => void;
    onPressFollowButton?: (id: string) => void;
    onPressSettings?: () => void;
}

const ProfileCard = ({
    userId, username, picture_path, blogCounter, followerCounter, followingCounter, isFollow, followButtonVisibility = true, 
    followButtonDisabled, onPressFollowers, onPressFollowing, onPressFollowButton, onPressSettings
}: ProfileCardProps) => {
    return (
        <View style={styles.profileCard}>

            <View style={styles.cardHeader}>
                {/* Profile Image */}
                <Image
                    source={(picture_path)
                        ? { uri: imgPathConverter(picture_path) }
                        : require('../../assets/images/default-blog.jpg')}
                    style={styles.profileImage}
                />

                {/* Username */}
                <Text style={[globalStyles.text, styles.username]}>{username || "Username"}</Text>

                {followButtonVisibility ? (
                    // Follow Button
                    <TouchableOpacity
                        style={[styles.followButton,
                        { display: followButtonVisibility ? 'flex' : 'contents', pointerEvents: followButtonVisibility ? 'auto' : 'none' },
                        { backgroundColor: followButtonDisabled ? colors.grey : colors.yellow }
                        ]}
                        onPress={() => onPressFollowButton && onPressFollowButton(userId)}
                        disabled={followButtonDisabled}
                    >
                        <Text style={[globalStyles.text, styles.buttonText]}>{isFollow ? "Unfollow" : "Follow"}</Text>
                    </TouchableOpacity>
                ) : (
                    // Setting button
                    <TouchableOpacity
                        onPress={onPressSettings}
                    >
                        <Icon name="settings-sharp" size={fonts.size.lg * 1.25} color={colors.black} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Counters */}
            <View style={styles.countersContainer}>
                <View style={styles.counter}>
                    <Text style={styles.counterNumber}>{blogCounter || 0}</Text>
                    <Text style={[globalStyles.text, styles.counterLabel]}>Blogs</Text>
                </View>
                <TouchableOpacity style={styles.counter} onPress={onPressFollowers}>
                    <Text style={styles.counterNumber}>{followerCounter || 0}</Text>
                    <Text style={[globalStyles.text, styles.counterLabel]}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.counter} onPress={onPressFollowing}>
                    <Text style={styles.counterNumber}>{followingCounter || 0}</Text>
                    <Text style={[globalStyles.text, styles.counterLabel]}>Following</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default ProfileCard

const styles = StyleSheet.create({
    profileCard: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.white,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    username: {
        fontSize: fonts.size.lg,
    },
    followButton: {
        width: 85,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonText: {
        color: colors.white,
    },
    countersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    counter: {
        alignItems: 'center',
    },
    counterNumber: {
        fontSize: fonts.size.lg,
        fontWeight: fonts.weight.bold,
    },
    counterLabel: {
        fontSize: fonts.size.sm,
        color: colors.grey,
    },
})