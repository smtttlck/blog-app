import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useSkeletonPulse = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [opacity]);

    return opacity;
};
