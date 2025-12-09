import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/app/store';
import { logoutThunk } from '../redux/features/user';

const HomeScreen = () => {

    useEffect(() => {
        const token = async () => {
            return await AsyncStorage.getItem("userToken");
        }
        token().then((res) => {
            console.log("Token:", res);
        })
    }, []);

    
  const dispatch = useDispatch<AppDispatch>();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>HomeScreen</Text>
            <TouchableOpacity
                style={{ marginTop: 20, padding: 10, width: 100, backgroundColor: 'lightblue' }}
                onPress={async () => {
                    dispatch(logoutThunk());
                }}
            >
                <Text>Sign Out</Text>
            </TouchableOpacity>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})