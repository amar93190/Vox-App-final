import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/context/supabase-provider';
import { getProfile } from '@/lib/supabase-queries';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import AssistantIA from '@/components/AssistantIA';

export default function CompteScreen() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    getProfile(session.user.id)
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#222" /></View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}><Text style={{ color: 'red' }}>{error}</Text></View>
    );
  }
  if (!profile) {
    return (
      <View style={styles.centered}><Text>Profil non trouvé</Text></View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.headerIcons, { alignItems: 'center' }]}> 
            <Feather name="bell" size={26} color="#222" style={{ marginRight: 8 }} />
            <TouchableOpacity
              onPress={signOut}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, backgroundColor: 'rgba(255, 71, 26, 0.07)' }}
            >
              <Feather name="log-out" size={18} color="#FF471A" style={{ marginRight: 6 }} />
              <Text style={{ color: '#FF471A', fontSize: 16, fontWeight: '600' }}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          {/* Carte profil */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('@/assets/logo-vox-jaune.png')}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.name}>{profile.prenom} {profile.nom}</Text>
            <Text style={styles.subtitle}>Étudiant en B3 MTK</Text>
            {/* Niveau + barre de progression */}
            <View style={styles.levelRow}>
              <Feather name="award" size={18} color="#222" style={{ marginRight: 6 }} />
              <Text style={styles.levelText}>Niveau 8</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '70%', backgroundColor: '#7EC3F7' }]} />
              <View style={[styles.progressBar, { width: '30%', backgroundColor: '#fff' }]} />
            </View>
            {/* Boutons */}
            <View style={styles.profileButtonsRow}>
              <TouchableOpacity style={styles.profileButton}>
                <Feather name="user-plus" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.profileButtonText}>Trouver un ami</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButtonIcon}>
                <Feather name="upload" size={20} color="#222" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Activités récentes */}
          <Text style={styles.sectionTitle}>Activités récentes</Text>
          <View style={styles.statsCard}>
            <View style={styles.statsRow}><View style={[styles.dot, { backgroundColor: '#FFD600' }]} /><Text style={styles.statsLabel}>Cours complétés</Text><Text style={styles.statsValue}>16/48 cours</Text></View>
            <View style={styles.statsRow}><View style={[styles.dot, { backgroundColor: '#7EC3F7' }]} /><Text style={styles.statsLabel}>Soutiens et aides</Text><Text style={styles.statsValue}>7 aides</Text></View>
          </View>

          {/* Ils t'ont aidé */}
          <Text style={styles.sectionTitle}>Ils t'ont aider</Text>
          <View style={styles.helpersRow}>
            <View style={[styles.helperCard, { backgroundColor: '#FFF9DB' }]}> 
              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.helperAvatar} />
              <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <Text style={styles.helperName}>Michel. H</Text>
                <Text style={styles.helperSubtitle}>B3 MD</Text>
                <Text style={styles.helperTime}>Il y a 3 jours</Text>
                <Text style={styles.helperType}>Type d'aide : Orientation et soutien scolaire</Text>
              </View>
            </View>
            <View style={[styles.helperCard, { backgroundColor: '#E6F3FF' }]}> 
              <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.helperAvatar} />
              <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <Text style={styles.helperName}>Suzanne. P</Text>
                <Text style={styles.helperSubtitle}>B3 MKT</Text>
                <Text style={styles.helperTime}>Il y a 1 semaine</Text>
                <Text style={styles.helperType}>Type d'aide : Santé mentale</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <AssistantIA />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24,
    alignItems: 'center',
  },
  headerIcons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 0,
    marginTop: 8,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
    marginTop: 0,
    textAlign: 'center',
  },
  profileCard: {
    width: '92%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 24,
    borderWidth: 0,
    // dégradé en overlay via absolute si besoin
  },
  avatarWrapper: {
    marginTop: -48,
    marginBottom: 16,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
    width: 96,
    height: 96,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A4AE',
    textAlign: 'center',
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    width: '90%',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  profileButtonsRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    flex: 1,
    marginRight: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  profileButtonIcon: {
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
    marginLeft: '4%',
  },
  statsCard: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 18,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statsLabel: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  statsValue: {
    fontSize: 16,
    color: '#A0A4AE',
    fontWeight: '500',
  },
  helpersRow: {
    flexDirection: 'row',
    width: '92%',
    justifyContent: 'space-between',
    marginTop: 8,
    marginHorizontal: 2,
    marginBottom: 8,
  },
  helperCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 80,
  },
  helperAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  helperName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    textAlign: 'left',
  },
  helperSubtitle: {
    fontSize: 13,
    color: '#A0A4AE',
    marginBottom: 2,
    textAlign: 'left',
  },
  helperTime: {
    fontSize: 12,
    color: '#A0A4AE',
    marginBottom: 2,
    textAlign: 'left',
  },
  helperType: {
    fontSize: 12,
    color: '#222',
    marginBottom: 0,
    textAlign: 'left',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
}); 