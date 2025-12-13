import { StyleSheet, View } from 'react-native';
import LoginForm from '../components/LoginForm';
import { globalStyles } from '../styles/globalStyles';

const LoginScreen = () => {
  return (
    <View style={globalStyles.container}>
      <LoginForm />
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})