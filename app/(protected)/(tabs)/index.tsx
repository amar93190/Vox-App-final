import { View, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "@/components/safe-area-view";
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import DemanderAide from "@/components/demander-aide";
import AccueilAideur from "@/components/accueil-aideur";
import AssistantIA from '@/components/AssistantIA';

export default function Home() {
	const router = useRouter();
	const [tab, setTab] = useState<'aider' | 'demander'>('aider');

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
			<ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ flexGrow: 1 }}>
				<View className="p-4 gap-y-8" style={{ backgroundColor: '#fff', minHeight: '100%' }}>
					{/* Test simple */}
					{/* <H1 className="text-black text-4xl font-extrabold">
						Page d'accueil
					</H1> */}
					
					{/* Switch boutons */}
					<View className="flex-row justify-center mb-6 gap-x-4">
						<TouchableOpacity
							onPress={() => setTab('aider')}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: tab === 'aider' ? '#FFE082' : '#F6F6F6',
								paddingVertical: 12,
								paddingHorizontal: 18,
								borderRadius: 16,
								marginRight: 10,
								elevation: tab === 'aider' ? 2 : 0,
							}}
						>
							<MaterialCommunityIcons name="handshake-outline" size={24} color={tab === 'aider' ? '#111' : '#7A7D85'} style={{ marginRight: 10 }} />
							<Text style={{ fontSize: 14, fontWeight: '700', color: tab === 'aider' ? '#111' : '#7A7D85' }}>Envie d'aider ?</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setTab('demander')}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: tab === 'demander' ? '#FFE082' : '#F6F6F6',
								paddingVertical: 12,
								paddingHorizontal: 18,
								borderRadius: 16,
							}}
						>
							<Feather name="activity" size={24} color={tab === 'demander' ? '#111' : '#7A7D85'} style={{ marginRight: 10 }} />
							<Text style={{ fontSize: 14, fontWeight: '700', color: tab === 'demander' ? '#111' : '#7A7D85' }}>Demander de l'aide</Text>
						</TouchableOpacity>
					</View>
					
					{/* Bloc dynamique */}
					{tab === 'aider' ? <AccueilAideur /> : <DemanderAide />}
				</View>
			</ScrollView>
			<AssistantIA />
		</SafeAreaView>
	);
}
