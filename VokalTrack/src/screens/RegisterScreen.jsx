import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim());
  }, [fullName, email, password, confirmPassword]);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi password tidak cocok');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Berhasil', 'Akun berhasil dibuat, silakan login');
      navigation.replace('Login');
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white() }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View>
              <Text style={styles.header}>Sign up</Text>
              <Text style={styles.caption}>Bergabunglah dengan VokalTrack</Text>
              <View style={styles.form}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="Nama lengkap" value={fullName} onChangeText={setFullName} />
                </View>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                  <TextInput style={{ flex: 1 }} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!passwordVisible} />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeOff size={20} color={colors.grey(0.6)} /> : <Eye size={20} color={colors.grey(0.6)} />}
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                  <TextInput style={{ flex: 1 }} placeholder="Konfirmasi password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!confirmVisible} />
                  <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)}>
                    {confirmVisible ? <EyeOff size={20} color={colors.grey(0.6)} /> : <Eye size={20} color={colors.grey(0.6)} />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ gap: 10 }}>
              <TouchableOpacity style={[styles.button, { backgroundColor: isDisabled ? colors.blue(0.5) : colors.blue() }]} onPress={handleRegister} disabled={isDisabled}>
                {loading ? <ActivityIndicator color={colors.white()} /> : <Text style={styles.buttonText}>DAFTAR</Text>}
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 5, alignSelf: 'center' }}>
                <Text style={styles.linkText}>Sudah punya akun?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.linkText, { color: colors.blue() }]}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 40 },
  header: { fontSize: 32, fontFamily: 'Pjs-ExtraBold', color: colors.black() },
  caption: { fontSize: 14, fontFamily: 'Pjs-Regular', color: colors.grey(0.6), marginTop: 5, marginBottom: 30 },
  form: { gap: 16 },
  label: { fontSize: 14, fontFamily: 'Pjs-Medium', color: colors.grey(0.6), marginBottom: 4 },
  inputContainer: { backgroundColor: colors.grey(0.05), height: 52, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 10 },
  input: { paddingVertical: 0, color: colors.black(), fontFamily: 'Pjs-Regular' },
  button: { borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: colors.white(), fontSize: 14, fontFamily: 'Pjs-SemiBold' },
  linkText: { fontSize: 14, fontFamily: 'Pjs-Medium', color: colors.black() },
});