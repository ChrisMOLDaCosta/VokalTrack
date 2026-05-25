import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';
import { ProfileData } from '../data/profiledata';

export default function EditProfileForm() {
  const navigation = useNavigation();
  const [name, setName] = useState(ProfileData.name);
  const [bio, setBio] = useState('Vocalis | VokalTrack User');
  const [photoUrl, setPhotoUrl] = useState(ProfileData.profilePict);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return;
    }
    Alert.alert('Berhasil', 'Profil berhasil diperbarui');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profil</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nama Anda" placeholderTextColor={colors.grey(0.5)} />

        <Text style={styles.label}>Bio</Text>
        <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={bio} onChangeText={setBio} placeholder="Tentang Anda" placeholderTextColor={colors.grey(0.5)} multiline />

        <Text style={styles.label}>URL Foto Profil</Text>
        <TextInput style={styles.input} value={photoUrl} onChangeText={setPhotoUrl} placeholder="https://..." placeholderTextColor={colors.grey(0.5)} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.grey(0.2) },
  title: { fontSize: 18, fontFamily: 'Pjs-Bold', color: colors.black() },
  form: { padding: 20, gap: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontFamily: 'Pjs-SemiBold', color: colors.black(), marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.grey(0.3), borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'Pjs-Regular', color: colors.black() },
  saveButton: { backgroundColor: colors.blue(), paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  saveText: { fontSize: 16, fontFamily: 'Pjs-SemiBold', color: colors.white() },
});