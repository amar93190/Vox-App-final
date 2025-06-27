import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { getQuizWithQuestions } from '@/lib/supabase-queries';
import { SafeAreaView } from '@/components/safe-area-view';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getQuizWithQuestions(id as string)
      .then(data => setQuiz(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <View style={styles.center}><Text>Chargement…</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!quiz) return <View style={styles.center}><Text>Quiz introuvable</Text></View>;

  const questions = quiz.questions || [];
  const q = questions[current];
  const total = questions.length;

  if (finished) {
    // Calcul du score
    const bonnesReponses = questions.reduce((acc, q, idx) => {
      // On suppose que chaque question a une propriété correctAnswer (index de la bonne réponse)
      return acc + (q.userAnswer === q.correctAnswer ? 1 : 0);
    }, 0);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#D9EAFE', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Image
            source={require('@/assets/emojis-bleu.png')}
            style={{ width: 120, height: 120, marginBottom: 32, marginTop: 32 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 22, color: '#111', fontWeight: 'bold', textAlign: 'center', marginBottom: 0 }}>
            Félicitations, tu as terminé le quiz !
          </Text>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 32 }}>
          <Button style={{ backgroundColor: '#2D2D2D', borderRadius: 28, paddingVertical: 18 }} onPress={() => router.back()}>
            <Text style={{ color: '#fff', fontSize: 20 }}>Continuer</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[styles.quizTitle, { flex: 0, minWidth: 0, textAlign: 'center', marginBottom: 32 }]}
        numberOfLines={undefined}
        allowFontScaling={false}
      >
        {quiz.title}
      </Text>
      <View style={[styles.progressBarBg, { marginBottom: 40 }]}>
        <View style={[styles.progressBar, { width: `${((current + 1) / total) * 100}%` }]} />
      </View>
      <Text
        style={[styles.counter, { flex: 0, minWidth: 0, textAlign: 'center', marginBottom: 32, marginTop: 20 }]}
        numberOfLines={undefined}
        allowFontScaling={false}
      >
        {current + 1}/{total}
      </Text>
      <Text
        style={[styles.question, { flex: 0, minWidth: 0, textAlign: 'center', marginBottom: 40 }]}
        numberOfLines={undefined}
        allowFontScaling={false}
      >
        {q.question}
      </Text>
      <View style={{ marginTop: 0, marginBottom: 40 }}>
        {q.answers.map((ans: string, idx: number) => (
          <Pressable
            key={idx}
            style={[styles.answer, selected === idx && styles.answerSelected]}
            onPress={() => setSelected(idx)}
          >
            <Text
              style={[
                styles.answerText,
                selected === idx && styles.answerTextSelected,
                { flex: 0, minWidth: 0, textAlign: 'center' }
              ]}
              numberOfLines={undefined}
              allowFontScaling={false}
            >
              {ans}
            </Text>
          </Pressable>
        ))}
      </View>
      <Button
        style={styles.nextBtn}
        onPress={() => {
          if (current === total - 1) setFinished(true);
          else { setCurrent(c => c + 1); setSelected(null); }
        }}
        disabled={selected === null}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{current === total - 1 ? 'Terminé' : 'Suivant'}</Text>
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, alignItems: 'stretch' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  quizTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, marginTop: 16, color: '#111' },
  progressBarBg: { height: 8, borderRadius: 4, backgroundColor: '#E3F0FF', marginBottom: 32, marginHorizontal: 8 },
  progressBar: { height: 8, borderRadius: 4, backgroundColor: '#6EC1FF' },
  counter: { fontSize: 22, fontWeight: '500', textAlign: 'center', marginBottom: 24, color: '#111' },
  question: { fontSize: 22, textAlign: 'center', marginBottom: 32, color: '#111', lineHeight: 30 },
  answer: { borderWidth: 1, borderColor: '#D6E3F3', borderRadius: 16, padding: 18, marginBottom: 16, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  answerSelected: { backgroundColor: '#E3F0FF', borderColor: '#6EC1FF' },
  answerText: { color: '#111', fontSize: 17, flexShrink: 1, flexWrap: 'wrap' },
  answerTextSelected: { color: '#111', fontWeight: 'bold' },
  nextBtn: { backgroundColor: '#6EC1FF', borderRadius: 16, marginTop: 32, paddingVertical: 16 },
}); 