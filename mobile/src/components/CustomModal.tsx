import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/color';
import { useEffect } from 'react';
import { AntDesign as Icon } from '@expo/vector-icons';
import fonts from '../constants/fonts';
import { globalStyles } from '../styles/globalStyles';

type ModalProps = {
    visible: boolean; // modal visibility
    setVisible: (visible: boolean) => void;
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
    }, [visible, isAutoClose])

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <TouchableOpacity onPress={() => setVisible(false)} style={styles.overlay}>
                <View style={[styles.modalBox, { width }]}>
                    {message && <Text style={[globalStyles.text, styles.message]}>{message}</Text>}
                    <TouchableOpacity onPress={() => setVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
                        <Icon name="close-circle" size={fonts.size.xl} color={colors.black} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
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
    message: {
        fontSize: fonts.size.md,
        textAlign: 'center',
    }
})