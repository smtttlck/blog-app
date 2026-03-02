import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { UploadImage } from '../types/ImageTypes';
import * as blogService from '../services/blog.service';

interface UseWriteBlogParams {
    token: string;
    userId: string;
    blogId?: string;
}

// custom hook to manage the state and logic for writing or editing a blog post, including handling image selection and form submission
export const useWriteBlog = ({ token, userId, blogId }: UseWriteBlogParams) => {

    // state to hold the title, text, image URI, image file, and submission state for the blog form
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [image, setImage] = useState<UploadImage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => { // function to handle image selection from the user's gallery using Expo ImagePicker

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Gallery access permission is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImage({
                uri: result.assets[0].uri,
                name: 'blog.jpg',
                type: result.assets[0].mimeType || 'image/jpeg',
            });
        }
    };
    
    // effect to initialize the form with existing blog data if editing an existing blog post, or reset the form if creating a new blog post
    useEffect(() => {
        const initializeForm = async () => {
            if (!blogId) {
                setText('');
                setTitle('');
                setImageUri(null);
                setImage(null);
                return;
            }

            const data = await blogService.getBlogById(token, blogId);
            setTitle(data.title);
            setText(data.text);

            if (data.picture_path) {
                setImageUri(data.picture_path);
                setImage({
                    uri: data.picture_path,
                    name: 'blog.jpg',
                    type: 'image/jpeg',
                });
            } else {
                setImageUri(null);
                setImage(null);
            }
        };

        initializeForm();
    }, [blogId, token]);

    // function to handle form submission for creating a new blog post or updating an existing blog post, with validation and error handling
    const handleSubmit = async (): Promise<string | null> => {
        if (!title.trim() || !text.trim()) {
            Alert.alert('Validation Error', 'Title and text cannot be empty.');
            return null;
        }

        try {
            setIsSubmitting(true);

            if (blogId) {
                const imageToUpload = image?.uri === imageUri ? image : null;
                await blogService.updateBlog(token, blogId, title, text, imageToUpload);
                return blogId;
            }

            const response: any = await blogService.createBlog(token, userId, title, text, image);
            return response?.data?._id || null;
        } catch (error) {
            Alert.alert('Request Error', blogId ? `Failed to update blog: ${error}` : `Failed to publish blog: ${error}`);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        title,
        setTitle,
        text,
        setText,
        imageUri,
        pickImage,
        handleSubmit,
        isSubmitting,
    };
};
