import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../constants/color';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';

interface SearchInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText }) => {
    return (
        <View style={styles.inputContainer}>
            <Icon name="magnify" size={fonts.size.xxl} />
            <TextInput
                style={styles.input}
                placeholder="Search for blog"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    )
}

export default SearchInput

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.skeletonLight,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    input: {
        marginLeft: 3,
        fontSize: fonts.size.md,
        flex: 1,
    },
})