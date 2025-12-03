import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../constants/color';
import CheckBox from 'expo-checkbox';
import { useState } from 'react';
import fonts from '../constants/fonts';

const LoginForm = () => {

    // state variables
    const [isLogin, setIsLogin] = useState(true); // toggle between login and sign up
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // remember me checkbox state

    return (
        <View style={globalStyles.container}>
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
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                {!isLogin && ( // show email field only for Sign Up
                    <View style={styles.inputGroup}>
                        <Text style={[globalStyles.text, styles.label]}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                )}
                <View style={styles.inputGroup}>
                    <Text style={[globalStyles.text, styles.label]}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
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
                <TouchableOpacity style={styles.button}>
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