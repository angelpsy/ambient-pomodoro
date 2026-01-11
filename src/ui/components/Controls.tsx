import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTimer } from '../useTimer';
import { TimerMode } from '../../core/types';

export const Controls: React.FC = () => {
    const { currentMode, start, pause, resume, stop, next } = useTimer();

    const isIdle = currentMode === TimerMode.IDLE;
    const isPaused = currentMode === TimerMode.PAUSED;

    return (
        <View style={styles.container}>
            {isIdle ? (
                <TouchableOpacity style={styles.button} onPress={start}>
                    <Text style={styles.buttonText}>Start Focus</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <View style={styles.row}>
                        {isPaused ? (
                            <TouchableOpacity style={[styles.button, styles.primary]} onPress={resume}>
                                <Text style={styles.buttonText}>Resume</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={pause}>
                                <Text style={styles.buttonText}>Pause</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.button} onPress={next}>
                            <Text style={styles.buttonText}>Next Mode</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.button, styles.danger]} onPress={stop}>
                        <Text style={styles.buttonText}>Stop & Reset</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 40,
        marginTop: 40,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#333333',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    primary: {
        backgroundColor: '#444444',
    },
    danger: {
        backgroundColor: '#2A1A1A',
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: 16,
        fontWeight: '500',
    },
});
