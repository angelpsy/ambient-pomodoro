import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useTimer } from './useTimer';
import { formatTime } from './utils';
import { Controls } from './components/Controls';
import { LogViewer } from './components/LogViewer';
import { TimerMode } from '../core/types';

import { logStore } from '../core/LogStore';

export const MainScreen: React.FC = () => {
    const { currentMode, elapsedTime, cycleCount } = useTimer();
    const [logsVisible, setLogsVisible] = React.useState(false);

    React.useEffect(() => {
        logStore.initialize();
    }, []);

    const getModeLabel = (mode: TimerMode) => {
        switch (mode) {
            case TimerMode.FOCUS: return 'Focusing';
            case TimerMode.BREAK: return 'Resting';
            case TimerMode.LONG_BREAK: return 'Long Rest';
            case TimerMode.PAUSED: return 'Paused';
            case TimerMode.IDLE: return 'Ready To Start';
            default: return '';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.appName}>Ambient Pomodoro</Text>
                    <Text style={styles.cycleText}>Cycle: {cycleCount}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.viewLogsButton}
                        onPress={() => setLogsVisible(true)}
                    >
                        <Text style={styles.viewLogsText}>VIEW LOGS</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <LogViewer
                visible={logsVisible}
                onClose={() => setLogsVisible(false)}
            />

            <View style={styles.mainContent}>
                <Text style={styles.modeLabel}>{getModeLabel(currentMode)}</Text>
                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                <Controls />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        // Simple manual safe area for Android/iOS
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appName: {
        color: '#888888',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    cycleText: {
        color: '#888888',
        fontSize: 14,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewLogsButton: {
        marginRight: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#1E1E1E',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#333333',
    },
    viewLogsText: {
        color: '#666666',
        fontSize: 10,
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeLabel: {
        color: '#666666',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    timerText: {
        color: '#F5F5F5',
        fontSize: 84,
        fontWeight: '300',
        fontFamily: 'monospace', // Ensure consistent character width
    },
});
