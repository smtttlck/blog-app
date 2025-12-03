import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '../components/LoginForm';

const LoginScreen = () => {
  return (
    <SafeAreaView>
      <LoginForm />
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})