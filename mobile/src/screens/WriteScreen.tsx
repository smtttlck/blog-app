import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import { useSelector } from 'react-redux';
import * as api from "../api/api";
import { useEffect, useState } from 'react';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import { UploadImage } from '../types/ImageTypes';

interface DiscoverScreenProps {
    route: {
        params: {
            blogId?: string;
        }
    }
}

const WriteScreen: React.FC<DiscoverScreenProps> = ({ route }: DiscoverScreenProps) => {

    const user = useSelector((state: any) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const blogId: string | undefined = route.params?.blogId || undefined; // get blogId from route params (if editing an existing blog)

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [image, setImage] = useState<UploadImage | null>(null);

    const pickImage = async () => { // image picker
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { // permission check
            Alert.alert('Permission required', 'Gallery access permission is required.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.8,
        });
        if (!result.canceled) { // set selected image uri
            setImageUri(result.assets[0].uri);
            setImage({
                uri: result.assets[0].uri,
                name: 'blog.jpg',
                type: result.assets[0].mimeType || 'image/jpeg'
            });
        }
    };

    const handleSubmit = (): void => { // publish button handler
        if (!title.trim() || !text.trim()) { // validate title and text
            Alert.alert('Validation Error', 'Title and text cannot be empty.');
            return;
        }
        else if (blogId) { // if editing an existing blog, call api to update blog
            const imageToUpload = image?.uri === imageUri ? image : null; // only upload new image if it has been changed
            api.fetchData(`putBlog/${blogId}`, user.token, null, { // call api to update blog
                title: title,
                text: text,
                image: imageToUpload
            }).then(() => {
                navigation.navigate('Blog', { blogId }); // navigate to the updated blog
            }).catch((err) => {
                alert(`Failed to update blog: ${err}`); // show error message on failure
            });
        }
        else { // if creating a new blog, call api to publish blog
            api.fetchData('postBlog', user.token, null, { // call api to publish blog
                title: title,
                text: text,
                authorId: user.user.id,
                image
            }).then((response: any) => {
                navigation.navigate('Blog', { blogId: response.data._id }); // navigate to the newly published blog
            }).catch((err) => {
                alert(`Failed to publish blog: ${err}`); // show error message on failure
            });
        }
    };

    useEffect(() => { // reset title and text when screen is focused
        if (!blogId) { // if creating a new blog, reset title and text
            setText('');
            setTitle('');
            setImageUri(null);
            setImage(null);
        }
        else { // if editing an existing blog, fetch blog data and set title and text
            api.fetchData(`getBlog/${blogId}`, user.token, null)
                .then(data => {
                    setTitle(data.title);
                    setText(data.text);
                    if (data.picture_path) {
                        setImageUri(data.picture_path);
                        setImage({
                            uri: data.picture_path,
                            name: 'blog.jpg',
                            type: 'image/jpeg'
                        });
                    }
                });
        }
    }, [])


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
                <TouchableOpacity style={styles.publishButton} onPress={handleSubmit}>
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