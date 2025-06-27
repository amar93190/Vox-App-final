import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/supabase-provider';
import { supabase } from '@/config/supabase';

export default function WaitingForValidationHelper() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(async () => {
      // On cherche la dernière proposition d'aide de cet utilisateur
      const { data: helper } = await supabase
        .from('helpers')
        .select('id, status, request_id')
        .eq('helper_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (helper && helper.status === 'accepted') {
        // Redirige vers la page finale d'instructions
        router.replace('/go-help?requestId=' + helper.request_id);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9DB' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 18, textAlign: 'center' }}>
        En attente d'acceptation…
      </Text>
      <Text style={{ fontSize: 16, color: '#A0A4AE', textAlign: 'center', marginBottom: 24, maxWidth: 260 }}>
        Ta proposition d'aide a bien été envoyée. Tu seras notifié dès qu'un étudiant t'accepte !
      </Text>
      <ActivityIndicator size="large" color="#222" />
    </View>
  );
} 