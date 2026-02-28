import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';

type TopBarProps = {
    onPressBookmarks: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onPressBookmarks }) => {
    return (
        <View style={styles.container}>
            {/* Logo Image */ }
            <Image
                source={require('../../assets/images/logo.jpg')}
                style={styles.logo}
            />
            {/* Bookmark Icon */ }
            <TouchableOpacity onPress={onPressBookmarks}>
                <Icon name="bookmarks-outline" size={fonts.size.xxl} color="black" />
            </TouchableOpacity>
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