import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import fonts from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/NavigationTypes';

const Composer: React.FC = () => {

    const navigation = useNavigation<UserStackNavigationProp>();

    return (
        <View style={styles.container}>

            <Image
                source={require('../../assets/images/composer.jpg')}
                style={styles.composerImage}
            />
            
            {/* Header Row */}
            <View style={styles.header}>
                <View>
                    <Text style={[globalStyles.text, styles.title]}>
                        Compose a new post
                    </Text>
                    <Text style={[globalStyles.text, styles.subtitle]}>
                        Share your thoughts with the world
                    </Text>
                </View>
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Write')}>
                <Text style={[globalStyles.text, styles.buttonText]}>
                    Compose
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default Composer;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    composerImage: {
        position: 'absolute',
        right: 5,
        width: 110,
        height: 100,
        resizeMode: 'contain',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: fonts.size.lg,
        fontWeight: fonts.weight.bold,
        color: colors.black,
    },
    subtitle: {
        fontSize: fonts.size.sm,
        color: colors.grey,
        marginTop: 3,
    },
    button: {
        marginTop: 15,
        alignSelf: 'flex-start',
        backgroundColor: colors.yellow,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    buttonText: {
        color: colors.black,
        fontSize: fonts.size.md,
        fontWeight: fonts.weight.bold,
    },
});