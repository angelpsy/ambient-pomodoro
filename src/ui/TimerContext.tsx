import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TimerContext as ITimerContext } from '../core/types';
import { TimerEngineImpl } from '../core/TimerEngineImpl';
import { ITimerEngine } from '../core/TimerEngine';

interface TimerProviderProps {
    children: ReactNode;
}

const TimerContext = createContext<ITimerContext | undefined>(undefined);
const TimerEngineContext = createContext<ITimerEngine | undefined>(undefined);

// Singleton engine instance for the app
const engine = new TimerEngineImpl();

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
    const [state, setState] = useState<ITimerContext>(engine.getState());

    useEffect(() => {
        // Subscribe to engine changes and update React state
        const unsubscribe = engine.subscribe((newState) => {
            setState(newState);
        });

        return () => unsubscribe();
    }, []);

    return (
        <TimerEngineContext.Provider value={engine}>
            <TimerContext.Provider value={state}>
                {children}
            </TimerContext.Provider>
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
