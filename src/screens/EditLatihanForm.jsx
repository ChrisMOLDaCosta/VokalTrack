import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, X, SquarePlus, Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../assets/theme';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../libs/supabase';

// ==================== DATA ====================
const categoryOptions = [
  { id: 1, name: 'Pemanasan' },
  { id: 2, name: 'Pernapasan' },
  { id: 3, name: 'Teknik Vokal' },
  { id: 4, name: 'Artikulasi' },
  { id: 5, name: 'Resonansi' },
  { id: 6, name: 'Pitch Control' },
  { id: 7, name: 'Vokal Power' },
];

// KATEGORI 2 KOLOM (KIRI 4, KANAN 3)
const leftColumnCategories = categoryOptions.slice(0, 4);
const rightColumnCategories = categoryOptions.slice(4, 7);

const levelOptions = [
  { id: 1, name: 'Pemula', color: colors.green() },
  { id: 2, name: 'Menengah', color: colors.yellow() },
  { id: 3, name: 'Mahir', color: colors.orange() },
];

export default function EditLatihanForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { latihanId } = route.params;
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState(null);
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState('');
  const [content, setContent] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch data dari Supabase
  const fetchLatihan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('latihan')
        .select('*')
        .eq('id', latihanId)
        .single();

      if (error) throw error;
      
      setTitle(data.title || '');
      
      // Find category object
      const foundCategory = categoryOptions.find(cat => cat.name === data.category);
      setCategory(foundCategory || null);
      
      setDuration(data.duration?.toString() || '');
      
      // Find level object
      const foundLevel = levelOptions.find(lvl => lvl.name === data.level);
      setLevel(foundLevel || null);
      
      setOriginalImage(data.image || '');
      setImage(data.image || null);
      setContent(data.content || '');
      setTips(data.tips || '');
      
    } catch (error) {
      console.error('Error fetching latihan:', error);
      Alert.alert('Error', 'Gagal memuat data latihan');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatihan();
  }, []);

  // Image Picker Functions
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin diperlukan', 'VokalTrack memerlukan akses galeri');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin diperlukan', 'VokalTrack memerlukan akses kamera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Pilih Gambar',
      'Pilih sumber gambar untuk latihan ini',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Galeri', onPress: pickImage },
        { text: 'Kamera', onPress: takePhoto },
        { text: 'Hapus Gambar', style: 'destructive', onPress: () => setImage(null) },
      ],
      { cancelable: true }
    );
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul latihan harus diisi');
      return false;
    }
    if (!category) {
      Alert.alert('Error', 'Kategori harus dipilih');
      return false;
    }
    if (!duration.trim() || isNaN(duration) || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Durasi harus angka positif');
      return false;
    }
    if (!level) {
      Alert.alert('Error', 'Level harus dipilih');
      return false;
    }
    if (!image) {
      Alert.alert('Error', 'Gambar latihan harus diisi');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Deskripsi latihan harus diisi');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setSaving(true);
    
    const finalImageUrl = image === originalImage ? originalImage : image;

    try {
      const { error } = await supabase
        .from('latihan')
        .update({
          title: title.trim(),
          category: category.name,
          duration: parseInt(duration),
          level: level.name,
          image: finalImageUrl,
          content: content.trim(),
          tips: tips.trim() || null,
        })
        .eq('id', latihanId);

      if (error) throw error;
      
      Alert.alert(
        'Berhasil!', 
        'Latihan telah diperbarui',
        [
          { 
            text: 'OK', 
            onPress: () => {
              navigation.replace('LatihanDetail', { latihanId });
            } 
          }
        ]
      );
      
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', error.message || 'Gagal memperbarui latihan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Latihan',
      'Yakin ingin menghapus latihan ini? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              const { error } = await supabase
                .from('latihan')
                .delete()
                .eq('id', latihanId);

              if (error) throw error;
              
              Alert.alert('Berhasil', 'Latihan telah dihapus');
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp', params: { screen: 'LatihanTab' } }],
              });
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus latihan');
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
        <Text style={styles.loadingText}>Memuat data latihan...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color={colors.black()} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Latihan</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 color={colors.red()} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* ==================== GAMBAR ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gambar Latihan</Text>
            <Text style={styles.sectionSubtitle}>Klik gambar untuk mengganti</Text>
            
            <TouchableOpacity onPress={showImagePicker} activeOpacity={0.8}>
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <View style={styles.imageOverlay}>
                    <SquarePlus size={20} color={colors.white()} />
                    <Text style={styles.imageOverlayText}>Ganti Gambar</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.imagePicker}>
                  <SquarePlus size={42} color={colors.grey(0.4)} />
                  <Text style={styles.imagePickerText}>Pilih Gambar</Text>
                  <Text style={styles.imagePickerSubtext}>Gallery atau Kamera</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ==================== JUDUL ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Judul Latihan</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Teknik Pernapasan Diafragma"
              placeholderTextColor={colors.grey(0.4)}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* ==================== KATEGORI - 2 KOLOM ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategori</Text>
            <View style={styles.twoColumnContainer}>
              {/* Kolom Kiri - 4 kategori */}
              <View style={styles.column}>
                {leftColumnCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.twoColumnChip,
                      category?.id === cat.id && styles.twoColumnChipActive
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.twoColumnText,
                      category?.id === cat.id && styles.twoColumnTextActive
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Kolom Kanan - 3 kategori + placeholder */}
              <View style={styles.column}>
                {rightColumnCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.twoColumnChip,
                      category?.id === cat.id && styles.twoColumnChipActive
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.twoColumnText,
                      category?.id === cat.id && styles.twoColumnTextActive
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.placeholderChip} />
              </View>
            </View>
          </View>

          {/* ==================== LEVEL - DI ATAS DURASI ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Level</Text>
            <View style={styles.levelContainer}>
              {levelOptions.map((lvl) => (
                <TouchableOpacity
                  key={lvl.id}
                  style={[
                    styles.levelChip,
                    level?.id === lvl.id && { backgroundColor: lvl.color }
                  ]}
                  onPress={() => setLevel(lvl)}
                >
                  <Text style={[
                    styles.levelText,
                    level?.id === lvl.id && styles.levelTextActive
                  ]}>
                    {lvl.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ==================== DURASI - DI BAWAH LEVEL ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Durasi</Text>
            <View style={styles.durationContainer}>
              <TextInput
                style={styles.durationInput}
                placeholder="15"
                placeholderTextColor={colors.grey(0.4)}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <Text style={styles.durationUnit}>menit</Text>
            </View>
          </View>

          {/* ==================== DESKRIPSI ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deskripsi Latihan</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Jelaskan langkah-langkah latihan..."
              placeholderTextColor={colors.grey(0.4)}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* ==================== TIPS ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips Latihan</Text>
            <Text style={styles.sectionSubtitle}>Opsional</Text>
            <TextInput
              style={[styles.input, styles.textAreaSmall]}
              placeholder="Tips untuk hasil maksimal..."
              placeholderTextColor={colors.grey(0.4)}
              value={tips}
              onChangeText={setTips}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* ==================== SUBMIT BUTTON ==================== */}
          <TouchableOpacity 
            style={[styles.submitButton, saving && styles.submitButtonDisabled]} 
            onPress={handleUpdate}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color={colors.white()} />
            ) : (
              <Text style={styles.submitText}>Update Latihan</Text>
            )}
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ==================== UTAMA ====================
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white(),
  },
  loadingText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    color: colors.grey(0.6),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey(0.1),
    backgroundColor: colors.white(),
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
  },
  deleteButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },

  // ==================== SECTION ====================
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black(),
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.5),
    marginTop: -4,
  },

  // ==================== INPUT ====================
  input: {
    borderWidth: 1,
    borderColor: colors.grey(0.2),
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: 'Pjs-Regular',
    color: colors.black(),
    backgroundColor: colors.white(),
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // ==================== GAMBAR ====================
  imagePicker: {
    borderWidth: 1,
    borderColor: colors.grey(0.2),
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.grey(0.02),
  },
  imagePickerText: {
    fontSize: 14,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.6),
  },
  imagePickerSubtext: {
    fontSize: 11,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.4),
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black(0.6),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  imageOverlayText: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.white(),
  },

  // ==================== KATEGORI - 2 KOLOM ====================
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  twoColumnChip: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 30,
    backgroundColor: colors.grey(0.06),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  twoColumnChipActive: {
    backgroundColor: colors.blue(),
  },
  twoColumnText: {
    fontSize: 13,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.7),
    textAlign: 'center',
  },
  twoColumnTextActive: {
    color: colors.white(),
  },
  placeholderChip: {
    width: '100%',
    height: 46,
    opacity: 0,
  },

  // ==================== LEVEL - 3 KOLOM ====================
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  levelChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.grey(0.06),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.7),
  },
  levelTextActive: {
    color: colors.white(),
  },

  // ==================== DURASI ====================
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grey(0.2),
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  durationInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Pjs-Regular',
    color: colors.black(),
    padding: 0,
  },
  durationUnit: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
    paddingLeft: 8,
  },

  // ==================== SUBMIT BUTTON ====================
  submitButton: {
    backgroundColor: colors.blue(),
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Pjs-SemiBold',
    color: colors.white(),
  },
});