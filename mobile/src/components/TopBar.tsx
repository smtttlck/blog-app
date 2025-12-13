import { Image, StyleSheet, View } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';

const TopBar: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Logo Image */ }
            <Image
                source={require('../../assets/images/logo.jpg')}
                style={styles.logo}
            />
            {/* Bookmark Icon */ }
            <View>
                <Icon name="bookmarks-outline" size={24} color="black" />
            </View>
        </View>
    )
}

export default TopBar

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    logo: {
        height: 35,
        width: 35,
        resizeMode: 'contain',
    },
})