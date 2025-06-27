import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from '@/components/safe-area-view';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import { router } from 'expo-router';
import { askChatGPT } from '@/lib/chatgpt';
import { Feather } from '@expo/vector-icons';

const prompt = `Tu es un ami sympa, bienveillant et chill. Génère un message vocal pour un podcast quotidien, structuré en deux parties distinctes :
1. Commence par un message pour remonter le moral de la personne, chaleureux, bienveillant, style "ami" (2-3 phrases max).
2. Ensuite, fais une transition du type "Aujourd'hui, on va parler des handicaps visuels..." puis propose un court contenu pédagogique sur ce thème (3-4 phrases max, vulgarisé, positif, accessible).
Sépare bien les deux parties par le séparateur '---'. Utilise un ton détendu, amical, comme si tu parlais à un pote. N'utilise pas de formules trop formelles.`;

// Fonction pour sélectionner la meilleure voix française naturelle
const selectBestFrenchVoice = (voices) => {
  // Privilégie Marie (féminine, Siri, très naturelle)
  const marie = voices.find(v => v.identifier.includes('siri_marie_fr-FR'));
  if (marie) return marie.identifier;
  // Sinon Thomas (masculine, neutre, très naturelle)
  const thomas = voices.find(v => v.identifier.includes('fr-FR.Thomas'));
  if (thomas) return thomas.identifier;
  // Fallback: première voix fr-FR
  const fr = voices.find(v => v.language === 'fr-FR');
  return fr ? fr.identifier : undefined;
};

export default function EntretienJournalier() {
  const [displayed, setDisplayed] = useState('');
  const [fullText, setFullText] = useState('');
  const [part, setPart] = useState(0); // 0: intro, 1: contenu
  const [loading, setLoading] = useState(true);

  // Affiche la liste des voix disponibles dans la console
  useEffect(() => {
    Speech.getAvailableVoicesAsync().then(voices => {
      console.log('VOIX DISPONIBLES:', voices);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    askChatGPT(prompt).then(async (texte) => {
      if (!isMounted) return;
      setFullText(texte);
      // Découpe le texte en deux parties
      const [intro, contenu] = texte.split('---').map(t => t.trim());
      // Affiche et lit la première partie
      setPart(0);
      let i = 0;
      setDisplayed('');
      const interval = setInterval(() => {
        setDisplayed(intro.slice(0, i + 1));
        i++;
        if (i >= intro.length) clearInterval(interval);
      }, 28);
      let voice = undefined;
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        voice = selectBestFrenchVoice(voices);
      } catch {}
      Speech.speak(intro, { language: 'fr-FR', rate: 0.5, voice });
      // Après la première partie, enchaîne la deuxième
      setTimeout(() => {
        setPart(1);
        let j = 0;
        setDisplayed('');
        const interval2 = setInterval(() => {
          setDisplayed(contenu.slice(0, j + 1));
          j++;
          if (j >= contenu.length) clearInterval(interval2);
        }, 28);
        Speech.speak(contenu, { language: 'fr-FR', rate: 0.5, voice });
        setLoading(false);
      }, Math.max(intro.length * 45, 3500)); // attend la fin de la première partie (ajuste si besoin)
    });
    return () => {
      isMounted = false;
      Speech.stop();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between', paddingHorizontal: 8 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: 2 }}>
          <Feather name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <LottieView
          source={require('@/assets/ia.json')}
          style={{ width: 180, height: 180, marginBottom: 32 }}
          autoPlay
          loop
          speed={1}
          resizeMode="contain"
        />
        <Text style={styles.text}>{loading ? 'Génération du message...' : displayed}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 28,
  },
}); 