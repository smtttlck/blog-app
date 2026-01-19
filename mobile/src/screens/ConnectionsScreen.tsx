import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Feather as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import ProfileList from '../components/ProfileList';
import { useEffect, useState } from 'react';
import { IUserWithFollowStatus } from '../types/UserTypes';
import * as api from "../api/api";
import { useSelector } from 'react-redux';
import { IFollowConnection } from '../types/ConnectionTypes';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';

interface IConnectionsScreenProps {
    route: {
        params: {
            userId: string;
            connectionType: 'follower' | 'following';
        }
    }
}

const ConnectionsScreen: React.FC<IConnectionsScreenProps> = ({ route }) => {

    const user = useSelector((state: any) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const userId = route?.params?.userId;

    const [follows, setFollows] = useState<Array<IFollowConnection> | null>(null);
    const [users, setUsers] = useState<Array<IUserWithFollowStatus> | null>(null);
    const [connectionType, setConnectionType] = useState(route?.params?.connectionType);

    useEffect(() => {
        setFollows(null);
        setUsers(null);
        api.fetchData(`getFollow/${connectionType}/${userId}`, user.token, null)
            .then((data) => setFollows(data));
    }, [userId, connectionType]);

    useEffect(() => {
        if (follows && follows.length > 0) {
            setUsers([]); // initialize as empty array to show loading
            follows.forEach(async (follow) => {
                // determine the other user's ID based on connection type
                const otherUserId = connectionType !== 'follower' ? follow.followingUserId : follow.followerUserId;
                // fetch other user's data
                const userData: IUserWithFollowStatus = await api.fetchData(`getUser/${otherUserId}`, user.token, null);
                // check if the current user follows this other user
                userData.isFollowed = await api.fetchData(
                    `getFollow/`, 
                    user.token, 
                    `?followerUserId=${user.user?.id}&followingUserId=${otherUserId}`);
                setUsers((prevUsers) => prevUsers ? [...prevUsers, userData] : [userData]);
            })}
    }, [follows])

    return (
        <View style={globalStyles.container}>

            {/* Top Bar */}
            <TouchableOpacity style={styles.topBar} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={fonts.size.xxl * 1.2} color={colors.black} />
            </TouchableOpacity>

            {/* Profile List */}
            <ProfileList 
                connectionType={connectionType}
                setConnectionType={setConnectionType}
                users={users}
                onUserPress={(userId: string) => navigation.navigate('Profile', { userId })}
            />

        </View>
    )
}

export default ConnectionsScreen

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        paddingVertical: 10,
        marginVertical: 10,
    },
})