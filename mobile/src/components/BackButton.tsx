import { StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';

const BackButton: React.FC = () => {

    const navigation = useNavigation<UserStackNavigationProp>();

    return (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={fonts.size.xxl} color="black" />
        </TouchableOpacity>
    )
}

export default BackButton

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 0,
        left: 10,
        zIndex: 10,
        backgroundColor: colors.whiteOverlay,
        padding: 10,
        borderRadius: 30,
        borderWidth: 1,
    },
});