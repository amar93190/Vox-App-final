import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import { Image } from "@/components/image";

const formSchema = z.object({
	email: z.string().email("Veuillez entrer une adresse email valide."),
	password: z
		.string()
		.min(8, "Veuillez entrer au moins 8 caractères.")
		.max(64, "Veuillez entrer moins de 64 caractères."),
});

export default function SignIn() {
	const { signIn } = useAuth();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signIn(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.error(error.message);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-white p-4" edges={["bottom"]}>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
					<View className="flex-1 justify-center">
						<View className="items-center mb-8">
							<Image source={require("@/assets/logo-vox-jaune.png")} className="w-[90vw] h-32 mb-4" resizeMode="contain" />
							<Text className="text-2xl font-bold text-black mb-2 text-center">Bienvenue sur vox</Text>
							<Text className="text-base text-gray-400 text-center mb-6">Veuillez saisir votre email d'inscription et{"\n"}votre mot de passe.</Text>
						</View>
						<Form {...form}>
							<View className="gap-4 mb-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormInput
											label={undefined}
											placeholder="E-mail ou nom d'utilisateur"
											autoCapitalize="none"
											autoComplete="email"
											autoCorrect={false}
											keyboardType="email-address"
											className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base w-[90%] self-center"
											style={{ color: '#222' }}
											placeholderTextColor="#A0A4AE"
											{...field}
										/>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormInput
											label={undefined}
											placeholder="Mot de passe"
											autoCapitalize="none"
											autoCorrect={false}
											secureTextEntry
											className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base w-[90%] self-center"
											style={{ color: '#222' }}
											placeholderTextColor="#A0A4AE"
											{...field}
										/>
									)}
								/>
							</View>
							<Button
								size="default"
								variant="default"
								onPress={form.handleSubmit(onSubmit)}
								disabled={form.formState.isSubmitting}
								className="rounded-xl bg-black py-3 w-[90%] self-center"
							>
								{form.formState.isSubmitting ? (
									<ActivityIndicator size="small" />
								) : (
									<Text className="text-white text-base font-semibold">Se connecter</Text>
								)}
							</Button>
							<Text className="text-center text-gray-400 mt-2 mb-4 text-sm">Mot de passe oublié</Text>
							<View className="flex-row items-center my-2">
								<View className="flex-1 h-px bg-gray-200" />
								<Text className="mx-2 text-gray-400">ou</Text>
								<View className="flex-1 h-px bg-gray-200" />
							</View>
							<Button
								variant="outline"
								className="rounded-xl border border-gray-300 bg-white flex-row items-center justify-center py-3 w-[90%] self-center"
							>
								<Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" }} className="w-5 h-5 mr-2" />
								<Text className="text-black text-base">Se connecter avec Google</Text>
							</Button>
						</Form>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
