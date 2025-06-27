import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AssistantIA() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push('/assistant')}
      activeOpacity={0.8}
    >
      <Feather name="message-circle" size={28} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    backgroundColor: '#4BA3FA',
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 100,
  },
}); 