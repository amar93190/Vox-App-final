import { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";
import SchoolSelect from "@/components/school-select";

const SCHOOLS = [
  "digital-campus(Paris)",
  "Aix-en-Provence",
  "Biarritz",
  "Bordeaux",
  "Dakar",
  "La Réunion",
  "Lyon",
  "Montpellier",
  "Nantes",
  "Paris",
  "Rennes",
  "Strasbourg",
  "Toulouse"
];

const { height } = Dimensions.get('window');

export default function Setup() {
  const router = useRouter();
  const { session, initialized } = useAuth();
  const [selectedSchool, setSelectedSchool] = useState("digital-campus(Paris)");
  const [selectedRole, setSelectedRole] = useState<'help' | 'be_helped' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Protection de la page - redirection si pas connecté
  useEffect(() => {
    if (initialized && !session) {
      router.replace("/welcome");
    }
  }, [initialized, session]);

  // Si pas encore initialisé, afficher rien
  if (!initialized || !session) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedSchool) {
      setError("Veuillez sélectionner votre école");
      return;
    }
    if (!selectedRole) {
      setError("Veuillez choisir une option");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session?.user?.id,
          school_name: selectedSchool,
          wants_to_help: selectedRole === 'help',
          wants_help: selectedRole === 'be_helped',
          setup_completed: true
        });
      if (profileError) {
        console.error('Error saving profile:', profileError);
        setError("Erreur lors de la sauvegarde du profil");
        setLoading(false);
        return;
      }
      router.replace("/(protected)");
    } catch (err) {
      console.error('Error in setup:', err);
      setError("Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        {/* Image en haut */}
        <Image
          source={require("@/assets/img-violet.png")}
          style={{ width: '100%', height: height * 0.38, resizeMode: 'cover' }}
        />
        {/* Contenu en bas */}
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
          {/* Label école */}
          <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Nom de ton école</Text>
          {/* Sélecteur d'école */}
          <SchoolSelect
            value={selectedSchool}
            onValueChange={setSelectedSchool}
            schools={SCHOOLS}
          />
          {/* Label choix */}
          <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 17, marginTop: 24, marginBottom: 12 }}>Tu souhaites</Text>
          {/* Boutons côte à côte */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginBottom: 32 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: selectedRole === 'be_helped' ? '#FFF9DB' : '#FFFBEA',
                borderRadius: 18,
                paddingVertical: 32,
                alignItems: 'center',
                borderWidth: selectedRole === 'be_helped' ? 2 : 1,
                borderColor: selectedRole === 'be_helped' ? '#FFD600' : '#E0E0E0',
                shadowColor: selectedRole === 'be_helped' ? '#FFD600' : 'transparent',
                shadowOpacity: selectedRole === 'be_helped' ? 0.12 : 0,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
              onPress={() => setSelectedRole('be_helped')}
            >
              <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 22 }}>Être aidé</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: selectedRole === 'help' ? '#FFF9DB' : '#FFFBEA',
                borderRadius: 18,
                paddingVertical: 32,
                alignItems: 'center',
                borderWidth: selectedRole === 'help' ? 2 : 1,
                borderColor: selectedRole === 'help' ? '#FFD600' : '#E0E0E0',
                shadowColor: selectedRole === 'help' ? '#FFD600' : 'transparent',
                shadowOpacity: selectedRole === 'help' ? 0.12 : 0,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
              onPress={() => setSelectedRole('help')}
            >
              <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 22 }}>Aider</Text>
            </TouchableOpacity>
          </View>
          {/* Texte explicatif */}
          <Text style={{ color: '#A0A4AE', fontSize: 15, marginBottom: 18, textAlign: 'center' }}>
            *Ce choix est optionnel, on peut être celui qui aide et celui qui se fait aider, mais également être les deux.
          </Text>
          {/* Message d'erreur */}
          {error ? (
            <Text className="text-red-500 text-center" style={{ marginBottom: 12 }}>{error}</Text>
          ) : null}
          {/* Bouton continuer */}
          <Button
            style={{
              backgroundColor: '#222',
              borderRadius: 18,
              paddingVertical: 18,
              marginTop: 'auto',
              marginBottom: 24
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {loading ? "Sauvegarde..." : "Continuer"}
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
} 