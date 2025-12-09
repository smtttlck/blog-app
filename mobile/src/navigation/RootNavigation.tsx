import { StyleSheet } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { useEffect, useState } from 'react';
import { autoLoginThunk } from '../redux/features/user';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/app/store';
import UserStack from './UserStack';

const RootNavigation: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  
  const token = useSelector((state: any) => state.user.token); // get token from redux store
  
  useEffect(() => { // attempt auto login on component mount
    dispatch(autoLoginThunk())
  }, [dispatch]);

  return (
    <NavigationContainer>
      {token ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default RootNavigation

const styles = StyleSheet.create({})