import { View, Image, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";

const { height } = Dimensions.get('window');

export default function About() {
  const router = useRouter();
  const { session, initialized } = useAuth();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialized && !session) {
      router.replace("/welcome");
    }
  }, [initialized, session]);

  if (!initialized || !session) {
    return null;
  }

  const handleContinue = async () => {
    setError('');
    setLoading(true);
    if (!prenom || !nom || !age) {
      setError('Merci de remplir tous les champs.');
      setLoading(false);
      return;
    }
    try {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          prenom,
          nom,
          age: parseInt(age, 10),
        });
      if (upsertError) {
        setError("Erreur lors de l'enregistrement : " + upsertError.message);
        setLoading(false);
        return;
      }
      router.replace('/setup');
    } catch (e) {
      setError("Erreur inattendue");
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Illustration en haut */}
          <Image
            source={require("@/assets/img-violet.png")}
            style={{ width: '100%', height: height * 0.22, resizeMode: 'cover' }}
          />
          <View style={{ width: '100%', paddingHorizontal: 24, paddingTop: 32 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 18, textAlign: 'left' }}>
              À propos de VOX
            </Text>
            <Text style={{ fontSize: 16, color: '#222', marginBottom: 32, lineHeight: 24, textAlign: 'left' }}>
              Vox est une application d'entraide entre étudiants de 18 à 24 ans. Ici, on partage ses galères, ses doutes, ses victoires, et surtout, on se soutient.{"\n"}Pas de jugement, juste des voix qui se répondent quand ça va pas trop… ou même quand ça va mieux.
            </Text>
            {/* Formulaire prénom, nom côte à côte, âge + bouton à côté */}
            <View style={{ width: '100%', marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>Prénom</Text>
                  <TextInput
                    value={prenom}
                    onChangeText={setPrenom}
                    placeholder="Ton prénom"
                    style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 10, color: '#222' }}
                    placeholderTextColor="#A0A4AE"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>Nom</Text>
                  <TextInput
                    value={nom}
                    onChangeText={setNom}
                    placeholder="Ton nom"
                    style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 10, color: '#222' }}
                    placeholderTextColor="#A0A4AE"
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 }}>
                <View style={{ alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 16, color: '#222', marginBottom: 8, marginLeft: 2, alignSelf: 'flex-start' }}>Âge</Text>
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    placeholder="Ton âge"
                    keyboardType="numeric"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    style={{ width: 90, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 10, color: '#222', textAlign: 'center', alignSelf: 'flex-start' }}
                    placeholderTextColor="#A0A4AE"
                  />
                </View>
                <View style={{ flex: 1 }} />
                <Button
                  style={{ backgroundColor: '#222', borderRadius: 16, paddingVertical: 16, minWidth: 120, alignSelf: 'flex-end' }}
                  onPress={handleContinue}
                  disabled={loading}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{loading ? 'Enregistrer' : 'Continuer'}</Text>
                </Button>
              </View>
            </View>
            {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
} 