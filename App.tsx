import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { TimerProvider } from './src/ui/TimerContext';
import { MainScreen } from './src/ui/MainScreen';

function App(): React.JSX.Element {
  return (
    <TimerProvider>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <MainScreen />
      </View>
    </TimerProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#121212',
  },
});

export default App;
