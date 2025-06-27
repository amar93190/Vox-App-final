import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/config/supabase';

export default function GoHelp() {
  const { requestId } = useLocalSearchParams();
  const [floor, setFloor] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [loading, setLoading] = useState(false);
  // Fausse photo/avatar
  const fakeAvatar = 'https://randomuser.me/api/portraits/women/44.jpg';
  const router = useRouter();

  useEffect(() => {
    async function fetchInfos() {
      if (!requestId) return;
      // Récupère l'étage et l'id de l'utilisateur à aider
      const { data: helpRequest } = await supabase
        .from('help_requests')
        .select('floor, user_id')
        .eq('id', requestId)
        .maybeSingle();
      setFloor(helpRequest?.floor || '');
      if (helpRequest?.user_id) {
        // Récupère le profil lié pour le prénom et le nom
        const { data: profile } = await supabase
          .from('profiles')
          .select('prenom, nom')
          .eq('id', helpRequest.user_id)
          .maybeSingle();
        setPrenom(profile?.prenom || '');
        setNom(profile?.nom || '');
      }
    }
    fetchInfos();
  }, [requestId]);

  async function handleFinish() {
    setLoading(true);
    // Met à jour le statut du match à 'done'
    const { data: updated, error } = await supabase
      .from('matches')
      .update({ status: 'done', ended_at: new Date() })
      .eq('request_id', requestId)
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
      <Image
        source={{ uri: fakeAvatar }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <Text style={styles.title}>Ton profil a été accepté</Text>
      <View style={{ marginBottom: 18, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#222', marginBottom: 6 }}>Salle : <Text style={{ fontWeight: 'bold' }}>{floor || '...'}</Text></Text>
        <Text style={{ fontSize: 18, color: '#222', marginBottom: 6 }}>Nom et prénom : <Text style={{ fontWeight: 'bold' }}>{prenom} {nom}</Text></Text>
        <Text style={{ fontSize: 18, color: '#222' }}>Description : <Text style={{ fontWeight: 'bold' }}>-</Text></Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFF9DB',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
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