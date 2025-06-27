import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/supabase-provider';
import { supabase } from '@/config/supabase';
import emojisYellow from '@/assets/emojis-yellow.png';
import { useRouter } from 'expo-router';

const CARD_COLORS = ['#FFF9DB', '#E6F3FF', '#F3EDFF'];

export default function WaitingForHelper() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [helpers, setHelpers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  async function fetchHelpers() {
    setLoading(true);
    setError('');
    if (!userId) {
      setHelpers([]);
      setLoading(false);
      return;
    }
    // Récupère la dernière demande de l'utilisateur
    const { data: lastRequest, error: reqError } = await supabase
      .from('help_requests')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (reqError || !lastRequest) {
      setHelpers([]);
      setLoading(false);
      return;
    }
    // Pour chaque helper, on utilise directement les champs prenom et nom de la table helpers
    const { data: helpersData, error: helpersError } = await supabase
      .from('helpers')
      .select('id, status, helper_id, request_id')
      .eq('request_id', lastRequest.id);
    if (helpersError) {
      setHelpers([]);
      setLoading(false);
      return;
    }
    setHelpers(helpersData || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchHelpers();
  }, [userId]);

  // Polling automatique toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHelpers();
    }, 4000);
    return () => clearInterval(interval);
  }, [userId]);

  async function handleAcceptHelper(helper) {
    if (!userId) return;
    const { error: updateError } = await supabase
      .from('helpers')
      .update({ status: 'accepted' })
      .eq('id', helper.id);
    if (updateError) {
      console.log('[handleAcceptHelper] update error:', updateError);
      alert('Erreur lors de la mise à jour du statut : ' + updateError.message);
      return;
    }
    // Crée une entrée dans matches si non existante
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('request_id', helper.request_id)
      .eq('helper_id', helper.helper_id)
      .maybeSingle();
    if (!existingMatch) {
      await supabase
        .from('matches')
        .insert({
          request_id: helper.request_id,
          helper_id: helper.helper_id,
          user_id: userId,
          status: 'waiting',
          started_at: new Date(),
        });
    }
    // Redirige vers la page match-in-progress
    router.replace('/match-in-progress');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 0 }}>
      <TouchableOpacity onPress={fetchHelpers} style={{ marginTop: 12, marginBottom: 8, alignSelf: 'center', backgroundColor: '#EEE', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 18 }}>
        <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}>Rafraîchir</Text>
      </TouchableOpacity>
      {/* Header smiley + titre */}
      <View style={{ alignItems: 'center', marginTop: 80, marginBottom: 24 }}>
        <Image
          source={emojisYellow}
          style={{ width: 116, height: 116, marginBottom: 36 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 10, marginTop: 0, letterSpacing: -1 }}>
          Votre demande a été soumise
        </Text>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 28, fontWeight: '400' }}>
          Voici les personnes qui souhaitent t'aider :
        </Text>
      </View>
      {/* Liste des helpers */}
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40, paddingTop: 0 }}>
        {/* {loading && <Text style={{ color: '#222' }}>Chargement...</Text>} */}
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        {!loading && helpers.length === 0 && (
          <Text style={{ color: '#222', fontSize: 16 }}>Aucune proposition reçue pour l'instant.</Text>
        )}
        {helpers.map((helper, idx) => {
          const cardColor = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <View
              key={helper.id}
              style={{
                backgroundColor: cardColor,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: '#222',
                width: '95%',
                maxWidth: 370,
                marginBottom: 18,
                padding: 18,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              {/* Avatar */}
              <Image
                source={{ uri: helper.avatar_url }}
                style={{ width: 54, height: 54, borderRadius: 27, marginRight: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' }}
              />
              {/* Infos aidant */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }} numberOfLines={1}>
                  {helper.helper_id}
                </Text>
              </View>
              {/* Bouton */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#222',
                  borderRadius: 10,
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  marginLeft: 10,
                }}
                onPress={() => handleAcceptHelper(helper)}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Accepter</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
} 