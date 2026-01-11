import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
} from 'react-native';
import { LogLevel } from '../../core/types';
import { logger } from '../../core/LoggerImpl';

export const LogSwitcher: React.FC = () => {
    const [level, setLevel] = useState<LogLevel>(logger.getLevel());
    const [modalVisible, setModalVisible] = useState(false);

    const levels: LogLevel[] = [
        LogLevel.DEBUG,
        LogLevel.INFO,
        LogLevel.WARN,
        LogLevel.ERROR,
    ];

    const selectLevel = (newLevel: LogLevel) => {
        logger.setLevel(newLevel);
        setLevel(newLevel);
        setModalVisible(false);
        console.log(`Log level changed to ${newLevel}`);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Text style={styles.buttonText}>LOG: {level.toUpperCase()}</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Log Level</Text>
                            <FlatList
                                data={levels}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.option,
                                            item === level && styles.selectedOption,
                                        ]}
                                        onPress={() => selectLevel(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                item === level && styles.selectedOptionText,
                                            ]}
                                        >
                                            {item.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#222222',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#444444',
    },
    buttonText: {
        color: '#AAAAAA',
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 300,
        borderWidth: 1,
        borderColor: '#333333',
    },
    modalTitle: {
        color: '#F5F5F5',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
    option: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    selectedOption: {
        backgroundColor: '#333333',
        borderRadius: 8,
        marginVertical: 4,
        borderBottomWidth: 0,
        paddingHorizontal: 10,
    },
    optionText: {
        color: '#888888',
        fontSize: 14,
        textAlign: 'center',
    },
    selectedOptionText: {
        color: '#F5F5F5',
        fontWeight: '700',
    },
});
