import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../constants/color';
import CheckBox from 'expo-checkbox';
import fonts from '../constants/fonts';
import { AntDesign as Icon } from '@expo/vector-icons';
import CustomModal from './CustomModal';
import { useLoginForm } from '../hooks/useLoginForm';

const LoginForm = () => {

    // use custom hook to manage the state and logic for the login/signup form, 
    // including form fields, loading state, error handling, and modal visibility/message
    const {
        loading,
        isLogin,
        setIsLogin,
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
        showPassword,
        setShowPassword,
        rememberMe,
        setRememberMe,
        modalVisible,
        setModalVisible,
        modalMessage,
        handleLogin,
        handleSignUp,
    } = useLoginForm();

    return (
        <View style={globalStyles.container}>
            {/* Modal for login failure */}
            <CustomModal 
                visible={modalVisible} 
                setVisible={setModalVisible} 
                isAutoClose={true} 
                message={modalMessage}
            />
            {/* Header Section with Logo */}
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/logo.jpg')}
                    style={styles.logo}
                />
                {/* Toggle between Login and Sign Up */}
                <View style={styles.authOptions}>
                    <TouchableOpacity onPress={() => setIsLogin(true)}>
                        <Text style={[globalStyles.text, styles.authLabel, isLogin && styles.activeAuthLabel]}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsLogin(false)}>
                        <Text style={[globalStyles.text, styles.authLabel, !isLogin && styles.activeAuthLabel]}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Form Section */}
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={[globalStyles.text, styles.label]}>Username</Text>
                    <TextInput
                        style={styles.input}
                        testID='username-input'
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize='none'
                    />
                </View>
                {!isLogin && ( // show email field only for Sign Up
                    <View style={styles.inputGroup}>
                        <Text style={[globalStyles.text, styles.label]}>Email</Text>
                        <TextInput
                            style={styles.input}
                            testID='email-input'
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize='none'
                        />
                    </View>
                )}
                <View style={styles.inputGroup}>
                    <Text style={[globalStyles.text, styles.label]}>Password</Text>
                    <TextInput
                        style={styles.input}
                        testID='password-input'
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize='none'
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        testID='toggle-password-visibility'
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Icon
                            name={showPassword ? 'eye' : 'eye-invisible'}
                            size={fonts.size.xxl}
                            color={showPassword ? colors.black : colors.black2}
                        />
                    </TouchableOpacity>
                </View>
                {isLogin && ( // show remember me checkbox only for Login
                    <View style={styles.rememberMe}>
                        <CheckBox
                            style={{ width: 18, height: 18, marginRight: 5 }}
                            value={rememberMe}
                            onValueChange={setRememberMe}
                            color={rememberMe ? colors.black : undefined}
                        />
                        <Text>Remember Me</Text>
                    </View>
                )}
            </View>
            {/* Submit Button Section */}
            <View style={styles.submit}>
                <TouchableOpacity
                    style={styles.button}
                    testID='submit-button'
                    disabled={loading}
                    onPress={() => { (isLogin) ? handleLogin() : handleSignUp() }}
                >
                    <Text style={styles.buttonText}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoginForm

const styles = StyleSheet.create({
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 65,
        height: 65,
        resizeMode: 'contain',
    },
    authOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginTop: 20,
    },
    authLabel: {
        backgroundColor: colors.white,
        outlineColor: colors.black,
        outlineWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 5,
        fontSize: fonts.size.md,
        fontWeight: fonts.weight.bold,
        width: 100,
        textAlign: 'center',
    },
    activeAuthLabel: {
        backgroundColor: colors.black,
        color: colors.white,
    },
    form: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
    },
    inputGroup: {
        marginBottom: 20,
        width: '80%',
    },
    label: {
        fontSize: fonts.size.lg,
        fontWeight: fonts.weight.medium,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.black,
        width: '100%',
        marginTop: 5,
    },
    icon: {
        position: 'absolute',
        right: 0,
        bottom: 10,
    },
    rememberMe: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '80%',
    },
    submit: {
        flex: 2,
        justifyContent: 'flex-start',
        width: '80%',
    },
    button: {
        backgroundColor: colors.black,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: fonts.size.md,
        fontWeight: fonts.weight.bold,
    },
})