import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import { Feather as Icon } from '@expo/vector-icons';
import BlogCard from './BlogCard';
import CarouselSkeleton from './CarouselSketon';


type CarouselProps = {
    title: string;
    datas: any[];
    onPressCard: (blogId: string) => void;
    onPressArrow?: (sort: string) => void;
    onPressProfile?: (userId: string) => void;
    onPressBookmark?: (blogId: string, isBookmarked: boolean, 
        setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>,
        setIsBookmarkedState: React.Dispatch<React.SetStateAction<boolean>>
    ) => void;
}

const Carousel: React.FC<CarouselProps> = ({ title, datas, onPressCard, onPressArrow, onPressProfile, onPressBookmark }) => {
    return (
        <View style={styles.container}>

            {/* Header Section */}
            <View style={styles.header}>
                <Text style={[globalStyles.text, styles.title]}>{title}</Text>
                <TouchableOpacity onPress={() => onPressArrow?.(title)}>
                    <Icon name="arrow-right" size={fonts.size.xxl} color="black" />
                </TouchableOpacity>
            </View>

            {/* Blog Cards Section */}
            <ScrollView 
                style={styles.itemContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 10,
                }}  
            >
                {(datas && datas.length > 0) 
                ? datas.map((data, index) => (
                    <BlogCard
                        key={`${title}-${index}`}
                        userId={data.userId}
                        _id={data._id}
                        authorId={data.authorId}
                        title={data.title}
                        text={data.text}
                        picture_path={data.picture_path}
                        createdAt={data.createdAt}
                        updatedAt={data.updatedAt}
                        isBookmarked={data.isBookmarked}
                        commentCounter={data.commentCounter}
                        onPressCard={onPressCard}
                        onPressProfile={onPressProfile}
                        onPressBookmark={onPressBookmark}
                    />
                )) : 
                <CarouselSkeleton />
                }
            </ScrollView>

        </View>
    )
}

export default Carousel

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    header: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: fonts.size.lg,
        fontWeight: fonts.weight.bold,
    },
    itemContainer: {
        flexDirection: 'row',
    },
})