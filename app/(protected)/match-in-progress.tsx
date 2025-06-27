import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/config/supabase';

export default function MatchInProgress() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    setLoading(true);
    // Met à jour le statut du match à 'done'
    const { data: updated, error } = await supabase
      .from('matches')
      .update({ status: 'done', ended_at: new Date() })
      .order('started_at', { ascending: false })
      .limit(1)
      .select();
    // Suppression automatique du match et de la demande d'aide associée
    if (updated && updated.length > 0) {
      const match = updated[0];
      await supabase.from('matches').delete().eq('id', match.id);
      if (match.request_id) {
        await supabase.from('help_requests').delete().eq('id', match.request_id);
      }
    }
    setLoading(false);
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prestation validée !</Text>
      <Text style={styles.subtitle}>
Parfait une personne est en chemin pour vous aider !      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleFinish}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Finir la prestation'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9DB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A4AE',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 320,
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 