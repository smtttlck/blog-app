import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../constants/color';
import { useSkeletonPulse } from '../hooks/useSkeletonPulse';

const ShowBlogSkeleton: React.FC = () => {
    
    const fadeAnim = useSkeletonPulse();

    return (
        <View style={styles.container}>
            {/* Blog Image Placeholder */}
            <Animated.View style={[styles.imageSkeleton, { opacity: fadeAnim }]} />

            {/* Blog Title Placeholder */}
            <Animated.View style={[styles.titleSkeleton, { opacity: fadeAnim }]} />

            {/* Author Info Placeholder */}
            <View style={styles.profileContainer}>
                <Animated.View style={[styles.profileImageSkeleton, { opacity: fadeAnim }]} />
                <View style={styles.profileInfo}>
                    <Animated.View style={[styles.profileNameSkeleton, { opacity: fadeAnim }]} />
                    <Animated.View style={[styles.followButtonSkeleton, { opacity: fadeAnim }]} />
                </View>
                <Animated.View style={[styles.dateSkeleton, { opacity: fadeAnim }]} />
            </View>

            {/* Blog Text Placeholder */}
            <Animated.View style={[styles.blogTextSkeleton, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.blogTextSkeleton, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.blogTextSkeletonShort, { opacity: fadeAnim }]} />
        </View>
    );
};

export default ShowBlogSkeleton;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    imageSkeleton: {
        width: '100%',
        height: 450,
        backgroundColor: colors.skeletonLight,
        borderRadius: 10,
        marginBottom: 10,
    },
    titleSkeleton: {
        width: '70%',
        height: 24,
        backgroundColor: colors.skeletonLight,
        borderRadius: 4,
        marginBottom: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    profileImageSkeleton: {
        width: 50,
        height: 50,
        backgroundColor: colors.skeletonLight,
        borderRadius: 25,
        marginRight: 10,
    },
    profileInfo: {
        flex: 1,
    },
    profileNameSkeleton: {
        width: '60%',
        height: 16,
        backgroundColor: colors.skeletonLight,
        borderRadius: 4,
        marginBottom: 8,
    },
    followButtonSkeleton: {
        width: '40%',
        height: 16,
        backgroundColor: colors.skeletonLight,
        borderRadius: 10,
    },
    dateSkeleton: {
        width: '30%',
        height: 14,
        backgroundColor: colors.skeletonLight,
        borderRadius: 4,
        marginLeft: 'auto',
    },
    blogTextSkeleton: {
        width: '100%',
        height: 18,
        backgroundColor: colors.skeletonLight,
        borderRadius: 4,
        marginBottom: 10,
    },
    blogTextSkeletonShort: {
        width: '70%',
        height: 18,
        backgroundColor: colors.skeletonLight,
        borderRadius: 4,
        marginBottom: 10,
    },
});