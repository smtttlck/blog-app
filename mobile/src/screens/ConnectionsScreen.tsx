import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Feather as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import ProfileList from '../components/ProfileList';
import { useAppSelector } from '../redux/app/hooks';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';
import { useConnectionsData } from '../hooks/useConnectionsData';

interface IConnectionsScreenProps {
    route: {
        params: {
            userId: string;
            connectionType: 'follower' | 'following';
        }
    }
}

const ConnectionsScreen: React.FC<IConnectionsScreenProps> = ({ route }) => {

    const user = useAppSelector((state) => state.user);

    const navigation = useNavigation<UserStackNavigationProp>();

    const userId = route?.params?.userId;

    // use custom hook to manage the state and logic for fetching and displaying the connections (followers or following) of a user
    const {
        users,
        connectionType,
        setConnectionType,
    } = useConnectionsData({
        token: user.token as string,
        currentUserId: user.user?.id,
        userId,
        initialConnectionType: route?.params?.connectionType,
    });

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