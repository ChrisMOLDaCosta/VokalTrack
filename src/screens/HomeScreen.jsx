import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Animated,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, Mic, Flame, Calendar, TrendingUp, ChevronRight, 
  Award, Clock, Star, Menu, Zap, Music, Target 
} from 'lucide-react-native';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';
import { useFonts } from 'expo-font';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fontType } from '../../assets/theme';
import { supabase } from '../libs/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// ==================== PROGRESS BAR ====================
const ProgressBar = ({ progress, color = colors.blue(), height = 8 }) => (
  <View style={[progressStyles.container, { height }]}>
    <View style={[progressStyles.fill, { width: `${Math.min(progress, 100)}%`, backgroundColor: color }]} />
  </View>
);

const progressStyles = StyleSheet.create({
  container: { width: '100%', backgroundColor: colors.grey(0.1), borderRadius: borderRadius.round, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: borderRadius.round },
});

// ==================== STAT CARD ====================
const StatCard = ({ icon: Icon, label, value, color, onPress, subtitle }) => (
  <TouchableOpacity style={statStyles.card} onPress={onPress} activeOpacity={0.7}>
    <LinearGradient colors={[colors.white(), colors.grey(0.02)]} style={statStyles.gradient}>
      <View style={[statStyles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={22} color={color} />
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
      {subtitle && <Text style={statStyles.subtitle}>{subtitle}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

const statStyles = StyleSheet.create({
  card: { flex: 1, borderRadius: borderRadius.xl, overflow: 'hidden', shadowColor: colors.black(0.06), shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4 },
  gradient: { alignItems: 'center', paddingVertical: spacing.lg },
  iconContainer: { width: 48, height: 48, borderRadius: borderRadius.round, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  value: { fontSize: typography.h3.fontSize, fontFamily: typography.h3.fontFamily, color: colors.black(), marginTop: spacing.xs },
  label: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.xs },
  subtitle: { fontSize: 10, fontFamily: typography.caption.fontFamily, color: colors.grey(0.4), marginTop: 2 },
});

// ==================== STREAK CARD ====================
const StreakCard = ({ streak, totalLatihan, totalMenit }) => (
  <LinearGradient colors={[colors.orange(0.08), colors.orange(0.02)]} style={streakStyles.container}>
    <View style={streakStyles.header}>
      <View style={streakStyles.iconWrapper}>
        <Flame size={24} color={colors.orange()} fill={colors.orange()} />
      </View>
      <Text style={streakStyles.title}>🔥 Streak {streak} Hari!</Text>
      <ChevronRight size={18} color={colors.grey(0.4)} />
    </View>
    <View style={streakStyles.stats}>
      <View style={streakStyles.stat}>
        <Text style={streakStyles.statValue}>{totalLatihan}</Text>
        <Text style={streakStyles.statLabel}>Total Latihan</Text>
      </View>
      <View style={streakStyles.divider} />
      <View style={streakStyles.stat}>
        <Text style={streakStyles.statValue}>{totalMenit}</Text>
        <Text style={streakStyles.statLabel}>Total Menit</Text>
      </View>
    </View>
    <ProgressBar progress={Math.min((streak / 30) * 100, 100)} color={colors.orange()} />
    <Text style={streakStyles.footer}>{30 - streak} hari lagi menuju Legendary! ⭐</Text>
  </LinearGradient>
);

const streakStyles = StyleSheet.create({
  container: { borderRadius: borderRadius.xl, padding: spacing.lg, marginHorizontal: spacing.xl, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.orange(0.1) },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  iconWrapper: { width: 44, height: 44, borderRadius: borderRadius.round, backgroundColor: colors.orange(0.12), alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: typography.h5.fontSize, fontFamily: 'Pjs-Bold', color: colors.orange() },
  stats: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: typography.h2.fontSize, fontFamily: typography.h2.fontFamily, color: colors.black() },
  statLabel: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.xs },
  divider: { width: 1, height: 40, backgroundColor: colors.grey(0.2) },
  footer: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.sm, textAlign: 'center' },
});

// ==================== CAROUSEL ITEM ====================
const CarouselItem = ({ item, width: itemWidth }) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => navigation.navigate(item.navigateTo)}
      activeOpacity={0.9}
      style={{ width: itemWidth - 40, marginHorizontal: 20 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={carouselStyles.card}
        >
          <View style={carouselStyles.iconWrapper}>{item.icon}</View>
          <Text style={carouselStyles.title}>{item.title}</Text>
          <Text style={carouselStyles.description}>{item.description}</Text>
          <View style={carouselStyles.button}>
            <Text style={carouselStyles.buttonText}>{item.buttonText}</Text>
            <ChevronRight size={16} color={colors.white()} />
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const carouselStyles = StyleSheet.create({
  card: { borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', shadowColor: colors.black(0.15), shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 16, elevation: 8 },
  iconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.white(0.25), alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { fontSize: typography.h4.fontSize, fontFamily: typography.h4.fontFamily, color: colors.white(), textAlign: 'center', marginBottom: spacing.sm },
  description: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.white(0.9), textAlign: 'center', marginBottom: spacing.lg, lineHeight: 20 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white(0.25), paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.round, gap: spacing.sm },
  buttonText: { fontSize: typography.body3.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.white() },
});

// ==================== CAROUSEL DATA ====================
const carouselData = [
  { id: '1', title: '🎤 Mulai Latihan Vokal', description: 'Tingkatkan kemampuan vokalismu dengan latihan harian yang terstruktur', buttonText: 'Mulai Sekarang', icon: <Mic size={32} color={colors.white()} />, gradient: [colors.blue(), '#3B82F6'], navigateTo: 'LatihanTab' },
  { id: '2', title: '📊 Pantau Progressmu', description: 'Lihat statistik latihan dan capai target mingguanmu', buttonText: 'Lihat Profil', icon: <TrendingUp size={32} color={colors.white()} />, gradient: ['#10B981', '#059669'], navigateTo: 'ProfileTab' },
  { id: '3', title: '🏆 Tantangan Hari Ini', description: 'Selesaikan 2 latihan vokal dan dapatkan lencana eksklusif!', buttonText: 'Ikuti Tantangan', icon: <Award size={32} color={colors.white()} />, gradient: ['#F59E0B', '#D97706'], navigateTo: 'LatihanTab' },
  { id: '4', title: '💡 Tips Vokal Terbaru', description: 'Pelajari teknik vokal dari para ahli untuk meningkatkan performa', buttonText: 'Baca Tips', icon: <Music size={32} color={colors.white()} />, gradient: ['#8B5CF6', '#6D28D9'], navigateTo: 'TipsTab' },
  { id: '5', title: '🔥 Pertahankan Streak!', description: 'Jangan putus streak latihanmu. Latihan setiap hari!', buttonText: 'Mulai Latihan', icon: <Flame size={32} color={colors.white()} />, gradient: ['#EF4444', '#DC2626'], navigateTo: 'LatihanTab' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loaded] = useFonts(fontType);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latihanList, setLatihanList] = useState([]);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [userStats, setUserStats] = useState({
    streak: 0,
    totalLatihan: 0,
    totalMenit: 0,
    weeklyProgress: 0,
    weeklyGoal: 5,
  });
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  let autoScrollTimer = useRef(null);

  // Auto scroll carousel
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const startAutoScroll = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    autoScrollTimer.current = setInterval(() => {
      const nextIndex = (currentCarouselIndex + 1) % carouselData.length;
      setCurrentCarouselIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 6000);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) { clearInterval(autoScrollTimer.current); autoScrollTimer.current = null; }
  };

  const handleManualScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
    if (index !== currentCarouselIndex) {
      setCurrentCarouselIndex(index);
      stopAutoScroll();
      setTimeout(startAutoScroll, 10000);
    }
  };

  // ==================== LOAD NOTIFICATION COUNT ====================
  const loadNotificationCount = async () => {
    try {
      const count = await AsyncStorage.getItem('@vokaltrack_notification_count');
      setNotificationCount(count ? parseInt(count) : 0);
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  };

  // ==================== FETCH USER PROFILE ====================
  const fetchUserProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Vokalis';
        setUserName(name);
        setUserAvatar(user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUserName('Vokalis');
    }
  };

  // ==================== FETCH USER STATS ====================
  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserStats({ streak: 0, totalLatihan: 0, totalMenit: 0, weeklyProgress: 0, weeklyGoal: 5 });
        return;
      }
      const { data, error } = await supabase.from('users').select('streak, total_latihan, total_menit, weekly_progress, weekly_goal').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') console.error('Error fetching stats:', error);
      if (data) {
        setUserStats({
          streak: data.streak || 0,
          totalLatihan: data.total_latihan || 0,
          totalMenit: data.total_menit || 0,
          weeklyProgress: data.weekly_progress || 0,
          weeklyGoal: data.weekly_goal || 5,
        });
      } else {
        setUserStats({ streak: 0, totalLatihan: 0, totalMenit: 0, weeklyProgress: 0, weeklyGoal: 5 });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setUserStats({ streak: 0, totalLatihan: 0, totalMenit: 0, weeklyProgress: 0, weeklyGoal: 5 });
    }
  };

  // ==================== FETCH LATIHAN ====================
  const fetchLatihan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('latihan').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLatihanList(data || []);
    } catch (error) {
      console.error('Error fetching latihan:', error);
      setLatihanList([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOAD ALL DATA ====================
  const loadAllData = useCallback(async () => {
    await Promise.all([loadNotificationCount(), fetchUserProfile(), fetchUserStats(), fetchLatihan()]);
  }, []);

  useFocusEffect(useCallback(() => { loadAllData(); }, []));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, []);

  // ==================== HELPERS ====================
  const getRandomLatihan = () => {
    const shuffled = [...latihanList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 5);
  };

  const getLatihanTerbaru = () => [...latihanList].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);
  const rekomendasi = getRandomLatihan();
  const latihanTerbaru = getLatihanTerbaru();
  const weeklyProgressPercent = (userStats.weeklyProgress / userStats.weeklyGoal) * 100;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.94], extrapolate: 'clamp' });

  if (!loaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* ==================== HEADER ==================== */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('MainApp', { screen: 'ProfileTab' })}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.headerButton}>
            <Bell color={colors.black()} size={22} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.headerButton}>
            <Menu color={colors.black()} size={22} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ==================== WELCOME ==================== */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Siap latihan vokal hari ini? 🎤</Text>
      </View>

      {/* ==================== MAIN CONTENT ==================== */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue()]} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* CAROUSEL BANNER */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={carouselData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleManualScroll}
            renderItem={({ item }) => <CarouselItem item={item} width={width} />}
            keyExtractor={(item) => item.id}
            getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
          />
          <View style={styles.dotContainer}>
            {carouselData.map((_, index) => (
              <View key={index} style={[styles.dot, currentCarouselIndex === index && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* STREAK CARD */}
        <StreakCard streak={userStats.streak} totalLatihan={userStats.totalLatihan} totalMenit={userStats.totalMenit} />

        {/* QUICK STATS */}
        <View style={styles.statsContainer}>
          <StatCard icon={Calendar} label="Hari Aktif" value={userStats.streak} color={colors.green()} subtitle="hari berturut-turut" />
          <StatCard icon={Award} label="Prestasi" value="0" color={colors.yellow()} subtitle="belum ada lencana" />
          <StatCard icon={TrendingUp} label="Progress" value={`${Math.round(weeklyProgressPercent)}%`} color={colors.blue()} onPress={() => navigation.navigate('MainApp', { screen: 'ProfileTab' })} subtitle={`${userStats.weeklyProgress}/${userStats.weeklyGoal} mingguan`} />
        </View>

        {/* WEEKLY GOAL */}
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>🎯 Target Mingguan</Text>
            <Text style={styles.goalSubtitle}>{userStats.weeklyProgress} / {userStats.weeklyGoal} latihan</Text>
          </View>
          <ProgressBar progress={weeklyProgressPercent} color={colors.green()} />
          <Text style={styles.goalFooter}>
            {userStats.weeklyProgress >= userStats.weeklyGoal 
              ? '✨ Hebat! Target mingguan tercapai! ✨' 
              : `💪 Semangat! ${userStats.weeklyGoal - userStats.weeklyProgress} latihan lagi`}
          </Text>
        </View>

        {/* REKOMENDASI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎵 Rekomendasi untukmu</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainApp', { screen: 'LatihanTab' })}>
            <Text style={styles.seeAll}>Lihat semua →</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rekomendasiContainer}>
          {rekomendasi.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.rekomendasiCard, { marginLeft: index === 0 ? spacing.xl : 0, marginRight: index === rekomendasi.length - 1 ? spacing.xl : 0 }]} 
              onPress={() => navigation.navigate('LatihanDetail', { latihanId: item.id })} 
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.rekomendasiImage} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.rekomendasiGradient} />
              <View style={styles.rekomendasiOverlay}>
                <View style={styles.rekomendasiBadge}><Mic size={10} color={colors.white()} /><Text style={styles.rekomendasiCategory}>{item.category}</Text></View>
                <Text style={styles.rekomendasiTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.rekomendasiFooter}>
                  <Clock size={10} color={colors.white(0.9)} /><Text style={styles.rekomendasiDuration}>{item.duration} menit</Text>
                  <View style={styles.starContainer}><Star size={8} color={colors.yellow()} fill={colors.yellow()} /><Text style={styles.rekomendasiRating}>{item.rating || 4.5}</Text></View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LATIHAN TERBARU */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📋 Latihan Terbaru</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainApp', { screen: 'LatihanTab' })}>
            <Text style={styles.seeAll}>Lihat semua →</Text>
          </TouchableOpacity>
        </View>
        
        {latihanTerbaru.map((item) => (
          <TouchableOpacity key={item.id} style={styles.latestCard} onPress={() => navigation.navigate('LatihanDetail', { latihanId: item.id })} activeOpacity={0.7}>
            <Image source={{ uri: item.image }} style={styles.latestImage} />
            <View style={styles.latestContent}>
              <Text style={styles.latestCategory}>{item.category}</Text>
              <Text style={styles.latestTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.latestFooter}>
                <Clock size={10} color={colors.grey(0.5)} /><Text style={styles.latestDuration}>{item.duration} menit</Text>
                <Text style={styles.latestDot}>•</Text><Text style={styles.latestLevel}>{item.level}</Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.grey(0.3)} />
          </TouchableOpacity>
        ))}

        {/* MOTIVATIONAL BANNER */}
        {userStats.totalLatihan === 0 ? (
          <LinearGradient colors={[colors.blue(0.08), colors.white()]} style={styles.motivationCard}>
            <View style={styles.motivationIcon}><Zap size={24} color={colors.white()} /></View>
            <View style={styles.motivationContent}>
              <Text style={styles.motivationTitle}>Mulai Latihan Pertamamu!</Text>
              <Text style={styles.motivationText}>Pilih latihan di atas dan mulai perjalanan vokalismu sekarang! 🎤</Text>
            </View>
          </LinearGradient>
        ) : (
          <LinearGradient colors={[colors.orange(0.08), colors.white()]} style={styles.motivationCard}>
            <View style={styles.motivationIcon}><Target size={24} color={colors.white()} /></View>
            <View style={styles.motivationContent}>
              <Text style={styles.motivationTitle}>Pertahankan Semangatmu!</Text>
              <Text style={styles.motivationText}>Selesaikan 2 latihan vokal untuk mendapatkan lencana "Vocal Warrior"!</Text>
            </View>
          </LinearGradient>
        )}

        <View style={{ height: layout.bottomPadding }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white() },
  loadingText: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.grey(0.6) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm, backgroundColor: colors.white() },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.blue() },
  greeting: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5) },
  userName: { fontSize: typography.h4.fontSize, fontFamily: typography.h4.fontFamily, color: colors.black() },
  headerRight: { flexDirection: 'row', gap: spacing.lg },
  headerButton: { padding: spacing.xs, position: 'relative' },
  notificationBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: colors.red(), borderRadius: borderRadius.round, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  notificationBadgeText: { fontSize: 10, fontFamily: 'Pjs-Bold', color: colors.white() },
  welcomeContainer: { paddingHorizontal: spacing.xl, marginTop: spacing.sm, marginBottom: spacing.sm },
  welcomeText: { fontSize: typography.body1.fontSize, fontFamily: typography.body1.fontFamily, color: colors.grey(0.6) },
  scrollContent: { paddingBottom: spacing.md },
  carouselContainer: { marginVertical: spacing.md },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.grey(0.3) },
  dotActive: { width: 20, backgroundColor: colors.blue() },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xl, gap: spacing.md, marginTop: spacing.lg },
  goalContainer: { backgroundColor: colors.green(0.06), borderRadius: borderRadius.xl, padding: spacing.lg, marginHorizontal: spacing.xl, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.green(0.1) },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.h5.fontSize, fontFamily: typography.h5.fontFamily, color: colors.black() },
  goalSubtitle: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.green() },
  goalFooter: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.sm, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginTop: spacing.xl, marginBottom: spacing.md },
  seeAll: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.blue() },
  rekomendasiContainer: { gap: spacing.md },
  rekomendasiCard: { width: width * 0.68, height: 150, borderRadius: borderRadius.xl, overflow: 'hidden' },
  rekomendasiImage: { width: '100%', height: '100%' },
  rekomendasiGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },
  rekomendasiOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md },
  rekomendasiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blue(0.85), paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.round, alignSelf: 'flex-start', gap: 4, marginBottom: spacing.xs },
  rekomendasiCategory: { fontSize: typography.caption.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.white() },
  rekomendasiTitle: { fontSize: typography.body2.fontSize, fontFamily: 'Pjs-Bold', color: colors.white(), marginBottom: spacing.xs, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  rekomendasiFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rekomendasiDuration: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.white(0.9) },
  starContainer: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rekomendasiRating: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.yellow() },
  latestCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white(), marginHorizontal: spacing.xl, marginBottom: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, shadowColor: colors.black(0.05), shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2, borderWidth: 0.5, borderColor: colors.grey(0.08) },
  latestImage: { width: 64, height: 64, borderRadius: borderRadius.md },
  latestContent: { flex: 1, marginLeft: spacing.md, gap: spacing.xs },
  latestCategory: { fontSize: typography.caption.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.blue() },
  latestTitle: { fontSize: typography.body2.fontSize, fontFamily: 'Pjs-Bold', color: colors.black() },
  latestFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  latestDuration: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5) },
  latestDot: { fontSize: typography.caption.fontSize, color: colors.grey(0.3) },
  latestLevel: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5) },
  motivationCard: { flexDirection: 'row', marginHorizontal: spacing.xl, marginTop: spacing.lg, marginBottom: spacing.lg, borderRadius: borderRadius.xl, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.blue(0.1) },
  motivationIcon: { width: 44, height: 44, borderRadius: borderRadius.round, backgroundColor: colors.blue(), alignItems: 'center', justifyContent: 'center' },
  motivationContent: { flex: 1 },
  motivationTitle: { fontSize: typography.body2.fontSize, fontFamily: 'Pjs-Bold', color: colors.blue(), marginBottom: spacing.xs },
  motivationText: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.grey(0.7), lineHeight: 18 },
});