import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import { useAppSelector } from '../redux/app/hooks';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import { useNavigation } from '@react-navigation/core';
import { useWriteBlog } from '../hooks/useWriteBlog';

interface DiscoverScreenProps {
    route: {
        params: {
            blogId?: string;
        }
    }
}

const WriteScreen: React.FC<DiscoverScreenProps> = ({ route }: DiscoverScreenProps) => {

    const user = useAppSelector((state) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const blogId: string | undefined = route.params?.blogId || undefined; // get blogId from route params (if editing an existing blog)

    // use custom hook to manage the state and logic for writing or editing a blog post, including handling image selection and form submission
    const {
        title,
        setTitle,
        text,
        setText,
        imageUri,
        pickImage,
        handleSubmit,
        isSubmitting,
    } = useWriteBlog({
        token: user.token as string,
        userId: user.user.id,
        blogId,
    });

    const handlePressSubmit = async () => { // function to handle the press event for the submit button
        const submittedBlogId = await handleSubmit();
        if (submittedBlogId) {
            navigation.navigate('Blog', { blogId: submittedBlogId });
        }
    };


    return (
        <View style={globalStyles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Show selected image */}
                {imageUri && <Image source={{ uri: imageUri }} style={styles.selectedImage} />}

                <View style={styles.header}>
                    <TouchableOpacity style={styles.addImgButton} onPress={pickImage}>
                        <Icon name="plus-box" size={fonts.size.xxl * 1.5} color={colors.black} />
                    </TouchableOpacity>
                    <TextInput
                        style={[globalStyles.text, styles.input, styles.titleInput]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Title"
                        placeholderTextColor={colors.grey}
                        multiline
                    />
                </View>
                <TextInput
                    style={[globalStyles.text, styles.input, styles.bodyInput]}
                    value={text}
                    onChangeText={setText}
                    placeholder="Write your story here..."
                    placeholderTextColor={colors.grey}
                    multiline
                />
                <TouchableOpacity style={styles.publishButton} onPress={handlePressSubmit} disabled={isSubmitting}>
                    <Text style={[globalStyles.text, styles.publishButtonText]}>
                        {blogId ? 'Update' : 'Publish'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default WriteScreen

const styles = StyleSheet.create({
    scroll: {
        width: '100%',
    },
    content: {
        paddingTop: 20,
        paddingBottom: 80,
        gap: 18,
    },
    selectedImage: {
        width: '100%',
        height: 450,
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    addImgButton: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: colors.grey2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    input: {
        backgroundColor: colors.grey2,
        borderRadius: 14,
        color: colors.black,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    titleInput: {
        flex: 1,
        minHeight: 56,
        fontSize: fonts.size.xl,
        fontWeight: fonts.weight.bold,
        lineHeight: 28,
    },
    bodyInput: {
        minHeight: 260,
        fontSize: fonts.size.md,
        fontWeight: fonts.weight.regular,
        textAlignVertical: 'top',
        lineHeight: 23,
    },
    publishButton: {
        alignSelf: 'flex-end',
        backgroundColor: colors.black,
        borderRadius: 12,
        paddingHorizontal: 28,
        paddingVertical: 12,
    },
    publishButtonText: {
        color: colors.white,
        fontSize: fonts.size.md,
        fontWeight: fonts.weight.medium,
    },
});