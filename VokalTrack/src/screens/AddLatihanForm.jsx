import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';

const categoryOptions = ['Pemanasan', 'Pernapasan', 'Teknik Vokal', 'Artikulasi', 'Resonansi', 'Pitch Control', 'Vokal Power'];
const levelOptions = ['Pemula', 'Menengah', 'Mahir'];

export default function AddLatihanForm() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !category || !duration.trim() || !level) {
      Alert.alert('Error', 'Semua bidang harus diisi');
      return;
    }
    if (isNaN(duration) || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Durasi harus berupa angka positif');
      return;
    }
    // Simulasi simpan data (nanti bisa diintegrasi API)
    Alert.alert('Berhasil', 'Latihan baru ditambahkan!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Tambah Latihan</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Judul Latihan</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Contoh: Latihan Pernafasan Diafragma" placeholderTextColor={colors.grey(0.5)} />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.optionsContainer}>
          {categoryOptions.map(cat => (
            <TouchableOpacity key={cat} style={[styles.optionChip, category === cat && styles.optionChipActive]} onPress={() => setCategory(cat)}>
              <Text style={[styles.optionText, category === cat && styles.optionTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Durasi (menit)</Text>
        <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="Contoh: 15" placeholderTextColor={colors.grey(0.5)} keyboardType="numeric" />

        <Text style={styles.label}>Level</Text>
        <View style={styles.optionsContainer}>
          {levelOptions.map(lvl => (
            <TouchableOpacity key={lvl} style={[styles.optionChip, level === lvl && styles.optionChipActive]} onPress={() => setLevel(lvl)}>
              <Text style={[styles.optionText, level === lvl && styles.optionTextActive]}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>URL Gambar (opsional)</Text>
        <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://images.unsplash.com/..." placeholderTextColor={colors.grey(0.5)} />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Simpan Latihan</Text>
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
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  optionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, backgroundColor: colors.grey(0.08) },
  optionChipActive: { backgroundColor: colors.blue() },
  optionText: { fontSize: 13, fontFamily: 'Pjs-Medium', color: colors.grey(0.7) },
  optionTextActive: { color: colors.white() },
  submitButton: { backgroundColor: colors.blue(), paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  submitText: { fontSize: 16, fontFamily: 'Pjs-SemiBold', color: colors.white() },
});