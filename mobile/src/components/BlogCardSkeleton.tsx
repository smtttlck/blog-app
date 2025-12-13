import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "../constants/color";

const BlogCardSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop( // Loop the animation
      Animated.sequence([ // Sequence of animations
        Animated.timing(opacity, { // Fade in
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, { // Fade out
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Bookmark Button */}
      <View style={styles.bookmarkButton} />

      {/* Image Placeholder */}
      <View style={styles.image} />

      {/* Title Placeholder */}
      <View style={styles.titleLine} />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.profileImage} />

        <View style={styles.profileContainer}>
          <View style={styles.usernameLine} />

          <View style={styles.subInfoRow}>
            <View style={styles.smallLine} />
            <View style={styles.dot} />
            <View style={[styles.smallLine, { width: 30 }]} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default BlogCardSkeleton;

const styles = StyleSheet.create({
  container: {
    width: 165,
    minHeight: 250,
    maxHeight: 275,
  },
  bookmarkButton: {
    position: "absolute",
    top: 5,
    right: 7,
    zIndex: 1,
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.skeletonLight,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: colors.skeletonLight,
  },
  titleLine: {
    height: 14,
    backgroundColor: colors.skeletonLight,
    borderRadius: 5,
    marginTop: 8,
    width: "90%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.skeletonLight,
  },

  profileContainer: {
    marginLeft: 7,
    flex: 1,
  },
  usernameLine: {
    width: "60%",
    height: 12,
    backgroundColor: colors.skeletonLight,
    borderRadius: 5,
  },
  subInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  smallLine: {
    width: 40,
    height: 10,
    backgroundColor: colors.skeletonLight,
    borderRadius: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#C0C0C0",
    marginHorizontal: 6,
  },
});