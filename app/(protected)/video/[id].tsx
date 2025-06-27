import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { getVideos, getLessons } from '@/lib/supabase-queries';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from '@/components/safe-area-view';
import { Feather } from '@expo/vector-icons';

export default function VideoPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [video, setVideo] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getVideos().then(videos => videos.find((v: any) => v.id === id)),
      getLessons(id as string)
    ])
      .then(([videoData, lessonsData]) => {
        setVideo(videoData);
        setLessons(lessonsData);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!video) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Vidéo introuvable</Text></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => router.push('/formations')} style={{ padding: 8, marginLeft: 2 }}>
          <Feather name="chevron-left" size={28} color="#222" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 18 }}>{video.title}</Text>
        <Video
          source={{ uri: video.video_url }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          style={{ width: '100%', height: 200, backgroundColor: '#000', borderRadius: 16, marginBottom: 24 }}
        />
        <Text style={{ fontSize: 16, color: '#222', marginBottom: 24 }}>{video.description}</Text>
        {lessons.map((lesson) => (
          <View key={lesson.id} style={{ backgroundColor: '#F9F9F9', borderRadius: 16, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: '#EEE' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#222' }}>{lesson.title}</Text>
            <Text style={{ fontSize: 15, color: '#222', marginBottom: 10 }}>{lesson.content}</Text>
            {lesson.example_title && lesson.example_text && (
              <View style={{ backgroundColor: '#FFF9DB', borderRadius: 10, padding: 12, marginTop: 8 }}>
                <Text style={{ fontWeight: 'bold', color: '#222', marginBottom: 4 }}>{lesson.example_title}</Text>
                <Text style={{ color: '#222' }}>{lesson.example_text}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
} 