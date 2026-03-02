import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { colors } from '../constants/color';
import { useSkeletonPulse } from '../hooks/useSkeletonPulse';

const SkeletonBox = ({ style, opacity }: { style?: any; opacity: Animated.Value }) => {
    return <Animated.View style={[styles.skeleton, style, { opacity }]} />;
};

const ProfileCardSkeleton = () => {
    
    const opacity = useSkeletonPulse();

    return (
        <View style={styles.profileCard}>
            <View style={styles.cardHeader}>
                {/* Skeleton Image */}
                <SkeletonBox style={styles.profileImage} opacity={opacity} />

                {/* Skeleton Username */}
                <SkeletonBox style={styles.username} opacity={opacity} />

                {/* Skeleton Button */}
                <SkeletonBox style={styles.followButton} opacity={opacity} />
            </View>

            {/* Skeleton Counters */}
            <View style={styles.countersContainer}>
                <View style={styles.counter}>
                    <SkeletonBox style={styles.counterNumber} opacity={opacity} />
                    <SkeletonBox style={styles.counterLabel} opacity={opacity} />
                </View>
                <View style={styles.counter}>
                    <SkeletonBox style={styles.counterNumber} opacity={opacity} />
                    <SkeletonBox style={styles.counterLabel} opacity={opacity} />
                </View>
                <View style={styles.counter}>
                    <SkeletonBox style={styles.counterNumber} opacity={opacity} />
                    <SkeletonBox style={styles.counterLabel} opacity={opacity} />
                </View>
            </View>
        </View>
    );
};

export default ProfileCardSkeleton;

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
    countersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    counter: {
        alignItems: 'center',
    },
    skeleton: {
        backgroundColor: colors.skeletonLight,
    },
    username: {
        width: '30%',
        height: 20,
        borderRadius: 4,
    },
    followButton: {
        width: 85,
        height: 30,
        borderRadius: 20,
    },
    counterNumber: {
        width: 40,
        height: 20,
        borderRadius: 4,
        marginBottom: 6,
    },
    counterLabel: {
        width: 60,
        height: 14,
        borderRadius: 4,
    },
});