import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Camera, User, Mail, Check, X, Award, Calendar } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../assets/theme';
import { supabase } from '../libs/supabase';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditProfileForm() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nameLength, setNameLength] = useState(0);
  const [bioLength, setBioLength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch user data from Supabase Auth
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (user) {
        setName(user.user_metadata?.full_name || '');
        setNameLength(user.user_metadata?.full_name?.length || 0);
        setEmail(user.email || '');
        setBio(user.user_metadata?.bio || '');
        setBioLength(user.user_metadata?.bio?.length || 0);
        setPhotoUrl(user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('Error', 'Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
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
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
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
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Ubah Foto Profil',
      'Pilih sumber foto',
      [
        { text: 'Batal', style: 'cancel' },
        { text: '📸 Galeri', onPress: pickImage },
        { text: '📷 Kamera', onPress: takePhoto },
        { text: '🗑️ Hapus Foto', style: 'destructive', onPress: () => setPhotoUrl('') },
      ]
    );
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return false;
    }
    if (name.trim().length < 3) {
      Alert.alert('Error', 'Nama minimal 3 karakter');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Email tidak boleh kosong');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Email tidak valid');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          bio: bio.trim() || null,
          avatar_url: photoUrl,
          updated_at: new Date().toISOString(),
        }
      });
      
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      Alert.alert(
        '✨ Berhasil!',
        'Profil Anda telah diperbarui',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <LinearGradient
          colors={[colors.blue(0.03), colors.white()]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft color={colors.black()} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profil</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveHeaderButton}>
              {saving ? (
                <ActivityIndicator size="small" color={colors.blue()} />
              ) : (
                <Text style={styles.saveHeaderText}>Simpan</Text>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Foto Profil */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={showImagePicker} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.blue(0.1), colors.blue(0.05)]}
                style={styles.photoBorder}
              >
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={styles.profilePhoto} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <User size={50} color={colors.blue(0.5)} />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Camera size={16} color={colors.white()} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.photoHint}>Klik untuk mengganti foto</Text>
          </View>

          {/* Nama Lengkap */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <User size={16} color={colors.blue()} />
              <Text style={styles.label}>Nama Lengkap</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={colors.grey(0.4)}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameLength(text.length);
              }}
              maxLength={50}
            />
            <Text style={styles.counter}>{nameLength}/50 karakter</Text>
          </View>

          {/* Email */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Mail size={16} color={colors.blue()} />
              <Text style={styles.label}>Email</Text>
            </View>
            <View style={styles.emailContainer}>
              <TextInput
                style={[styles.input, styles.inputReadonly]}
                placeholder="email@example.com"
                placeholderTextColor={colors.grey(0.4)}
                value={email}
                editable={false}
              />
              <View style={styles.emailBadge}>
                <Text style={styles.emailBadgeText}>Terverifikasi</Text>
              </View>
            </View>
            <Text style={styles.hint}>Email tidak dapat diubah</Text>
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Award size={16} color={colors.blue()} />
              <Text style={styles.label}>Bio</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ceritakan tentang dirimu..."
              placeholderTextColor={colors.grey(0.4)}
              value={bio}
              onChangeText={(text) => {
                setBio(text);
                setBioLength(text.length);
              }}
              multiline
              numberOfLines={4}
              maxLength={150}
              textAlignVertical="top"
            />
            <Text style={styles.counter}>{bioLength}/150 karakter</Text>
          </View>

          {/* Member Since */}
          <View style={styles.infoCard}>
            <Calendar size={16} color={colors.grey(0.5)} />
            <Text style={styles.infoText}>Member sejak 2025</Text>
          </View>

          {/* Success Banner */}
          {showSuccess && (
            <View style={styles.successBanner}>
              <Check size={18} color={colors.green()} />
              <Text style={styles.successText}>Profil berhasil diperbarui!</Text>
            </View>
          )}
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  headerGradient: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey(0.1),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
  },
  saveHeaderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveHeaderText: {
    fontSize: 14,
    fontFamily: 'Pjs-SemiBold',
    color: colors.blue(),
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
  },
  profilePhoto: {
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 3,
    borderColor: colors.white(),
  },
  photoPlaceholder: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: colors.grey(0.08),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.blue(),
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white(),
    shadowColor: colors.black(0.2),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoHint: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
    marginTop: 12,
  },
  section: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black(),
  },
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
  inputReadonly: {
    backgroundColor: colors.grey(0.05),
    color: colors.grey(0.5),
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 10,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.5),
    textAlign: 'right',
  },
  hint: {
    fontSize: 10,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.5),
  },
  emailContainer: {
    position: 'relative',
  },
  emailBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: colors.green(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emailBadgeText: {
    fontSize: 10,
    fontFamily: 'Pjs-Medium',
    color: colors.green(),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.grey(0.05),
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.green(0.1),
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  successText: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.green(),
  },
});