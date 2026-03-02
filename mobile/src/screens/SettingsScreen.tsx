import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import { colors } from '../constants/color';
import fonts from '../constants/fonts';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/app/store';
import { logoutThunk } from '../redux/features/user';
import CustomModal from '../components/CustomModal';
import { imgPathConverter } from '../utils/helpers';
import { useSettingsData } from '../hooks/useSettingsData';
import { useAppSelector } from '../redux/app/hooks';

type SettingItemProps = {
    title: string;
    text: string;
    iconName: keyof typeof Icon.glyphMap;
    onPress: () => void;
};

const SettingsScreen: React.FC = () => {

    const user = useAppSelector((state) => state.user);

    const dispatch = useDispatch<AppDispatch>();

    // use custom hook to manage settings data and logic
    const {
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
    } = useSettingsData({
        token: user.token as string,
        user: {
            id: user.user?.id,
            username: user.user?.username,
            email: user.user?.email,
            picture_path: user.user?.picture_path,
        },
    });

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