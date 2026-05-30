// src/screens/SplashScreen.jsx - UPGRADED VERSION
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';
import { Mic } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const footerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
      ]),
      Animated.timing(textFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(footerFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} translucent />
      
      {/* Background decoration */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />
      
      {/* Main Content */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Mic size={56} color={colors.white()} />
        </View>
        <Text style={styles.logo}>VokalTrack</Text>
      </Animated.View>
      
      <Animated.Text style={[styles.tagline, { opacity: textFadeAnim }]}>
        Latihan Vokal Profesional
      </Animated.Text>
      
      {/* Loading dots animation */}
      <Animated.View style={[styles.loadingContainer, { opacity: textFadeAnim }]}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotDelay]} />
        <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
      </Animated.View>
      
      {/* Footer */}
      <Animated.View style={[styles.infoContainer, { opacity: footerFadeAnim }]}>
        <Text style={styles.info}>By</Text>
        <Text style={styles.infoBold}>Faldo Da Costa</Text>
        <View style={styles.versionContainer}>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: colors.blue(0.03),
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: colors.blue(0.05),
    bottom: height * 0.2,
    left: -width * 0.15,
  },
  bgCircle3: {
    position: 'absolute',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: colors.blue(0.04),
    bottom: height * 0.4,
    right: -width * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.blue(),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.blue(),
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    fontSize: typography.h1.fontSize,
    fontFamily: typography.h1.fontFamily,
    color: colors.black(),
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    color: colors.grey(0.5),
    marginTop: spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    gap: spacing.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue(),
    opacity: 0.6,
  },
  loadingDotDelay: {
    opacity: 0.3,
  },
  loadingDotDelay2: {
    opacity: 0.15,
  },
  infoContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    alignItems: 'center',
  },
  info: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.5),
  },
  infoBold: {
    fontSize: typography.body3.fontSize,
    fontFamily: 'Pjs-SemiBold',
    color: colors.grey(0.6),
    textAlign: 'center',
  },
  versionContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.grey(0.08),
    borderRadius: borderRadius.round,
  },
  version: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.grey(0.5),
  },
});