import { supabase } from '@/config/supabase';

// Utilisation uniquement des méthodes REST, pas de realtime
export async function getVideos() {
  const { data, error } = await supabase.from('videos').select('*');
  if (error) throw error;
  return data;
}

export async function getQuizzes() {
  const { data, error } = await supabase.from('quizzes').select('*');
  if (error) throw error;
  return data;
}

export async function getQuizQuestions(quizId: string) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId);
  if (error) throw error;
  return data;
}

export async function getQuizWithQuestions(quizId: string) {
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();
  if (quizError) throw quizError;
  const questions = await getQuizQuestions(quizId);
  return { ...quiz, questions };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('prenom, nom, school_name')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getLessons(videoId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('video_id', videoId)
    .order('order', { ascending: true });
  if (error) throw error;
  return data;
}

const QUIZ_ID = '6e504325-1287-41ba-b0a0-ad7c5dbfb7e5'; // par exemple 