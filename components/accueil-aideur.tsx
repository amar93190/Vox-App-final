import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { supabase } from "@/config/supabase";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { Image } from "@/components/image";
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/supabase-provider';

const CARD_COLORS = [
  '#FFF9DB', // jaune pâle
  '#E6F3FF', // bleu pâle
  '#F3EDFF', // violet pâle
];

interface HelpRequest {
  id: string;
  first_name: string;
  last_name: string;
  difficulty_type: string;
  floor?: string;
  description: string;
  created_at: string;
  status: string;
  user_id: string;
}

export default function AccueilAideur() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proposedIds, setProposedIds] = useState<string[]>([]);
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from('help_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setRequests((data || []).filter(r => r.user_id !== userId));
      }
      setLoading(false);
    }
    async function fetchProposed() {
      if (!userId) return;
      const { data } = await supabase
        .from('helpers')
        .select('request_id, status')
        .eq('helper_id', userId)
        .in('status', ['pending', 'accepted']);
      setProposedIds((data || []).map(h => h.request_id));
    }
    fetchRequests();
    fetchProposed();
    const interval = setInterval(() => {
      fetchRequests();
      fetchProposed();
    }, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  async function handleProposeHelp(requestId: string) {
    if (!userId) return;
    // Vérifier si déjà proposé
    const { data: existing } = await supabase
      .from('helpers')
      .select('id')
      .eq('request_id', requestId)
      .eq('helper_id', userId)
      .maybeSingle();
    if (existing) {
      router.replace('/waiting-for-validation-helper');
      return;
    }
    const { data, error } = await supabase.from('helpers').insert({
      request_id: requestId,
      helper_id: userId,
      status: 'pending',
    }).select('id').single();
    if (data?.id) {
      router.replace('/waiting-for-validation-helper');
    }
  }

  return (
    <View className="p-0" style={{ backgroundColor: '#fff', borderRadius: 16 }}>
      {/* Header Figma style */}
      <H1 className="text-black text-4xl font-extrabold mb-2">
        Envie d'aider ?{"\n"}Fais le premier pas.
      </H1>
      <Text className="text-base mb-4" style={{ color: '#A0A4AE' }}>
        Deviens une voix qui compte pour les autres. {'\n'}
        Tu peux{` accompagner à ton rythme, avec bienveillance.`}
      </Text>
      <Text className="text-4xl font-bold text-black mb-4">Ils ont besoin de toi...</Text>
      {/* {loading && <Text className="text-black">Chargement...</Text>} */}
      {error && <Text className="text-destructive">{error}</Text>}
      {!loading && !error && requests.length === 0 && (
        <Text className="text-black">Aucune demande en attente.</Text>
      )}
      <ScrollView className="gap-y-4" showsVerticalScrollIndicator={false}>
        {requests.map((req, idx) => {
          const cardColor = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <View
              key={req.id}
              style={{
                backgroundColor: cardColor,
                borderRadius: 14,
                padding: 10,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: 1,
              }}
            >
              {/* Avatar */}
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#fff' }}
                resizeMode="cover"
              />
              {/* Infos */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">
                    {req.first_name} {req.last_name}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: proposedIds.includes(req.id) ? '#4CAF50' : '#222',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginLeft: 8,
                      opacity: proposedIds.includes(req.id) ? 1 : 1,
                    }}
                    onPress={proposedIds.includes(req.id) ? undefined : () => handleProposeHelp(req.id)}
                    disabled={proposedIds.includes(req.id)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>
                      {proposedIds.includes(req.id) ? 'En cours de validation' : 'Proposer mon aide'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {req.floor && (
                  <Text style={{ color: '#A0A4AE', fontSize: 13, marginBottom: 1 }} numberOfLines={1} ellipsizeMode="tail">
                    Étage : {req.floor}
                  </Text>
                )}
                <Text style={{ color: '#222', fontSize: 13, marginTop: 0, marginBottom: 0 }} numberOfLines={2} ellipsizeMode="tail">
                  {req.description}
                </Text>
                <Text style={{ color: '#A0A4AE', fontSize: 11, marginTop: 0, marginBottom: 0 }} numberOfLines={1} ellipsizeMode="tail">
                  Envoyée le {new Date(req.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
} 