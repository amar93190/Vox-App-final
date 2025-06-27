import React from "react";
import { Tabs } from "expo-router";
import { Feather } from '@expo/vector-icons';

import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

export default function TabsLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#fff',
					borderTopWidth: 0,
					elevation: 0,
				},
				tabBarActiveTintColor: '#111',
				tabBarInactiveTintColor: '#7A7D85',
				tabBarShowLabel: true,
				tabBarLabelStyle: {
					fontSize: 18,
					fontWeight: '500',
					marginTop: 6,
				},
				tabBarIcon: ({ focused, color, size }) => {
					if (route.name === 'index') {
						return <Feather name="home" size={28} color={color} />;
					} else if (route.name === 'formations') {
						return <Feather name="book-open" size={28} color={color} />;
					} else if (route.name === 'ressources') {
						return <Feather name="alert-octagon" size={28} color={color} />;
					} else if (route.name === 'compte') {
						return <Feather name="user" size={28} color={color} />;
					}
					return null;
				},
			})}
		>
			<Tabs.Screen name="index" options={{ title: "Accueil" }} />
			<Tabs.Screen name="formations" options={{ title: "Formations" }} />
			<Tabs.Screen name="ressources" options={{ title: "Ressources" }} />
			<Tabs.Screen name="compte" options={{ title: "Compte" }} />
		</Tabs>
	);
}
