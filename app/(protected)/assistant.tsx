import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import { askChatGPT } from '@/lib/chatgpt';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from '@/components/safe-area-view';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function AssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setResponse('');
    try {
      const res = await askChatGPT(prompt);
      setResponse(res);
    } catch (e: any) {
      setResponse('Erreur : ' + (e?.message || e.toString()));
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header avec bouton retour */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 24 }}>
            <LottieView
              source={require('@/assets/ia.json')}
              style={{ width: 180, height: 180, marginBottom: 12 }}
              autoPlay
              loop
              speed={1}
              resizeMode="contain"
            />
          </View>
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 8, textAlign: 'center' }}>
              Tu as une question ?
            </Text>
            <Text style={{ fontSize: 16, color: '#A0A4AE', textAlign: 'center', marginBottom: 0, maxWidth: 260 }}>
              Tu as une question ou un problème à poser ? Dis-le nous...
            </Text>
          </View>
          <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
            <View style={styles.textareaWrapper}>
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder="Pose ta question..."
                style={styles.textarea}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleAsk} disabled={loading || !prompt.trim()}>
                <Feather name="arrow-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
          {response ? (
            <View style={styles.responseBox}>
              <Text style={styles.response}>{response}</Text>
            </View>
          ) : null}
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Text style={{ color: '#A0A4AE', marginBottom: 18 }}>ou</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/entretien-journalier')}>
              <Text style={styles.primaryBtnText}>Entretien journalier</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  textareaWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    minHeight: 80,
  },
  textarea: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    minHeight: 80,
    maxHeight: 160,
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
  sendBtn: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseBox: {
    backgroundColor: '#F3EDFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
  },
  response: {
    color: '#222',
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 12,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 220,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#222',
    fontSize: 17,
    fontWeight: '600',
  },
}); 