import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ambient Pomodoro</Text>
        <Text style={styles.subtitle}>Ready for implementation</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background as per principles
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#F5F5F5',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginTop: 8,
  },
});

export default App;
