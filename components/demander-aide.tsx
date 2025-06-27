import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { View, Image as RNImage } from "react-native";
import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { Image } from "@/components/image";
import { useRouter } from 'expo-router';

const formSchema = z.object({
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  difficulty_type: z.string().min(1, "Type de difficulté requis"),
  floor: z.string().optional(),
  description: z.string().min(1, "Description requise"),
});

type FormValues = z.infer<typeof formSchema>;

function DemanderAide() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      difficulty_type: "",
      floor: "",
      description: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setErrorMsg("");
    setSuccess("");
    if (!session?.user?.id) {
      setErrorMsg("Utilisateur non connecté");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('help_requests').insert({
      user_id: session.user.id,
      first_name: values.first_name,
      last_name: values.last_name,
      difficulty_type: values.difficulty_type,
      floor: values.floor,
      description: values.description,
      status: 'pending',
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess("Demande envoyée avec succès !");
      form.reset();
      router.replace('/waiting-for-helper');
      return;
    }
    setLoading(false);
  }

  return (
    <View className="p-0" style={{ backgroundColor: '#fff', borderRadius: 16 }}>
      {/* Header avec avatar à droite */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <H1 className="text-black text-4xl font-extrabold" style={{ flex: 1, lineHeight: 44 }}>
          Tu as besoin d'aide ?{"\n"}Commence ici.
        </H1>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
          style={{ width: 54, height: 54, borderRadius: 27, marginLeft: 12, backgroundColor: '#fff' }}
          resizeMode="cover"
        />
      </View>
      <Text className="text-base mb-6" style={{ color: '#A0A4AE', lineHeight: 22 }}>
        Remplis ce formulaire pour que nous puissions mieux t'accompagner.{"\n"}
        <Text style={{ color: '#A0A4AE', fontSize: 13 }}>*Une personne de l'équipe reviendra vers toi sous 24h</Text>
      </Text>
      <View style={{ backgroundColor: '#E6F3FF', borderRadius: 24, padding: 20, marginBottom: 16 }}>
        <Form {...form}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormInput placeholder="Nom" {...field} className="text-black" style={{ backgroundColor: '#fff', borderRadius: 12, borderColor: '#E0E0E0', color: '#222' }} placeholderTextColor="#A0A4AE" showLabel={false} />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormInput placeholder="Prénom" {...field} className="text-black" style={{ backgroundColor: '#fff', borderRadius: 12, borderColor: '#E0E0E0', color: '#222' }} placeholderTextColor="#A0A4AE" showLabel={false} />
                )}
              />
            </View>
          </View>
          <FormField
            control={form.control}
            name="difficulty_type"
            render={({ field }) => (
              <FormInput placeholder="Type de difficulté" {...field} className="text-black" style={{ backgroundColor: '#fff', borderRadius: 12, borderColor: '#E0E0E0', color: '#222', marginBottom: 16 }} placeholderTextColor="#A0A4AE" showLabel={false} />
            )}
          />
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormInput placeholder="Quel étage" {...field} className="text-black" style={{ backgroundColor: '#fff', borderRadius: 12, borderColor: '#E0E0E0', color: '#222', marginBottom: 16 }} placeholderTextColor="#A0A4AE" showLabel={false} />
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormInput placeholder="Décris ta situation..." multiline numberOfLines={4} {...field} className="text-black" style={{ backgroundColor: '#fff', borderRadius: 12, borderColor: '#E0E0E0', color: '#222', marginBottom: 16, minHeight: 80 }} placeholderTextColor="#A0A4AE" showLabel={false} />
            )}
          />
          {errorMsg ? <Text className="text-destructive mt-2">{errorMsg}</Text> : null}
          {success ? <Text className="text-success mt-2">{success}</Text> : null}
          <Button className="mt-4" style={{ backgroundColor: '#222', borderRadius: 12, paddingVertical: 16, marginTop: 48 }} onPress={form.handleSubmit(onSubmit)} disabled={loading}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{loading ? "Envoi..." : "Envoyer ma demande"}</Text>
          </Button>
        </Form>
      </View>
    </View>
  );
}

export default DemanderAide; 