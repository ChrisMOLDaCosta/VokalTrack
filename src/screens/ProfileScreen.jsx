import React, { useState, useCallback, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Edit2, LogOut, Plus, Mic, Clock, Award, Flame, ChevronRight, Calendar } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';
import ItemSmall from '../components/ItemSmall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../libs/supabase';

const { width } = Dimensions.get('window');

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const ProgressBar = ({ progress, color = colors.blue(), height = 8 }) => (
  <View style={[progressStyles.container, { height }]}>
    <View style={[progressStyles.fill, { width: `${Math.min(progress, 100)}%`, backgroundColor: color }]} />
  </View>
);

const progressStyles = StyleSheet.create({
  container: { width: '100%', backgroundColor: colors.grey(0.1), borderRadius: borderRadius.round, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: borderRadius.round },
});

const StatCard = ({ icon: Icon, label, value, color, onPress }) => (
  <TouchableOpacity style={statStyles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={[statStyles.iconContainer, { backgroundColor: color + '15' }]}>
      <Icon size={22} color={color} />
    </View>
    <Text style={statStyles.value}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </TouchableOpacity>
);

const statStyles = StyleSheet.create({
  card: { 
    flex: 1, 
    backgroundColor: colors.white(), 
    borderRadius: borderRadius.xl, 
    paddingVertical: spacing.lg, 
    alignItems: 'center', 
    shadowColor: colors.black(0.05), 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 12, 
    elevation: 4, 
    borderWidth: 1, 
    borderColor: colors.grey(0.05) 
  },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: borderRadius.round, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: spacing.sm 
  },
  value: { 
    fontSize: typography.h3.fontSize, 
    fontFamily: typography.h3.fontFamily, 
    color: colors.black() 
  },
  label: { 
    fontSize: typography.caption.fontSize, 
    fontFamily: typography.caption.fontFamily, 
    color: colors.grey(0.5), 
    marginTop: spacing.xs 
  },
});

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userLatihan, setUserLatihan] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Fetch user profile from Supabase Auth
  const fetchUserProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (user) {
        // ✅ AMBIL NAMA DARI USER_METADATA (bukan dari tabel users)
        const fullName = user.user_metadata?.full_name || 
                         user.user_metadata?.display_name || 
                         user.email?.split('@')[0] || 
                         'Vokalis';
        
        console.log('User metadata:', user.user_metadata);
        console.log('Full name:', fullName);
        
        setUserProfile({
          id: user.id,
          email: user.email,
          full_name: fullName,
          avatar_url: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
          created_at: user.created_at,
          total_latihan: 0,
          total_menit: 0,
          streak: 0,
          weekly_goal: 5,
          weekly_progress: 0,
          level_name: 'Bronze Vocalist',
          exp_current: 0,
          exp_required: 1000,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserProfile({
        id: '1',
        email: 'user@example.com',
        full_name: 'Vokalis',
        avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
        total_latihan: 0,
        total_menit: 0,
        streak: 0,
        weekly_goal: 5,
        weekly_progress: 0,
        level_name: 'Bronze Vocalist',
        exp_current: 0,
        exp_required: 1000,
      });
    }
  };

  const fetchUserLatihan = async () => {
    try {
      const { data, error } = await supabase
        .from('latihan')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUserLatihan(data || []);
    } catch (error) {
      console.error('Error fetching latihan:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchUserProfile(), fetchUserLatihan()]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar', style: 'destructive', onPress: async () => {
          await supabase.auth.signOut();
          await AsyncStorage.removeItem('@vokaltrack_user');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      },
    ]);
  };

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.94], extrapolate: 'clamp' });

  const expPercentage = userProfile 
    ? (userProfile.exp_current / userProfile.exp_required) * 100 
    : 0;
  const weeklyPercentage = userProfile 
    ? (userProfile.weekly_progress / userProfile.weekly_goal) * 100 
    : 0;

  if (loading || !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.headerButton}>
            <Settings color={colors.black()} size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
            <LogOut color={colors.red()} size={22} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue()]} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userProfile.avatar_url }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editPhotoButton} onPress={() => navigation.navigate('EditProfile')}>
              <Edit2 size={14} color={colors.white()} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{userProfile.full_name}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
          <View style={styles.memberContainer}>
            <Calendar size={14} color={colors.grey(0.5)} />
            <Text style={styles.memberSince}>
              Bergabung {new Date(userProfile.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsContainer}>
            <StatCard icon={Mic} label="Latihan" value={userLatihan.length} color={colors.blue()} />
            <StatCard icon={Clock} label="Total Menit" value={userProfile.total_menit} color={colors.green()} />
            <StatCard icon={Flame} label="Streak" value={userProfile.streak} color={colors.orange()} />
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Edit2 size={16} color={colors.white()} />
            <Text style={styles.editButtonText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Level Progress */}
        <View style={styles.levelContainer}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Award size={18} color={colors.orange()} />
              <Text style={styles.levelName}>{userProfile.level_name}</Text>
            </View>
            <Text style={styles.levelExp}>{userProfile.exp_current} / {userProfile.exp_required} EXP</Text>
          </View>
          <ProgressBar progress={expPercentage} color={colors.orange()} />
          <Text style={styles.levelProgressText}>{Math.round(expPercentage)}% menuju level berikutnya</Text>
        </View>

        {/* Weekly Goal */}
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>🎯 Target Mingguan</Text>
            <Text style={styles.goalSubtitle}>{userProfile.weekly_progress} / {userProfile.weekly_goal} latihan</Text>
          </View>
          <ProgressBar progress={weeklyPercentage} color={colors.green()} />
          <Text style={styles.goalFooter}>
            {userProfile.weekly_progress >= userProfile.weekly_goal 
              ? '✨ Selamat! Target mingguan tercapai! ✨' 
              : `💪 ${userProfile.weekly_goal - userProfile.weekly_progress} latihan lagi untuk mencapai target`}
          </Text>
        </View>

        {/* Social Stats */}
        <View style={styles.socialStats}>
          <View style={styles.socialStatItem}>
            <Text style={styles.socialStatValue}>0</Text>
            <Text style={styles.socialStatLabel}>Mengikuti</Text>
          </View>
          <View style={styles.socialStatDivider} />
          <View style={styles.socialStatItem}>
            <Text style={styles.socialStatValue}>0</Text>
            <Text style={styles.socialStatLabel}>Pengikut</Text>
          </View>
          <View style={styles.socialStatDivider} />
          <View style={styles.socialStatItem}>
            <Text style={styles.socialStatValue}>{userLatihan.length}</Text>
            <Text style={styles.socialStatLabel}>Total Latihan</Text>
          </View>
        </View>

        {/* Recent Exercises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Latihan Terbaru</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainApp', { screen: 'LatihanTab' })}>
              <Text style={styles.seeAllText}>Lihat semua →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.latihanList}>
            {userLatihan.length === 0 ? (
              <View style={styles.emptyLatihanContainer}>
                <Mic size={48} color={colors.grey(0.3)} />
                <Text style={styles.emptyLatihanText}>Belum ada latihan</Text>
                <TouchableOpacity style={styles.emptyLatihanButton} onPress={() => navigation.navigate('AddLatihan')}>
                  <Text style={styles.emptyLatihanButtonText}>+ Tambah Latihan</Text>
                </TouchableOpacity>
              </View>
            ) : (
              userLatihan.slice(0, 5).map((item, index) => <ItemSmall key={index} item={item} />)
            )}
          </View>
        </View>

        <View style={{ height: layout.bottomPadding }} />
      </Animated.ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('AddLatihan')} activeOpacity={0.8}>
        <Plus size={24} color={colors.white()} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  loadingText: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.grey(0.6) },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: spacing.xl, 
    paddingVertical: spacing.md, 
    backgroundColor: colors.white(),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey(0.08)
  },
  headerTitle: { fontSize: typography.h4.fontSize, fontFamily: typography.h4.fontFamily, color: colors.black() },
  headerRight: { flexDirection: 'row', gap: spacing.lg },
  headerButton: { padding: spacing.xs },
  scrollContent: { paddingBottom: spacing.md },
  profileHeader: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  profileImageContainer: { position: 'relative', marginBottom: spacing.md },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: colors.white(), shadowColor: colors.black(0.1), shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 4 },
  editPhotoButton: { position: 'absolute', bottom: 4, right: 4, backgroundColor: colors.blue(), width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white() },
  name: { fontSize: typography.h3.fontSize, fontFamily: typography.h3.fontFamily, color: colors.black(), marginTop: spacing.sm },
  email: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.grey(0.5), marginTop: 2 },
  memberContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  memberSince: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5) },
  statsContainer: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, width: '100%' },
  editButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: spacing.sm, 
    backgroundColor: colors.blue(), 
    paddingVertical: spacing.md, 
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    width: '100%'
  },
  editButtonText: { fontSize: typography.body3.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.white() },
  levelContainer: { 
    backgroundColor: colors.orange(0.06), 
    marginHorizontal: spacing.xl, 
    marginTop: spacing.lg, 
    padding: spacing.lg, 
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.orange(0.1)
  },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  levelName: { fontSize: typography.body2.fontSize, fontFamily: 'Pjs-Bold', color: colors.orange() },
  levelExp: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.6) },
  levelProgressText: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.sm, textAlign: 'center' },
  goalContainer: { 
    backgroundColor: colors.green(0.06), 
    marginHorizontal: spacing.xl, 
    marginTop: spacing.md, 
    padding: spacing.lg, 
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.green(0.1)
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  goalTitle: { fontSize: typography.body2.fontSize, fontFamily: 'Pjs-Bold', color: colors.black() },
  goalSubtitle: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.green() },
  goalFooter: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.sm, textAlign: 'center' },
  socialStats: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: colors.grey(0.04), 
    marginHorizontal: spacing.xl, 
    marginTop: spacing.lg, 
    paddingVertical: spacing.md, 
    paddingHorizontal: spacing.lg, 
    borderRadius: borderRadius.lg 
  },
  socialStatItem: { alignItems: 'center', flex: 1 },
  socialStatValue: { fontSize: typography.h4.fontSize, fontFamily: typography.h4.fontFamily, color: colors.black() },
  socialStatLabel: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.xs },
  socialStatDivider: { width: 1, height: 40, backgroundColor: colors.grey(0.2) },
  section: { marginTop: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.h5.fontSize, fontFamily: typography.h5.fontFamily, color: colors.black() },
  seeAllText: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.blue() },
  latihanList: { paddingHorizontal: spacing.xl, gap: spacing.md, marginTop: spacing.sm },
  emptyLatihanContainer: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.md },
  emptyLatihanText: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.grey(0.5) },
  emptyLatihanButton: { backgroundColor: colors.blue(), paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.round, marginTop: spacing.md },
  emptyLatihanButtonText: { fontSize: typography.body2.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.white() },
  floatingButton: { 
    position: 'absolute', 
    bottom: spacing.xl, 
    right: spacing.xl, 
    backgroundColor: colors.blue(), 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: colors.blue(), 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5 
  },
});