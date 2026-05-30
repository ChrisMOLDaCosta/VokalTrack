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
    Image,
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react-native';
  import { useNavigation } from '@react-navigation/native';
  import { colors, spacing, borderRadius, typography } from '../../assets/theme';
  import { supabase } from '../libs/supabase';

  export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({ email: '', password: '' });
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

    // Real-time validation
    useEffect(() => {
      validateForm();
    }, [email, password]);

    const validateForm = () => {
      let newErrors = { email: '', password: '' };
      let isValid = true;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
        newErrors.password = 'Password minimal 6 karakter';
        isValid = false;
      }

      setErrors(newErrors);
      setIsFormValid(isValid);
    };

    const handleLogin = async () => {
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

      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        
        if (error) throw error;
        
        navigation.replace('MainApp');
      } catch (error) {
        let errorMessage = 'Gagal login. Periksa email dan password Anda.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah. Silakan coba lagi.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum dikonfirmasi. Silakan cek email Anda.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        Alert.alert('Login Gagal', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const handleForgotPassword = () => {
      if (!email.trim()) {
        Alert.alert('Info', 'Masukkan email Anda terlebih dahulu');
        return;
      }
      
      Alert.alert(
        'Reset Password',
        `Link reset password akan dikirim ke ${email}`,
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Kirim', 
            onPress: async () => {
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
                if (error) throw error;
                Alert.alert('Berhasil', 'Link reset password telah dikirim ke email Anda');
              } catch (error) {
                Alert.alert('Error', error.message);
              }
            }
          }
        ]
      );
    };

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
              
              {/* Logo Section */}
              <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
                <View style={styles.logoCircle}>
                  <Image source={require('../../assets/icon.png')} style={styles.logoImage} />
                </View>
                <Text style={styles.logoText}>VokalTrack</Text>
                <Text style={styles.tagline}>Latihan Vokal Profesional</Text>
              </Animated.View>

              {/* Form Section */}
              <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                <View style={styles.formContainer}>
                  <Text style={styles.welcomeText}>Selamat Datang Kembali!</Text>
                  <Text style={styles.subtitle}>Masuk untuk melanjutkan latihan vokalmu</Text>

                  {/* Email Field */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedField === 'email' && styles.inputWrapperFocused,
                      errors.email ? styles.inputWrapperError : (email.length > 0 && styles.inputWrapperValid),
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
                        autoCorrect={false}
                      />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  {/* Password Field */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedField === 'password' && styles.inputWrapperFocused,
                      errors.password ? styles.inputWrapperError : (password.length > 0 && styles.inputWrapperValid),
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
                      <TouchableOpacity onPress={togglePasswordVisibility} hitSlop={10}>
                        {passwordVisible ? (
                          <EyeOff size={20} color={colors.grey(0.5)} />
                        ) : (
                          <Eye size={20} color={colors.grey(0.5)} />
                        )}
                      </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      (!isFormValid || loading) && styles.loginButtonDisabled,
                    ]}
                    onPress={handleLogin}
                    disabled={!isFormValid || loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color={colors.white()} size="small" />
                    ) : (
                      <>
                        <LogIn size={18} color={colors.white()} />
                        <Text style={styles.loginButtonText}>MASUK</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>atau</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Register Link */}
                  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Belum punya akun?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                      <Text style={styles.registerLink}> Daftar Sekarang</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Dengan masuk, Anda menyetujui{' '}
                  <Text style={styles.footerLink}>Syarat & Ketentuan</Text> dan{' '}
                  <Text style={styles.footerLink}>Kebijakan Privasi</Text>
                </Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white(),
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: spacing.xxxl,
      marginBottom: spacing.xl,
    },
    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.blue(),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.blue(),
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: spacing.md,
    },
    logoImage: {
      width: 50,
      height: 50,
      tintColor: colors.white(),
    },
    logoText: {
      fontSize: typography.h3.fontSize,
      fontFamily: typography.h3.fontFamily,
      color: colors.black(),
    },
    tagline: {
      fontSize: typography.body3.fontSize,
      fontFamily: typography.body3.fontFamily,
      color: colors.grey(0.5),
      marginTop: spacing.xs,
    },
    formContainer: {
      paddingHorizontal: spacing.xl,
    },
    welcomeText: {
      fontSize: typography.h2.fontSize,
      fontFamily: typography.h2.fontFamily,
      color: colors.black(),
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.body2.fontSize,
      fontFamily: typography.body2.fontFamily,
      color: colors.grey(0.6),
      marginBottom: spacing.xxxl,
    },
    fieldWrapper: {
      marginBottom: spacing.xl,
    },
    label: {
      fontSize: typography.body2.fontSize,
      fontFamily: typography.body2.fontFamily,
      color: colors.grey(0.7),
      marginBottom: spacing.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.grey(0.05),
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderWidth: 1,
      borderColor: 'transparent',
      gap: spacing.sm,
    },
    inputWrapperFocused: {
      borderColor: colors.blue(),
      backgroundColor: colors.white(),
      shadowColor: colors.blue(),
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    inputWrapperValid: {
      borderColor: colors.green(),
    },
    inputWrapperError: {
      borderColor: colors.red(),
    },
    input: {
      flex: 1,
      fontSize: typography.body2.fontSize,
      fontFamily: typography.body2.fontFamily,
      color: colors.black(),
      padding: 0,
    },
    errorText: {
      fontSize: typography.caption.fontSize,
      fontFamily: typography.caption.fontFamily,
      color: colors.red(),
      marginTop: spacing.xs,
      marginLeft: spacing.xs,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.lg,
    },
    forgotPasswordText: {
      fontSize: typography.body3.fontSize,
      fontFamily: typography.body3.fontFamily,
      color: colors.blue(),
    },
    loginButton: {
      flexDirection: 'row',
      backgroundColor: colors.blue(),
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      shadowColor: colors.blue(),
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    loginButtonDisabled: {
      backgroundColor: colors.blue(0.5),
      shadowOpacity: 0,
      elevation: 0,
    },
    loginButtonText: {
      fontSize: typography.button.fontSize,
      fontFamily: typography.button.fontFamily,
      color: colors.white(),
      letterSpacing: 1,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 0.5,
      backgroundColor: colors.grey(0.2),
    },
    dividerText: {
      fontSize: typography.body3.fontSize,
      fontFamily: typography.body3.fontFamily,
      color: colors.grey(0.5),
      marginHorizontal: spacing.md,
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    registerText: {
      fontSize: typography.body2.fontSize,
      fontFamily: typography.body2.fontFamily,
      color: colors.grey(0.6),
    },
    registerLink: {
      fontSize: typography.body2.fontSize,
      fontFamily: 'Pjs-SemiBold',
      color: colors.blue(),
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    footerText: {
      fontSize: typography.caption.fontSize,
      fontFamily: typography.caption.fontFamily,
      color: colors.grey(0.4),
      textAlign: 'center',
      lineHeight: 16,
    },
    footerLink: {
      color: colors.blue(),
    },
  });