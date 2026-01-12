import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { logStore, LogEntry } from '../../core/LogStore';
import { LogLevel } from '../../core/types';
import { logger } from '../../core/LoggerImpl';

interface LogViewerProps {
    visible: boolean;
    onClose: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ visible, onClose }) => {
    const [logs, setLogs] = useState<LogEntry[]>(logStore.getLogs());
    const [globalLevel, setGlobalLevel] = useState<LogLevel>(logger.getLevel());
    const [filter, setFilter] = useState<LogLevel | 'ALL'>('ALL');
    const [levelModalVisible, setLevelModalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            setGlobalLevel(logger.getLevel());
            const unsubscribe = logStore.subscribe((newLogs) => {
                setLogs(newLogs);
            });
            return () => unsubscribe();
        }
    }, [visible]);

    const changeGlobalLevel = (level: LogLevel) => {
        logger.setLevel(level);
        setGlobalLevel(level);
        setLevelModalVisible(false);
    };

    const filteredLogs = filter === 'ALL'
        ? logs
        : logs.filter(log => log.level === filter);

    const getLevelColor = (level: LogLevel) => {
        switch (level) {
            case LogLevel.ERROR: return '#FF5555';
            case LogLevel.WARN: return '#FFB86C';
            case LogLevel.INFO: return '#8BE9FD';
            case LogLevel.DEBUG: return '#6272A4';
            default: return '#F8F8F2';
        }
    };

    const renderItem = ({ item }: { item: LogEntry }) => (
        <View style={styles.logItem}>
            <Text style={[styles.logTextBase, styles.logTimestamp]}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Text>
            <Text style={[styles.logTextBase, styles.logLevel, { color: getLevelColor(item.level) }]}>
                {item.level.padEnd(5)}
            </Text>
            <Text style={[styles.logTextBase, styles.logMessage]}>{item.message}</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            presentationStyle="fullScreen"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <Text style={styles.title}>System Logs</Text>
                        <TouchableOpacity
                            style={styles.levelSelector}
                            onPress={() => setLevelModalVisible(true)}
                        >
                            <Text style={styles.levelSelectorText}>LEVEL: {globalLevel.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Display Filter</Text>
                        <TouchableOpacity onPress={() => logStore.clear()} style={styles.clearButton}>
                            <Text style={styles.clearText}>Clear Store</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chipBar}>
                        {['ALL', LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR].map((lvl) => (
                            <TouchableOpacity
                                key={lvl}
                                style={[
                                    styles.filterChip,
                                    filter === lvl && styles.activeFilterChip
                                ]}
                                onPress={() => setFilter(lvl as any)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    filter === lvl && styles.activeFilterText
                                ]}>
                                    {lvl}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <FlatList
                    data={filteredLogs}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    inverted={false} // Store is already unshifted (newest first)
                />

                {levelModalVisible && (
                    <TouchableWithoutFeedback onPress={() => setLevelModalVisible(false)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Set Global Log Level</Text>
                                {[LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR].map((lvl) => (
                                    <TouchableOpacity
                                        key={lvl}
                                        style={[
                                            styles.levelOption,
                                            globalLevel === lvl && styles.selectedLevelOption
                                        ]}
                                        onPress={() => changeGlobalLevel(lvl as LogLevel)}
                                    >
                                        <Text style={[
                                            styles.levelOptionText,
                                            globalLevel === lvl && styles.selectedLevelOptionText
                                        ]}>
                                            {lvl.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: '#F5F5F5',
        fontSize: 20,
        fontWeight: '700',
    },
    levelSelector: {
        marginLeft: 12,
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#444444',
    },
    levelSelectorText: {
        color: '#8BE9FD', // Info-like cyan
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        color: '#888888',
        fontSize: 16,
    },
    section: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222222',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        color: '#666666',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    chipBar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterBar: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222222',
        flexWrap: 'wrap',
    },
    filterChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: '#2A2A2A',
        marginRight: 8,
        marginBottom: 4,
    },
    activeFilterChip: {
        backgroundColor: '#444444',
    },
    activeGlobalChip: {
        backgroundColor: '#6272A4', // Dracula-ish purple for active global level
    },
    filterText: {
        color: '#888888',
        fontSize: 12,
        fontWeight: '600',
    },
    activeFilterText: {
        color: '#F5F5F5',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        width: '70%',
        maxWidth: 250,
        borderWidth: 1,
        borderColor: '#333333',
    },
    modalTitle: {
        color: '#666666',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    levelOption: {
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 4,
    },
    selectedLevelOption: {
        backgroundColor: '#333333',
    },
    levelOptionText: {
        color: '#888888',
        fontSize: 16,
        fontWeight: '500',
    },
    selectedLevelOptionText: {
        color: '#F5F5F5',
        fontWeight: '700',
    },
    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    clearText: {
        color: '#FF5555',
        fontSize: 12,
        fontWeight: '600',
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 12,
    },
    logItem: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'flex-start',
    },
    logTextBase: {
        fontSize: 10,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        lineHeight: 14,
    },
    logTimestamp: {
        color: '#666666',
        width: 60,
    },
    logLevel: {
        fontWeight: '700',
        width: 45,
        marginLeft: 4,
    },
    logMessage: {
        color: '#DDDDDD',
        flex: 1,
        marginLeft: 4,
    },
});
