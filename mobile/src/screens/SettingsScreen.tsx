import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import { colors } from '../constants/color';
import fonts from '../constants/fonts';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/app/store';
import { logoutThunk } from '../redux/features/user';
import CustomModal from '../components/CustomModal';
import * as api from "../api/api";
import { imgPathConverter } from '../utils/helpers';
import * as ImagePicker from 'expo-image-picker';

type SettingItemProps = {
    title: string;
    text: string;
    iconName: keyof typeof Icon.glyphMap;
    onPress: () => void;
};

const SettingsScreen: React.FC = () => {

    const user = useSelector((state: any) => state.user);

    const dispatch = useDispatch<AppDispatch>();

    const [selectedSetting, setSelectedSetting] = useState<"editProfile" | "changePassword" | null>(null); // track selected setting
    const [imageUri, setImageUri] = useState<string | null>(null); // profile image URI state
    const [username, setUsername] = useState(''); // username state
    const [currentPassword, setCurrentPassword] = useState(''); // current password state
    const [newPassword, setNewPassword] = useState(''); // new password state
    const [confirmPassword, setConfirmPassword] = useState(''); // confirm password state
    const [email, setEmail] = useState(''); // email state
    const [modalVisible, setModalVisible] = useState(false); // modal visibility state
    const [modalMessage, setModalMessage] = useState(''); // modal message state

    useEffect(() => { // populate user info on mount
        setImageUri(user.user?.picture_path || null);
        setUsername(user.user?.username || '');
        setEmail(user.user?.email || '');
    }, [user]);

    // component for individual setting item
    const SettingItem: React.FC<SettingItemProps> = ({ title, text, iconName, onPress }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <Icon name={iconName} size={fonts.size.xxl} color={colors.black} />
            <View style={styles.settingTextContainer}>
                <Text style={[globalStyles.text, styles.settingTitle]}>{title}</Text>
                <Text style={[globalStyles.text, styles.settingDescription]}>{text}</Text>
            </View>
            <Icon name="chevron-right" size={fonts.size.xl} color={colors.black} />
        </TouchableOpacity>
    );

    const pickImage = async () => { // function to pick image from gallery
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setModalMessage('Gallery access permission is required!');
            setModalVisible(true);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({ // show selection to the user
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1], // square aspect ratio
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`; // save in Base64 format
            setImageUri(base64Image);
        }
    };

    const takePhoto = async () => { // function to take photo with camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            setModalMessage('Camera access permission is required!');
            setModalVisible(true);
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImageUri(base64Image);
        }
    };

    const showImagePicker = () => { // show options to pick image
        Alert.alert(
            'Select Profile Picture',
            'Where do you want to select the photo from?',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const EditProfile: React.FC = () => ( // placeholder component for Edit Profile
        <View style={styles.formContainer}>
            <TouchableOpacity style={styles.profile} onPress={showImagePicker}>
                <Image
                    style={styles.profileImage}
                    source={
                        (imageUri)
                            ? { uri: imageUri.startsWith('data:') ? imageUri : imgPathConverter(imageUri) }
                            : require('../../assets/images/default-blog.jpg') // default profile image
                    }
                />
                <Icon name="camera" size={fonts.size.lg} color={colors.black} style={styles.cameraIcon} />
            </TouchableOpacity>
            <View style={styles.inputGroup}>
                <Text style={globalStyles.text}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize='none'
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={globalStyles.text}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => { handleSaveProfile() }}
            >
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );

    const handleSaveProfile = () => { // handle profile save logic
        if (!username || !email) { // validate inputs
            setModalMessage('Please fill in all profile fields.');
            setModalVisible(true);
            return;
        }
        const newDatas = {}; // object to hold updated fields
        if (username !== user.user.username) Object.assign(newDatas, { username }); // add username if changed
        if (email !== user.user.email) Object.assign(newDatas, { email }); // add email if changed
        if (imageUri && imageUri.startsWith('data:')) Object.assign(newDatas, { picture_path: imageUri }); // add picture if changed
        if (Object.keys(newDatas).length === 0) { // check if any changes were made
            setModalMessage('No changes to save.');
            setModalVisible(true);
            return;
        }
        api.fetchData('putUser', user.token, `/${user.user.id}`, newDatas)
            .then(() => {
                setModalMessage('Profile updated successfully!');
                setModalVisible(true);
            }).catch((error) => {
                setModalMessage(error.response?.data?.message || 'Error updating profile.');
                setModalVisible(true);
            });
    }

    const ChangePassword: React.FC = () => ( // placeholder component for Change Password
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={globalStyles.text}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    autoCapitalize='none'
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={globalStyles.text}>New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize='none'
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={globalStyles.text}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize='none'
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleChangePassword}
            >
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
        </View>
    );

    const handleChangePassword = () => { // handle password change logic
        if (!currentPassword || !newPassword || !confirmPassword) { // validate inputs
            setModalMessage('Please fill in all password fields.');
            setModalVisible(true);
            return;
        }
        if (newPassword !== confirmPassword) { // check new password match
            setModalMessage('New password and confirm password do not match.');
            setModalVisible(true);
            return;
        }
        api.fetchData('putUser', user.token, `/${user.user.id}/password`, {
            currentPassword,
            newPassword
        }).then(() => {
            setModalMessage('Password changed successfully!');
            setModalVisible(true);
        }).catch((error) => {
            setModalMessage(error.response?.data?.message || 'Error changing password.');
            setModalVisible(true);
        });
    }

    return (
        <View style={globalStyles.container}>

            {/* Modal for feedback messages */}
            <CustomModal
                visible={modalVisible}
                setVisible={setModalVisible}
                isAutoClose={true}
                message={modalMessage}
            />

            {/* Header for Back Button */}
            <View style={styles.header}>
                <BackButton />
                <Text style={[globalStyles.text, styles.headerTitle]}>Settings</Text>
            </View>

            {/* Settings Options */}
            <View style={styles.settingsList}>
                <SettingItem
                    title="Edit Profile"
                    text="Update your profile information"
                    iconName="user-circle"
                    onPress={() => { setSelectedSetting(selectedSetting === "editProfile" ? null : "editProfile"); }}
                />
                {selectedSetting === "editProfile" && <EditProfile />}
                <SettingItem
                    title="Change Password"
                    text="Update your account password"
                    iconName="lock"
                    onPress={() => { setSelectedSetting(selectedSetting === "changePassword" ? null : "changePassword"); }}
                />
                {selectedSetting === "changePassword" && <ChangePassword />}
                <SettingItem
                    title="Logout"
                    text="Sign out of your account"
                    iconName="sign-out"
                    onPress={async () => dispatch(logoutThunk())}
                />
            </View>

        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    headerTitle: {
        fontSize: fonts.size.xxl,
        fontWeight: fonts.weight.bold,
    },
    settingsList: {
        width: '85%',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.grey,
    },
    settingTextContainer: {
        flex: 1,
        marginLeft: 15,
        marginRight: 10,
    },
    settingTitle: {
        fontSize: fonts.size.md,
    },
    settingDescription: {
        fontSize: fonts.size.sm,
        color: colors.grey,
    },
    formContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profile: {
        marginBottom: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.grey2,
        borderRadius: 15,
        padding: 5,
        borderWidth: 0.5,
        borderColor: colors.black,
    },
    inputGroup: {
        marginBottom: 10,
        width: '90%',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 15,
        padding: 10,
        fontSize: fonts.size.md,
    },
    button: {
        backgroundColor: colors.black,
        borderRadius: 25,
        height: 40,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: fonts.size.md,
        fontWeight: fonts.weight.bold,
    },
});