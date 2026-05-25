import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);

  useEffect(() => {
    setIsLoginDisabled(!email.trim() || !password.trim());
  }, [email, password]);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulasi login sukses, pindah ke MainApp
      navigation.replace('MainApp');
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white() }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View>
              <Text style={styles.header}>Log in</Text>
              <Text style={styles.caption}>Masuk ke akun VokalTrack Anda</Text>
              <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Anda"
                    placeholderTextColor={colors.grey(0.5)}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Password"
                    placeholderTextColor={colors.grey(0.5)}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeOff size={20} color={colors.grey(0.6)} /> : <Eye size={20} color={colors.grey(0.6)} />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: isLoginDisabled ? colors.blue(0.5) : colors.blue() }]}
                onPress={handleLogin}
                disabled={isLoginDisabled}
              >
                {loading ? <ActivityIndicator color={colors.white()} /> : <Text style={styles.buttonText}>LOGIN</Text>}
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 5, alignSelf: 'center' }}>
                <Text style={styles.linkText}>Belum punya akun?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={[styles.linkText, { color: colors.blue() }]}>Daftar</Text>
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
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 60 },
  header: { fontSize: 32, fontFamily: 'Pjs-ExtraBold', color: colors.black() },
  caption: { fontSize: 14, fontFamily: 'Pjs-Regular', color: colors.grey(0.6), marginTop: 5, marginBottom: 40 },
  form: { gap: 20 },
  label: { fontSize: 14, fontFamily: 'Pjs-Medium', color: colors.grey(0.6), marginBottom: 5 },
  inputContainer: { backgroundColor: colors.grey(0.05), height: 52, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 10 },
  input: { paddingVertical: 0, color: colors.black(), fontFamily: 'Pjs-Regular' },
  button: { borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: colors.white(), fontSize: 14, fontFamily: 'Pjs-SemiBold' },
  linkText: { fontSize: 14, fontFamily: 'Pjs-Medium', color: colors.black() },
});