import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colors } from '../constants/color';
import { useEffect } from 'react';
import { AntDesign as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import { globalStyles } from '../styles/globalStyles';
import { Dispatch, SetStateAction } from 'react';

type ModalProps = {
    visible: boolean; // modal visibility
    setVisible: Dispatch<SetStateAction<boolean>>;
    width?: number; // optional width of the modal
    isAutoClose?: boolean; // optional auto close feature
    message?: string; // optional message to display
}

const CustomModal: React.FC<ModalProps> = ({ visible, setVisible, width = 300, isAutoClose = false, message }) => {

    useEffect(() => { // auto close effect
        if (isAutoClose && visible) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2000); // Auto close after 2 seconds

            return () => clearTimeout(timer);
        }
    }, [visible, isAutoClose, setVisible])

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <Pressable onPress={() => setVisible(false)} style={styles.overlay}>
                <TouchableWithoutFeedback>
                    <View style={[styles.modalBox, { width }]}>
                        {message && <Text style={[globalStyles.text, styles.message]}>{message}</Text>}
                        <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                            <Icon name="close-circle" size={fonts.size.xl} color={colors.black} />
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </Pressable>
        </Modal>
    )
}

export default CustomModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.modalOverlay,
    },
    modalBox: {
        paddingVertical: 50,
        paddingHorizontal: 15,
        backgroundColor: colors.white,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    message: {
        fontSize: fonts.size.md,
        textAlign: 'center',
    }
})