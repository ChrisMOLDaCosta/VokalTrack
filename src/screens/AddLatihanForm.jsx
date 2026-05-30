import React, { useState } from 'react';
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
import { ArrowLeft, X, SquarePlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../assets/theme';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../libs/supabase';

// ✅ KATEGORI - 7 ITEM, DI BAGI MENJADI 2 KOLOM (4 + 3)
const categoryOptions = [
  { id: 1, name: 'Pemanasan' },
  { id: 2, name: 'Pernapasan' },
  { id: 3, name: 'Teknik Vokal' },
  { id: 4, name: 'Artikulasi' },
  { id: 5, name: 'Resonansi' },
  { id: 6, name: 'Pitch Control' },
  { id: 7, name: 'Vokal Power' },
];

// ✅ BAGI MENJADI 2 KOLOM
// Kolom Kiri: 4 item
// Kolom Kanan: 3 item
const leftColumnCategories = [categoryOptions[0], categoryOptions[1], categoryOptions[2], categoryOptions[3]];
const rightColumnCategories = [categoryOptions[4], categoryOptions[5], categoryOptions[6]];

const levelOptions = [
  { id: 1, name: 'Pemula', color: colors.green() },
  { id: 2, name: 'Menengah', color: colors.yellow() },
  { id: 3, name: 'Mahir', color: colors.orange() },
];

export default function AddLatihanForm() {
  const navigation = useNavigation();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

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
      setImageUrl('');
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
      setImageUrl('');
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
      ],
      { cancelable: true }
    );
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl('');
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
    if (!image && !imageUrl) {
      Alert.alert('Error', 'Gambar latihan harus diisi');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Deskripsi latihan harus diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    const finalImageUrl = image || imageUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800';
    const createdAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    try {
      const { data, error } = await supabase
        .from('latihan')
        .insert({
          title: title.trim(),
          category: category.name,
          duration: parseInt(duration),
          level: level.name,
          image: finalImageUrl,
          content: content.trim(),
          tips: tips.trim() || null,
          total_likes: 0,
          total_comments: 0,
          rating: 0,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      
      Alert.alert(
        'Berhasil!', 
        'Latihan baru telah ditambahkan',
        [
          { 
            text: 'OK', 
            onPress: () => {
              navigation.replace('MainApp', { screen: 'LatihanTab' });
            } 
          }
        ]
      );
      
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Gagal menambahkan latihan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color={colors.black()} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tambah Latihan</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* ==================== GAMBAR ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gambar Latihan</Text>
            <Text style={styles.sectionSubtitle}>Pilih gambar untuk latihan ini</Text>
            
            {image || imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image || imageUrl }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <X size={16} color={colors.white()} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.imagePicker} onPress={showImagePicker}>
                <SquarePlus size={42} color={colors.grey(0.4)} />
                <Text style={styles.imagePickerText}>Pilih Gambar</Text>
                <Text style={styles.imagePickerSubtext}>Gallery atau Kamera</Text>
              </TouchableOpacity>
            )}
            
            {!image && !imageUrl && (
              <View style={styles.urlContainer}>
                <Text style={styles.urlLabel}>Atau masukkan URL gambar</Text>
                <TextInput
                  style={styles.urlInput}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={colors.grey(0.4)}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />
              </View>
            )}
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

          {/* ==================== KATEGORI - 2 KOLOM SIMETRIS ==================== */}
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
              
              {/* Kolom Kanan - 3 kategori + 1 placeholder untuk simetri */}
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

          {/* ==================== LEVEL - 3 KOLOM ==================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Level</Text>
            <View style={styles.threeColumnContainer}>
              {levelOptions.map((lvl) => (
                <TouchableOpacity
                  key={lvl.id}
                  style={[
                    styles.threeColumnChip,
                    level?.id === lvl.id && { backgroundColor: lvl.color }
                  ]}
                  onPress={() => setLevel(lvl)}
                >
                  <Text style={[
                    styles.threeColumnText,
                    level?.id === lvl.id && styles.threeColumnTextActive
                  ]}>
                    {lvl.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ==================== DURASI ==================== */}
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
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white()} />
            ) : (
              <Text style={styles.submitText}>Simpan Latihan</Text>
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
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.black(0.6),
    borderRadius: 20,
    padding: 6,
  },
  urlContainer: {
    marginTop: 12,
    gap: 6,
  },
  urlLabel: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.6),
  },
  urlInput: {
    borderWidth: 1,
    borderColor: colors.grey(0.2),
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
    fontFamily: 'Pjs-Regular',
    color: colors.black(),
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
  threeColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  threeColumnChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.grey(0.06),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  threeColumnText: {
    fontSize: 14,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.7),
  },
  threeColumnTextActive: {
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