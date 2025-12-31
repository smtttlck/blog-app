import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { imgPathConverter } from '../utils/helpers';
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';

interface ProfileCardProps {
    username?: string;
    picture_path?: string;
    blogCounter?: number;
    followerCounter?: number;
    followingCounter?: number;
    isFollow?: boolean;
    followButtonVisibility?: boolean;
}

const ProfileCard = ({
    username, picture_path, blogCounter, followerCounter,
    followingCounter, isFollow, followButtonVisibility = true
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

                {/* Follow Button */}
                <TouchableOpacity
                    style={[styles.followButton,
                    { display: followButtonVisibility ? 'flex' : 'contents', pointerEvents: followButtonVisibility ? 'auto' : 'none' }
                    ]}>
                    <Text style={[globalStyles.text, styles.buttonText]}>{isFollow ? "Unfollow" : "Follow"}</Text>
                </TouchableOpacity>
            </View>

            {/* Counters */}
            <View style={styles.countersContainer}>
                <View style={styles.counter}>
                    <Text style={styles.counterNumber}>{blogCounter || 0}</Text>
                    <Text style={[globalStyles.text, styles.counterLabel]}>Blogs</Text>
                </View>
                <View style={styles.counter}>
                    <Text style={styles.counterNumber}>{followerCounter || 0}</Text>
                    <Text style={[globalStyles.text, styles.counterLabel]}>Followers</Text>
                </View>
                <View style={styles.counter}>
                    <Text style={styles.counterNumber}>{followingCounter || 0}</Text>
                    <Text style={[globalStyles.text, styles.counterLabel]}>Following</Text>
                </View>
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
        backgroundColor: colors.yellow,
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