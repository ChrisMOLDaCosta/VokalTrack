import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />
      <Text style={styles.logo}>VokalTrack</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Presented By</Text>
        <Text style={styles.infoBold}>Mobile Programming</Text>
        <Text style={styles.infoBold}>Laboratory</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white(), justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 48, fontFamily: 'Pjs-ExtraBold', color: colors.black() },
  infoContainer: { position: 'absolute', bottom: 24, alignItems: 'center' },
  info: { fontSize: 12, fontFamily: 'Pjs-Regular', color: colors.grey(0.6) },
  infoBold: { fontSize: 12, fontFamily: 'Pjs-SemiBold', color: colors.grey(0.6), textAlign: 'center' },
});