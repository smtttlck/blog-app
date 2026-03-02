import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import { IUserWithFollowStatus } from '../types/UserTypes';
import { imgPathConverter } from '../utils/helpers';
import { useAppSelector } from '../redux/app/hooks';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { useLoadingSpin } from '../hooks/useLoadingSpin';
import { useProfileListData } from '../hooks/useProfileListData';

interface ProfileListProps {
    connectionType: 'follower' | 'following';
    setConnectionType?: (type: 'follower' | 'following') => void;
    users?: Array<IUserWithFollowStatus> | null;
    onUserPress?: (userId: string) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ connectionType, setConnectionType, users, onUserPress }) => {

    const user = useAppSelector((state) => state.user);

    const spin = useLoadingSpin();

    // use custom hook to manage the follow status and button disabled state for each user in the list, 
    // as well as the function to handle toggling the follow status
    const {
        userFollowStatus,
        buttonDisabled,
        handleFollowToggle,
    } = useProfileListData({
        users,
        token: user.token as string,
        currentUserId: user.user?.id,
    });

    return (
        <ScrollView style={styles.container}>

            {/* Buttons to switch between Followers and Following */}
            <View style={styles.switchButtonsContainer}>
                <TouchableOpacity onPress={() => setConnectionType && setConnectionType('follower')}>
                    <Text style={[styles.switchButton, globalStyles.text, connectionType === 'follower' && styles.activeButton]}>
                        Followers
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setConnectionType && setConnectionType('following')}>
                    <Text style={[styles.switchButton, globalStyles.text, connectionType === 'following' && styles.activeButton]}>
                        Following
                    </Text>
                </TouchableOpacity>
            </View>

            {/* User List */}
            {!users || users.length === 0 ? (
                // Loading Spinner
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Icon name="spinner" size={fonts.size.xxl * 2} style={styles.loadingIcon} />
                </Animated.View>
            ) : (
                users.map((userItem, index) => (
                    <View key={`user-${index}`} style={styles.userItem}>
                        {/* User Image and Name */}
                        <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => onUserPress && onUserPress(userItem._id)}
                        >
                            <Image
                                source={{ uri: imgPathConverter(userItem.picture_path as string) }}
                                style={styles.profileImage}
                            />
                            <Text style={globalStyles.text}>{userItem.username}</Text>
                        </TouchableOpacity>

                        {/* Follow Button */}
                        {user.user?.id !== userItem._id && (
                            <TouchableOpacity
                                style={[
                                    styles.followButton,
                                    { backgroundColor: buttonDisabled[userItem._id] ? colors.grey : colors.yellow }
                                ]}
                                onPress={() => handleFollowToggle(userItem._id)}
                                disabled={buttonDisabled[userItem._id]}
                            >
                                <Text style={[globalStyles.text, styles.buttonText]}>
                                    {userFollowStatus[userItem._id] ? "Unfollow" : "Follow"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            )}

        </ScrollView>
    )
}

export default ProfileList

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    switchButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    switchButton: {
        fontSize: fonts.size.lg,
        width: 120,
        textAlign: 'center',
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: colors.white,
        color: colors.black,
        outlineColor: colors.black,
        outlineWidth: 2,
        fontWeight: fonts.weight.bold,
    },
    activeButton: {
        backgroundColor: colors.black,
        color: colors.white,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    followButton: {
        position: 'absolute',
        right: 0,
        width: 85,
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: colors.yellow,
        borderRadius: 20,
    },
    buttonText: {
        color: colors.white,
    },
    loadingIcon: {
        alignSelf: 'center',
        marginVertical: 100,
        color: colors.black,
    },
})