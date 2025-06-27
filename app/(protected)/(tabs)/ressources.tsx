import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { SafeAreaView } from '@/components/safe-area-view';
import { useRouter } from 'expo-router';
import AssistantIA from '@/components/AssistantIA';

export default function RessourcesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32, marginTop: 32 }}>
        <Text style={styles.sectionTitle}>Ressources</Text>
        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: '#FFF9DB' }]}> {/* Jaune pâle */}
            <MaterialIcons name="description" size={28} color="#222" style={styles.cardIcon} />
            <Text style={styles.cardText}>Droits des étudiants</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#F3EDFF' }]}> {/* Violet pâle */}
            <MaterialCommunityIcons name="cash-multiple" size={28} color="#222" style={styles.cardIcon} />
            <Text style={styles.cardText}>Aides financières</Text>
          </View>
        </View>
        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: '#E6F3FF' }]}> {/* Bleu pâle */}
            <FontAwesome5 name="smile" size={28} color="#222" style={styles.cardIcon} />
            <Text style={styles.cardText}>Soutien psychologique</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#FFF9DB' }]}> {/* Jaune pâle */}
            <Feather name="user" size={28} color="#222" style={styles.cardIcon} />
            <Text style={styles.cardText}>Contacts utiles</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>FAQ</Text>
        <View style={styles.faqCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.faqText, { fontWeight: 'bold' }]}>Mes données sont-elles protégées ?</Text>
            <Text style={{ color: '#666', fontSize: 15, marginTop: 8 }}>
              Oui, toutes vos données sont chiffrées et stockées de façon sécurisée. Nous respectons la confidentialité de vos informations personnelles.
            </Text>
          </View>
          <Feather name="chevron-down" size={22} color="#222" />
        </View>
        <View style={styles.faqCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.faqText, { fontWeight: 'bold' }]}>Comment signaler un contenu inapproprié ?</Text>
            <Text style={{ color: '#666', fontSize: 15, marginTop: 8 }}>
              Pour signaler un contenu, cliquez sur le bouton "Signaler" présent sous chaque ressource ou contactez notre support via le formulaire dédié.
            </Text>
          </View>
          <Feather name="chevron-down" size={22} color="#222" />
        </View>
        <View style={styles.faqCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.faqText, { fontWeight: 'bold' }]}>Comment obtenir mes ECTS ?</Text>
            <Text style={{ color: '#666', fontSize: 15, marginTop: 8 }}>
              Les ECTS sont attribués automatiquement à la fin de chaque module validé. Consultez votre profil pour voir le total cumulé.
            </Text>
          </View>
          <Feather name="chevron-down" size={22} color="#222" />
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 0,
    color: '#222',
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A4AE',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 100,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardText: {
    fontSize: 17,
    color: '#222',
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  faqText: {
    fontSize: 16,
    color: '#222',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});

function darken(hex: string, amount = 0.18) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  let r = Math.max(0, ((num >> 16) & 0xff) - 255 * amount);
  let g = Math.max(0, ((num >> 8) & 0xff) - 255 * amount);
  let b = Math.max(0, (num & 0xff) - 255 * amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b | 0).toString(16).slice(1)}`;
} 