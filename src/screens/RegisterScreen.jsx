import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Animated,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../assets/theme';
import { supabase } from '../libs/supabase';

export default function RegisterScreen() {
  const navigation = useNavigation();
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // Validation State
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isFormValid, setIsFormValid] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    validateForm();
  }, [fullName, email, password, confirmPassword]);

  const validateForm = () => {
    let newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Nama lengkap harus diisi';
      isValid = false;
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Minimal 3 karakter';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email harus diisi';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email tidak valid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password harus diisi';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Minimal 6 karakter';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      isValid = false;
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { text: '', color: colors.grey(0.5), width: '0%' };
    if (password.length < 6) return { text: 'Lemah', color: colors.red(), width: '33%' };
    if (password.length < 8) return { text: 'Sedang', color: colors.yellow(), width: '66%' };
    return { text: 'Kuat', color: colors.green(), width: '100%' };
  };

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validasi Gagal', 'Nama lengkap harus diisi');
      return;
    }
    if (fullName.trim().length < 3) {
      Alert.alert('Validasi Gagal', 'Nama lengkap minimal 3 karakter');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Validasi Gagal', 'Email harus diisi');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validasi Gagal', 'Email tidak valid');
      return;
    }
    if (!password) {
      Alert.alert('Validasi Gagal', 'Password harus diisi');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validasi Gagal', 'Password minimal 6 karakter');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validasi Gagal', 'Password tidak cocok');
      return;
    }

    setLoading(true);
    
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: { full_name: fullName.trim() }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        
        if (!loginError) {
          navigation.replace('MainApp');
          return;
        }
      }

      Alert.alert('Berhasil!', 'Akun berhasil dibuat. Silakan login.', [
        { text: 'Login', onPress: () => navigation.replace('Login') }
      ]);
      
    } catch (error) {
      let errorMessage = 'Gagal mendaftar. Silakan coba lagi.';
      if (error.message.includes('User already registered')) {
        errorMessage = 'Email sudah terdaftar.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* LOGO SECTION - CENTERED */}
              <Animated.View style={[styles.logoSection, { transform: [{ scale: logoScale }] }]}>
                <View style={styles.logoCircle}>
                  <Image 
                    source={require('../../assets/icon.png')} 
                    style={styles.logoImage} 
                  />
                </View>
                <Text style={styles.appName}>VokalTrack</Text>
                <Text style={styles.tagline}>Latihan Vokal Profesional</Text>
              </Animated.View>

              {/* FORM SECTION */}
              <Animated.View style={[styles.formSection, { transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.title}>Mulai Perjalananmu!</Text>
                <Text style={styles.subtitle}>Daftar sekarang dan tingkatkan kemampuan vokalmu</Text>

                {/* FULL NAME */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama Lengkap</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedField === 'name' && styles.inputContainerFocused,
                    errors.fullName ? styles.inputContainerError : (fullName.length > 0 && styles.inputContainerValid),
                  ]}>
                    <User size={18} color={colors.grey(0.5)} />
                    <TextInput
                      style={styles.input}
                      placeholder="Masukkan nama lengkap"
                      placeholderTextColor={colors.grey(0.4)}
                      value={fullName}
                      onChangeText={setFullName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {fullName.length > 0 && !errors.fullName && (
                      <CheckCircle size={16} color={colors.green()} />
                    )}
                  </View>
                  {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}
                  {!errors.fullName && fullName.length > 0 && <Text style={styles.success}>✓ Nama valid</Text>}
                </View>

                {/* EMAIL */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedField === 'email' && styles.inputContainerFocused,
                    errors.email ? styles.inputContainerError : (email.length > 0 && styles.inputContainerValid),
                  ]}>
                    <Mail size={18} color={colors.grey(0.5)} />
                    <TextInput
                      style={styles.input}
                      placeholder="email@example.com"
                      placeholderTextColor={colors.grey(0.4)}
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {email.length > 0 && !errors.email && (
                      <CheckCircle size={16} color={colors.green()} />
                    )}
                  </View>
                  {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                  {!errors.email && email.length > 0 && <Text style={styles.success}>✓ Email valid</Text>}
                </View>

                {/* PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedField === 'password' && styles.inputContainerFocused,
                    errors.password ? styles.inputContainerError : (password.length > 0 && styles.inputContainerValid),
                  ]}>
                    <Lock size={18} color={colors.grey(0.5)} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Minimal 6 karakter"
                      placeholderTextColor={colors.grey(0.4)}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} hitSlop={10}>
                      {passwordVisible ? <EyeOff size={20} color={colors.grey(0.5)} /> : <Eye size={20} color={colors.grey(0.5)} />}
                    </TouchableOpacity>
                  </View>
                  
                  {/* Password Strength */}
                  {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={[styles.strengthBar, { width: passwordStrength.width, backgroundColor: passwordStrength.color }]} />
                      <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                        {passwordStrength.text}
                      </Text>
                    </View>
                  )}
                  {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Konfirmasi Password</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedField === 'confirm' && styles.inputContainerFocused,
                    errors.confirmPassword ? styles.inputContainerError : (confirmPassword.length > 0 && styles.inputContainerValid),
                  ]}>
                    <Lock size={18} color={colors.grey(0.5)} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Ulangi password"
                      placeholderTextColor={colors.grey(0.4)}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry={!confirmVisible}
                    />
                    <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)} hitSlop={10}>
                      {confirmVisible ? <EyeOff size={20} color={colors.grey(0.5)} /> : <Eye size={20} color={colors.grey(0.5)} />}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                  {confirmPassword.length > 0 && !errors.confirmPassword && password === confirmPassword && (
                    <Text style={styles.success}>✓ Password cocok</Text>
                  )}
                </View>

                {/* BUTTON */}
                <TouchableOpacity
                  style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={!isFormValid || loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.white()} size="small" />
                  ) : (
                    <Text style={styles.buttonText}>DAFTAR</Text>
                  )}
                </TouchableOpacity>

                {/* DIVIDER */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>atau</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* LOGIN LINK */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Sudah punya akun?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}> Login</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* FOOTER */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Dengan mendaftar, Anda menyetujui Syarat & Ketentuan
                </Text>
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ==================== CONTAINER ====================
  container: { flex: 1, backgroundColor: colors.white() },
  innerContainer: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // ==================== LOGO SECTION ====================
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.blue(), alignItems: 'center', justifyContent: 'center', shadowColor: colors.blue(), shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8, marginBottom: 12 },
  logoImage: { width: 50, height: 50, resizeMode: 'contain', tintColor: colors.white() },
  appName: { fontSize: 24, fontFamily: 'Pjs-Bold', color: colors.black() },
  tagline: { fontSize: 12, fontFamily: 'Pjs-Medium', color: colors.grey(0.5), marginTop: 4 },

  // ==================== FORM SECTION ====================
  formSection: { paddingHorizontal: 24 },
  title: { fontSize: 24, fontFamily: 'Pjs-Bold', color: colors.black(), textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, fontFamily: 'Pjs-Regular', color: colors.grey(0.6), textAlign: 'center', marginBottom: 28 },

  // ==================== INPUT GROUP ====================
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontFamily: 'Pjs-Medium', color: colors.grey(0.7), marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.grey(0.05), borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: 'transparent', gap: 10 },
  inputContainerFocused: { borderColor: colors.blue(), backgroundColor: colors.white(), shadowColor: colors.blue(), shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  inputContainerValid: { borderColor: colors.green() },
  inputContainerError: { borderColor: colors.red() },
  input: { flex: 1, fontSize: 14, fontFamily: 'Pjs-Regular', color: colors.black(), padding: 0 },

  // ==================== VALIDATION ====================
  error: { fontSize: 11, fontFamily: 'Pjs-Medium', color: colors.red(), marginTop: 4, marginLeft: 4 },
  success: { fontSize: 11, fontFamily: 'Pjs-Medium', color: colors.green(), marginTop: 4, marginLeft: 4 },

  // ==================== PASSWORD STRENGTH ====================
  strengthContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  strengthBar: { height: 4, borderRadius: 2, flex: 1 },
  strengthText: { fontSize: 11, fontFamily: 'Pjs-Medium', width: 45 },

  // ==================== BUTTON ====================
  button: { backgroundColor: colors.blue(), paddingVertical: 14, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: colors.blue(), shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  buttonDisabled: { backgroundColor: colors.blue(0.5), shadowOpacity: 0, elevation: 0 },
  buttonText: { fontSize: 15, fontFamily: 'Pjs-SemiBold', color: colors.white(), letterSpacing: 1 },

  // ==================== DIVIDER ====================
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: colors.grey(0.2) },
  dividerText: { fontSize: 12, fontFamily: 'Pjs-Medium', color: colors.grey(0.5), marginHorizontal: 12 },

  // ==================== LOGIN LINK ====================
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 13, fontFamily: 'Pjs-Regular', color: colors.grey(0.6) },
  loginLink: { fontSize: 13, fontFamily: 'Pjs-SemiBold', color: colors.blue() },

  // ==================== FOOTER ====================
  footer: { paddingHorizontal: 24, marginTop: 24, marginBottom: 20 },
  footerText: { fontSize: 11, fontFamily: 'Pjs-Regular', color: colors.grey(0.4), textAlign: 'center' },
});