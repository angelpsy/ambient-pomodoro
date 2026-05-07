import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { TimerSettings } from '../../core/types';

interface SettingsViewerProps {
    visible: boolean;
    settings: TimerSettings;
    onClose: () => void;
    onSave: (nextSettings: Partial<TimerSettings>) => void;
}

const toMinutesString = (ms: number): string => String(Math.round(ms / 60000));

export const SettingsViewer: React.FC<SettingsViewerProps> = ({
    visible,
    settings,
    onClose,
    onSave,
}) => {
    const [focusMinutes, setFocusMinutes] = React.useState(toMinutesString(settings.durationsMs.focus));
    const [breakMinutes, setBreakMinutes] = React.useState(toMinutesString(settings.durationsMs.break));
    const [longBreakMinutes, setLongBreakMinutes] = React.useState(toMinutesString(settings.durationsMs.longBreak));

    const [focusReminderMinutes, setFocusReminderMinutes] = React.useState(toMinutesString(settings.reminderIntervalsMs.focus));
    const [breakReminderMinutes, setBreakReminderMinutes] = React.useState(toMinutesString(settings.reminderIntervalsMs.break));
    const [longBreakReminderMinutes, setLongBreakReminderMinutes] = React.useState(toMinutesString(settings.reminderIntervalsMs.longBreak));

    const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = React.useState(String(settings.cyclesBeforeLongBreak));

    React.useEffect(() => {
        if (!visible) return;
        setFocusMinutes(toMinutesString(settings.durationsMs.focus));
        setBreakMinutes(toMinutesString(settings.durationsMs.break));
        setLongBreakMinutes(toMinutesString(settings.durationsMs.longBreak));

        setFocusReminderMinutes(toMinutesString(settings.reminderIntervalsMs.focus));
        setBreakReminderMinutes(toMinutesString(settings.reminderIntervalsMs.break));
        setLongBreakReminderMinutes(toMinutesString(settings.reminderIntervalsMs.longBreak));

        setCyclesBeforeLongBreak(String(settings.cyclesBeforeLongBreak));
    }, [visible, settings]);

    const parsePositiveInt = (value: string, fallback: number): number => {
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed) || parsed <= 0) return fallback;
        return parsed;
    };

    const handleSave = () => {
        onSave({
            durationsMs: {
                focus: parsePositiveInt(focusMinutes, 25) * 60 * 1000,
                break: parsePositiveInt(breakMinutes, 5) * 60 * 1000,
                longBreak: parsePositiveInt(longBreakMinutes, 15) * 60 * 1000,
            },
            reminderIntervalsMs: {
                focus: parsePositiveInt(focusReminderMinutes, 25) * 60 * 1000,
                break: parsePositiveInt(breakReminderMinutes, 5) * 60 * 1000,
                longBreak: parsePositiveInt(longBreakReminderMinutes, 15) * 60 * 1000,
            },
            cyclesBeforeLongBreak: parsePositiveInt(cyclesBeforeLongBreak, 4),
        });
        onClose();
    };

    const renderRow = (
        label: string,
        value: string,
        setValue: (value: string) => void,
        placeholder: string,
    ) => (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                keyboardType="number-pad"
                placeholder={placeholder}
                placeholderTextColor="#777777"
            />
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <View style={styles.container}>
                    <Text style={styles.title}>Timer Settings</Text>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.sectionTitle}>Durations (minutes)</Text>
                        {renderRow('Focus', focusMinutes, setFocusMinutes, '25')}
                        {renderRow('Break', breakMinutes, setBreakMinutes, '5')}
                        {renderRow('Long Break', longBreakMinutes, setLongBreakMinutes, '15')}

                        <Text style={styles.sectionTitle}>Reminder Repeat (minutes)</Text>
                        {renderRow('Focus', focusReminderMinutes, setFocusReminderMinutes, '25')}
                        {renderRow('Break', breakReminderMinutes, setBreakReminderMinutes, '5')}
                        {renderRow('Long Break', longBreakReminderMinutes, setLongBreakReminderMinutes, '15')}

                        <Text style={styles.sectionTitle}>Cycle Rhythm</Text>
                        {renderRow('Focus sessions before long break', cyclesBeforeLongBreak, setCyclesBeforeLongBreak, '4')}
                    </ScrollView>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 16,
    },
    container: {
        backgroundColor: '#1A1A1A',
        borderRadius: 14,
        maxHeight: '88%',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    title: {
        color: '#F5F5F5',
        fontSize: 18,
        fontWeight: '600',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 8,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        color: '#9A9A9A',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 16,
        marginBottom: 10,
    },
    field: {
        marginBottom: 10,
    },
    label: {
        color: '#C0C0C0',
        marginBottom: 6,
        fontSize: 13,
    },
    input: {
        backgroundColor: '#101010',
        borderColor: '#333333',
        borderWidth: 1,
        borderRadius: 10,
        color: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
    },
    secondaryButton: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginRight: 10,
    },
    primaryButton: {
        backgroundColor: '#3B3B3B',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: 14,
        fontWeight: '600',
    },
});
