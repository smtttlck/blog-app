import { Animated, Easing, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import { IUserWithFollowStatus } from '../types/UserTypes';
import { imgPathConverter } from '../utils/helpers';
import { useSelector } from 'react-redux';
import * as api from "../api/api";
import { useState, useEffect, useRef } from 'react';
import { FontAwesome as Icon } from '@expo/vector-icons';

interface ProfileListProps {
    connectionType: 'follower' | 'following';
    setConnectionType?: (type: 'follower' | 'following') => void;
    users?: Array<IUserWithFollowStatus> | null;
    onUserPress?: (userId: string) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ connectionType, setConnectionType, users, onUserPress }) => {

    const user = useSelector((state: any) => state.user);

    // local state to track follow statuses for immediate UI updates
    const [userFollowStatus, setUserFollowStatus] = useState<{ [key: string]: boolean }>({});
    const [buttonDisabled, setButtonDisabled] = useState<{ [key: string]: boolean }>({}); // to disable specific follow buttons during API call

    const spinValue = useRef(new Animated.Value(0)).current; // for loading spinner animation
    const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);    
    
    // determine if we should show loading spinner (when users is null or undefined)
    const isLoading = !users;

    useEffect(() => { // loading spinner animation
        if (isLoading) {
            if (!spinAnimation.current) {
                spinAnimation.current = Animated.loop(
                    Animated.timing(spinValue, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                );
                spinAnimation.current.start();
            }
        } else {
            if (spinAnimation.current) {
                spinAnimation.current.stop();
                spinAnimation.current = null;
                spinValue.setValue(0);
            }
        }
    }, [isLoading]);
    
    const spin = spinValue.interpolate({ // interpolate spin value to degrees
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    // initialize follow status when users change
    useEffect(() => {
        if (users) {
            const initialStatus: { [key: string]: boolean } = {};
            users.forEach(userItem => {
                initialStatus[userItem._id] = userItem.isFollowed || false;
            });
            setUserFollowStatus(initialStatus);
        }
    }, [users]);

    const handleFollowToggle = async (userId: string) => { // handle follow/unfollow action
        const currentStatus = userFollowStatus[userId];
        const newStatus = !currentStatus;

        // optimistic update - immediately update UI
        setUserFollowStatus(prev => ({
            ...prev,
            [userId]: newStatus
        }));

        // disable button for this specific user
        setButtonDisabled(prev => ({
            ...prev,
            [userId]: true
        }));

        try {
            await api.fetchData(
                `${currentStatus ? "delete" : "post"}Follow`,
                user.token,
                null,
                { followerUserId: user.user?.id, followingUserId: userId }
            );
            // success 
        } catch (error) {
            // error
            setUserFollowStatus(prev => ({
                ...prev,
                [userId]: currentStatus
            }));
        } finally {
            // re-enable button for this specific user
            setButtonDisabled(prev => ({
                ...prev,
                [userId]: false
            }));
        }
    };

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