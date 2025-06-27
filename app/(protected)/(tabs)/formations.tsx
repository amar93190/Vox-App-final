import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, ActivityIndicator, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { getVideos, getQuizzes } from '@/lib/supabase-queries';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import AssistantIA from '@/components/AssistantIA';

const CARD_COLORS = ['#FFD6EC', '#D6F5FF', '#E2FFD6', '#FFF6D6', '#E6E6FF', '#FFE6F7'];
const PROGRESS_COLORS = ['#F5D76E', '#BFA5F6', '#7EC3F7'];

export default function FormationsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'videos' | 'quiz'>('videos');
  const [videos, setVideos] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<{ visible: boolean; url: string | null }>({ visible: false, url: null });

  useEffect(() => {
    setError(null);
    setLoading(true);
    if (selectedTab === 'videos') {
      getVideos()
        .then(data => setVideos(data || []))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      getQuizzes()
        .then(data => setQuizzes(data || []))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [selectedTab]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formations</Text>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, selectedTab === 'videos' && styles.tabActive]}
          onPress={() => setSelectedTab('videos')}
        >
          <Feather name="play-circle" size={18} color={selectedTab === 'videos' ? '#222' : '#A0A4AE'} style={{ marginRight: 6 }} />
          <Text style={selectedTab === 'videos' ? styles.tabTextActive : styles.tabText}>Vidéos</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'quiz' && styles.tabActive]}
          onPress={() => setSelectedTab('quiz')}
        >
          <MaterialCommunityIcons name="clipboard-list-outline" size={18} color={selectedTab === 'quiz' ? '#222' : '#A0A4AE'} style={{ marginRight: 6 }} />
          <Text style={selectedTab === 'quiz' ? styles.tabTextActive : styles.tabText}>Quiz</Text>
        </Pressable>
      </View>
      {loading && <ActivityIndicator size="large" color="#222" style={{ marginTop: 32 }} />}
      {error && <Text style={{ color: 'red', marginTop: 32 }}>{error}</Text>}
      {!loading && !error && selectedTab === 'videos' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {videos.length === 0 && (
            <Text style={{ marginTop: 32, textAlign: 'center' }}>Aucune vidéo trouvée.</Text>
          )}
          {videos.map((video, idx) => {
            const cardColor = video.color || CARD_COLORS[idx % CARD_COLORS.length];
            const progressColor = PROGRESS_COLORS[idx % PROGRESS_COLORS.length];
            return (
              <View key={video.id} style={[styles.card, { backgroundColor: cardColor }]}> 
                <Text style={styles.cardTitle}>{video.title}</Text>
                <Text style={styles.cardDesc}>{video.description}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${(video.progress || 0) * 100}%`, backgroundColor: progressColor }]} />
                  <View style={[styles.progressBar, { width: `${100 - (video.progress || 0) * 100}%`, backgroundColor: '#fff' }]} />
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.cardFooterItem}>
                    <Feather name="clock" size={16} color="#A0A4AE" style={{ marginRight: 4 }} />
                    <Text style={styles.cardFooterText}>{video.duration || 5} min</Text>
                  </View>
                  <View style={styles.cardFooterItem}>
                    <MaterialCommunityIcons name="book-open-variant" size={16} color="#A0A4AE" style={{ marginRight: 4 }} />
                    <Text style={styles.cardFooterText}>{video.lessons || 3} leçons</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => router.push(`/video/${video.id}`)}>
                      <Feather name="play-circle" size={22} color="#A0A4AE" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      {!loading && !error && selectedTab === 'quiz' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {quizzes.length === 0 && (
            <Text style={{ marginTop: 32, textAlign: 'center' }}>Aucun quiz trouvé.</Text>
          )}
          {quizzes.map((quiz) => (
            <Pressable key={quiz.id} onPress={() => router.push(`/quiz/${quiz.id}`)} style={[styles.card, { backgroundColor: '#E6F3FF', borderWidth: 1, borderColor: '#7EC3F7' }]}> 
              <Text style={styles.cardTitle}>{quiz.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <Modal visible={videoModal.visible} animationType="slide" transparent onRequestClose={() => setVideoModal({ visible: false, url: null })}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {videoModal.url && (
              <Video
                source={{ uri: videoModal.url }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                useNativeControls
                style={{ width: 320, height: 200, backgroundColor: '#000', borderRadius: 12 }}
              />
            )}
            <Button style={{ marginTop: 16 }} onPress={() => setVideoModal({ visible: false, url: null })}>
              <Text>Fermer</Text>
            </Button>
          </View>
        </View>
      </Modal>
      <AssistantIA />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#222' },
  tabs: { flexDirection: 'row', marginBottom: 24 },
  tab: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: '#F6F6F6', marginRight: 8, flexDirection: 'row', justifyContent: 'center' },
  tabActive: { backgroundColor: '#FFF9DB' },
  tabText: { color: '#222', fontWeight: '500' },
  tabTextActive: { color: '#222', fontWeight: '700' },
  card: { borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 8, color: '#222' },
  cardDesc: { fontSize: 15, color: '#222', marginBottom: 12 },
  progressBarContainer: { flexDirection: 'row', height: 6, borderRadius: 4, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 16 },
  progressBar: { height: 6 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardFooterItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  cardFooterText: { color: '#A0A4AE', fontSize: 14 },
  helpButton: { backgroundColor: '#FFF9DB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6 },
  helpButtonText: { color: '#222', fontWeight: '600', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center' },
  quizCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  quizCardText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '400',
  },
}); 