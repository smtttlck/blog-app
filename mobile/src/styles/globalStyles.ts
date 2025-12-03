import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";
import { colors } from "../constants/color";

// global styles
export const globalStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 15,
    },
    text: {
        fontFamily: fonts.fontFamily,
        fontSize: fonts.size.md,
    },
});