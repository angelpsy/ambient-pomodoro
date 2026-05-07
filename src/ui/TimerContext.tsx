import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TimerContext as ITimerContext, TimerSettings } from '../core/types';
import { TimerEngineImpl } from '../core/TimerEngineImpl';
import { ITimerEngine } from '../core/TimerEngine';

interface TimerProviderProps {
    children: ReactNode;
}

const TimerContext = createContext<ITimerContext | undefined>(undefined);
const TimerEngineContext = createContext<ITimerEngine | undefined>(undefined);
const TimerSettingsContext = createContext<TimerSettings | undefined>(undefined);

// Singleton engine instance for the app
const engine = new TimerEngineImpl();

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
    const [state, setState] = useState<ITimerContext>(engine.getState());
    const [settings, setSettings] = useState<TimerSettings>(engine.getSettings());

    useEffect(() => {
        // Subscribe to engine changes and update React state
        const unsubscribe = engine.subscribe((newState) => {
            setState(newState);
            setSettings(engine.getSettings());
        });

        engine.initialize();

        return () => unsubscribe();
    }, []);

    return (
        <TimerEngineContext.Provider value={engine}>
            <TimerSettingsContext.Provider value={settings}>
                <TimerContext.Provider value={state}>
                    {children}
                </TimerContext.Provider>
            </TimerSettingsContext.Provider>
        </TimerEngineContext.Provider>
    );
};

export const useTimerState = () => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimerState must be used within a TimerProvider');
    }
    return context;
};

export const useTimerActions = () => {
    const context = useContext(TimerEngineContext);
    if (context === undefined) {
        throw new Error('useTimerActions must be used within a TimerProvider');
    }
    return context;
};

export const useTimerSettings = () => {
    const context = useContext(TimerSettingsContext);
    if (context === undefined) {
        throw new Error('useTimerSettings must be used within a TimerProvider');
    }
    return context;
};
