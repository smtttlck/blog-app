import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { UploadImage } from '../types/ImageTypes';
import * as userService from '../services/user.service';

interface SettingsUser {
    id: string;
    username: string;
    email: string;
    picture_path?: string;
}

interface UseSettingsDataParams {
    token: string;
    user: SettingsUser;
}

// custom hook to manage the state and logic for the settings screen, including profile editing and password changing
export const useSettingsData = ({ token, user }: UseSettingsDataParams) => {

    // state variables for managing the selected setting, profile image, username, email, password fields, and modal visibility/message
    const [selectedSetting, setSelectedSetting] = useState<'editProfile' | 'changePassword' | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [image, setImage] = useState<UploadImage | null>(null);
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        setImageUri(user?.picture_path || null);
        setUsername(user?.username || '');
        setEmail(user?.email || '');
    }, [user]);

    const showMessage = (message: string) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    // function to handle picking an image from the gallery with permission handling
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showMessage('Gallery access permission is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImage({
                uri: result.assets[0].uri,
                name: result.assets[0].fileName || 'profile.jpg',
                type: result.assets[0].mimeType || 'image/jpeg',
            });
        }
    };

    // function to handle taking a photo with the camera with permission handling
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            showMessage('Camera access permission is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImage({
                uri: result.assets[0].uri,
                name: result.assets[0].fileName || 'profile.jpg',
                type: result.assets[0].mimeType || 'image/jpeg',
            });
        }
    };

    // function to handle showing the image picker options
    const showImagePicker = () => {
        Alert.alert('Select Profile Picture', 'Where do you want to select the photo from?', [
            { text: 'Camera', onPress: takePhoto },
            { text: 'Gallery', onPress: pickImage },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleSaveProfile = async () => { // function to handle saving the profile changes with validation and error handling
        if (!username || !email) {
            showMessage('Please fill in all profile fields.');
            return;
        }

        const newDatas: { username?: string; email?: string; image?: UploadImage | null } = {};
        if (username !== user.username) newDatas.username = username;
        if (email !== user.email) newDatas.email = email;
        if (image) newDatas.image = image;

        if (Object.keys(newDatas).length === 0) {
            showMessage('No changes to save.');
            return;
        }

        try {
            await userService.updateUserProfile(token, user.id, newDatas);
            showMessage('Profile updated successfully!');
        } catch (error: any) {
            showMessage(error?.response?.data?.message || 'Error updating profile.');
        }
    };

    const handleChangePassword = async () => { // function to handle changing the password with validation and error handling
        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage('Please fill in all password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('New password and confirm password do not match.');
            return;
        }

        try {
            await userService.updateUserPassword(token, user.id, currentPassword, newPassword);
            showMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            showMessage(error?.response?.data?.message || 'Error changing password.');
        }
    };

    return {
        selectedSetting,
        setSelectedSetting,
        imageUri,
        username,
        setUsername,
        email,
        setEmail,
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        modalVisible,
        setModalVisible,
        modalMessage,
        showImagePicker,
        handleSaveProfile,
        handleChangePassword,
    };
};
