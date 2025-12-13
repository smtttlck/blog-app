import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";
import { colors } from "../constants/color";

// global styles
export const globalStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 15,
    },
    text: {
        fontFamily: fonts.fontFamily,
        fontSize: fonts.size.md,
    },
});