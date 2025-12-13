import { ScrollView, StyleSheet, View } from "react-native";
import BlogCardSkeleton from "./BlogCardSkeleton";

const CarouselSkeleton = () => {
  return (
    <View style={styles.container}>

      {/* Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        <BlogCardSkeleton />
        <BlogCardSkeleton />
        <BlogCardSkeleton />
      </ScrollView>
    </View>
  );
};

export default CarouselSkeleton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
});