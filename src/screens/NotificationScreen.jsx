import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { 
  Bell, 
  Mic, 
  Award, 
  Flame, 
  Clock, 
  Trash2, 
  CheckCircle,
  Music,
  Heart,
  TrendingUp,
  ArrowLeft,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';
import { supabase } from '../libs/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vokaltrack_notifications';
const NOTIFICATION_COUNT_KEY = '@vokaltrack_notification_count';

// Generate notifications berdasarkan aktivitas user
const generateNotificationsFromData = (userStats, latihanList, user) => {
  const notifications = [];
  const now = new Date();
  const today = new Date(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // 1. Notifikasi Streak
  if (userStats.streak > 0) {
    notifications.push({
      id: `streak_${Date.now()}`,
      type: 'streak',
      title: 'Streak Bertambah! 🔥',
      message: `Hebat! Anda telah latihan ${userStats.streak} hari berturut-turut. Pertahankan ya!`,
      time: today,
      icon: 'Flame',
      isRead: false,
      action: 'profile',
    });
  }

  // 2. Notifikasi pencapaian total latihan
  if (userStats.totalLatihan >= 10 && userStats.totalLatihan < 20) {
    notifications.push({
      id: `achievement_10_${Date.now()}`,
      type: 'achievement',
      title: 'Pencapaian Baru! 🎉',
      message: `Selamat! Anda telah menyelesaikan ${userStats.totalLatihan} latihan vokal. Dapatkan lencana "Vocal Learner"!`,
      time: today,
      icon: 'Award',
      isRead: false,
      action: 'profile',
    });
  } else if (userStats.totalLatihan >= 20 && userStats.totalLatihan < 50) {
    notifications.push({
      id: `achievement_20_${Date.now()}`,
      type: 'achievement',
      title: 'Pencapaian Luar Biasa! 🎤',
      message: `Wow! ${userStats.totalLatihan} latihan telah Anda selesaikan. Anda layak mendapat lencana "Vocal Enthusiast"!`,
      time: today,
      icon: 'Award',
      isRead: false,
      action: 'profile',
    });
  } else if (userStats.totalLatihan >= 50) {
    notifications.push({
      id: `achievement_50_${Date.now()}`,
      type: 'achievement',
      title: 'Master Vokal! 👑',
      message: `Luar biasa! ${userStats.totalLatihan} latihan selesai. Anda benar-benar "Vocal Master"!`,
      time: today,
      icon: 'Award',
      isRead: false,
      action: 'profile',
    });
  }

  // 3. Notifikasi target mingguan
  if (userStats.weeklyProgress >= userStats.weeklyGoal && userStats.weeklyGoal > 0) {
    notifications.push({
      id: `weekly_goal_${Date.now()}`,
      type: 'achievement',
      title: 'Target Mingguan Tercapai! 🎯',
      message: `Selamat! Anda telah mencapai target mingguan ${userStats.weeklyGoal} latihan.`,
      time: today,
      icon: 'TrendingUp',
      isRead: false,
      action: 'profile',
    });
  } else if (userStats.weeklyProgress > 0 && userStats.weeklyProgress < userStats.weeklyGoal) {
    notifications.push({
      id: `weekly_progress_${Date.now()}`,
      type: 'progress',
      title: 'Progress Mingguan 📊',
      message: `Anda sudah menyelesaikan ${userStats.weeklyProgress}/${userStats.weeklyGoal} latihan minggu ini. Semangat!`,
      time: today,
      icon: 'TrendingUp',
      isRead: false,
      action: 'profile',
    });
  }

  // 4. Notifikasi latihan baru (terbaru dalam 3 hari)
  const recentLatihan = latihanList?.filter(item => {
    const itemDate = new Date(item.created_at);
    const diffDays = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }) || [];

  if (recentLatihan.length > 0) {
    recentLatihan.forEach((latihan, idx) => {
      if (idx < 3) {
        notifications.push({
          id: `new_latihan_${latihan.id}_${Date.now()}`,
          type: 'new',
          title: 'Latihan Baru Tersedia! 🎵',
          message: `"${latihan.title}" - Latihan vokal baru untuk meningkatkan kemampuan Anda.`,
          time: new Date(latihan.created_at),
          icon: 'Music',
          isRead: false,
          action: 'latihan_detail',
          latihanId: latihan.id,
        });
      }
    });
  }

  // 5. Notifikasi reminder (jika belum latihan hari ini)
  const lastActivity = userStats.last_activity;
  if (lastActivity) {
    const lastDate = new Date(lastActivity);
    const todayDate = new Date();
    if (lastDate.getDate() !== todayDate.getDate()) {
      notifications.push({
        id: `reminder_${Date.now()}`,
        type: 'reminder',
        title: 'Waktunya Latihan! ⏰',
        message: `${user?.user_metadata?.full_name || 'User'}, jangan lupa latihan vokal hari ini untuk menjaga konsistensi!`,
        time: today,
        icon: 'Bell',
        isRead: false,
        action: 'latihan',
      });
    }
  }

  // 6. Notifikasi motivasi (tips)
  const tipsNotifications = [
    { id: 'tip_1', title: 'Tips Vokal Hari Ini', message: 'Lakukan pemanasan 10 menit sebelum bernyanyi untuk hasil maksimal!', icon: 'Mic' },
    { id: 'tip_2', title: 'Tips Pernapasan', message: 'Latihan pernapasan diafragma membantu kontrol nada tinggi.', icon: 'Mic' },
    { id: 'tip_3', title: 'Tips Kesehatan Suara', message: 'Minum air hangat dan hindari kopi sebelum latihan vokal.', icon: 'Heart' },
  ];
  
  const randomTip = tipsNotifications[Math.floor(Math.random() * tipsNotifications.length)];
  notifications.push({
    id: `daily_tip_${Date.now()}`,
    type: 'tips',
    title: '💡 ' + randomTip.title,
    message: randomTip.message,
    time: today,
    icon: randomTip.icon === 'Mic' ? 'Mic' : 'Heart',
    isRead: false,
    action: 'tips',
  });

  // Urutkan berdasarkan waktu terbaru dan hilangkan duplikat berdasarkan id
  const uniqueNotifications = notifications.filter((notif, index, self) => 
    index === self.findIndex(n => n.id.split('_')[0] === notif.id.split('_')[0] && 
      n.id.split('_')[1] === notif.id.split('_')[1])
  );
  
  return uniqueNotifications.sort((a, b) => b.time - a.time);
};

const getIconComponent = (iconName, color) => {
  switch (iconName) {
    case 'Award': return <Award size={22} color={color} />;
    case 'Bell': return <Bell size={22} color={color} />;
    case 'Flame': return <Flame size={22} color={color} />;
    case 'Mic': return <Mic size={22} color={color} />;
    case 'Music': return <Music size={22} color={color} />;
    case 'Heart': return <Heart size={22} color={color} />;
    case 'TrendingUp': return <TrendingUp size={22} color={color} />;
    case 'Zap': return <Zap size={22} color={color} />;
    default: return <Bell size={22} color={color} />;
  }
};

const getIconColor = (type) => {
  switch (type) {
    case 'achievement': return colors.yellow();
    case 'reminder': return colors.blue();
    case 'streak': return colors.orange();
    case 'tips': return colors.green();
    case 'new': return colors.blue();
    case 'progress': return colors.blue();
    default: return colors.grey(0.6);
  }
};

const formatTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const NotificationCard = ({ item, onPress, onDelete }) => {
  const iconColor = getIconColor(item.type);
  const backgroundColor = item.isRead ? colors.white() : colors.blue(0.04);

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor }]} 
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        {getIconComponent(item.icon, iconColor)}
      </View>
      <View style={styles.content}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardTime}>{formatTime(item.time)}</Text>
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Trash2 size={16} color={colors.grey(0.4)} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update badge count di HomeScreen
  const updateBadgeCount = async (count) => {
    await AsyncStorage.setItem(NOTIFICATION_COUNT_KEY, count.toString());
  };

  // Load saved read status
  const loadReadStatus = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  };

  // Save read status
  const saveReadStatus = async (readIds) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
    const newUnreadCount = notifications.filter(n => !readIds.includes(n.id)).length;
    setUnreadCount(newUnreadCount);
    await updateBadgeCount(newUnreadCount);
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Ambil data user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        await updateBadgeCount(0);
        setLoading(false);
        return;
      }

      // Ambil statistik user
      const { data: userStats } = await supabase
        .from('users')
        .select('streak, total_latihan, total_menit, weekly_progress, weekly_goal, last_activity')
        .eq('id', user.id)
        .single();

      // Ambil latihan terbaru
      const { data: latihanList } = await supabase
        .from('latihan')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Generate notifications
      const stats = userStats || {
        streak: 0,
        totalLatihan: 0,
        totalMenit: 0,
        weeklyProgress: 0,
        weeklyGoal: 5,
      };
      
      const newNotifications = generateNotificationsFromData(stats, latihanList || [], user);
      
      // Load saved read status
      const readIds = await loadReadStatus();
      
      const notificationsWithReadStatus = newNotifications.map(notif => ({
        ...notif,
        isRead: readIds.includes(notif.id),
      }));
      
      setNotifications(notificationsWithReadStatus);
      
      // Hitung unread count
      const unread = notificationsWithReadStatus.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      await updateBadgeCount(unread);
      
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, []);

  const handleNotificationPress = async (item) => {
    // Tandai sebagai sudah dibaca jika belum
    if (!item.isRead) {
      const updated = notifications.map(n => 
        n.id === item.id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      const readIds = updated.filter(n => n.isRead).map(n => n.id);
      await saveReadStatus(readIds);
    }
    
    // Navigasi berdasarkan aksi
    switch (item.action) {
      case 'profile':
        navigation.navigate('MainApp', { screen: 'ProfileTab' });
        break;
      case 'latihan':
        navigation.navigate('MainApp', { screen: 'LatihanTab' });
        break;
      case 'tips':
        navigation.navigate('MainApp', { screen: 'TipsTab' });
        break;
      case 'latihan_detail':
        if (item.latihanId) {
          navigation.navigate('LatihanDetail', { latihanId: item.latihanId });
        } else {
          navigation.navigate('MainApp', { screen: 'LatihanTab' });
        }
        break;
      default:
        break;
    }
  };

  const handleDelete = async (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    const readIds = updated.filter(n => n.isRead).map(n => n.id);
    await saveReadStatus(readIds);
  };

  const handleMarkAllRead = async () => {
    if (notifications.length === 0) return;
    
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    const allIds = updated.map(n => n.id);
    await saveReadStatus(allIds);
    
    Alert.alert('Berhasil', 'Semua notifikasi telah ditandai sebagai dibaca');
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    
    Alert.alert(
      'Hapus Semua',
      'Yakin ingin menghapus semua notifikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            setNotifications([]);
            await saveReadStatus([]);
            Alert.alert('Berhasil', 'Semua notifikasi telah dihapus');
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue()} />
          <Text style={styles.loadingText}>Memuat notifikasi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={colors.black()} size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Notifikasi</Text>
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          {notifications.length > 0 && (
            <>
              <TouchableOpacity onPress={handleMarkAllRead} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>Baca semua</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearAll} style={styles.headerButton}>
                <Trash2 size={18} color={colors.red()} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Notifikasi List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Bell size={56} color={colors.grey(0.3)} />
          </View>
          <Text style={styles.emptyTitle}>Tidak Ada Notifikasi</Text>
          <Text style={styles.emptySubtitle}>
            Anda akan mendapat notifikasi saat:
          </Text>
          <View style={styles.emptyList}>
            <Text style={styles.emptyListItem}>✓ Streak latihan bertambah</Text>
            <Text style={styles.emptyListItem}>✓ Mencapai target mingguan</Text>
            <Text style={styles.emptyListItem}>✓ Ada latihan baru tersedia</Text>
            <Text style={styles.emptyListItem}>✓ Mendapat tips vokal</Text>
            <Text style={styles.emptyListItem}>✓ Perlu pengingat latihan</Text>
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue()]} />
          }
        >
          {notifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onPress={handleNotificationPress}
              onDelete={handleDelete}
            />
          ))}
          <View style={{ height: layout.bottomPadding }} />
        </ScrollView>
      )}
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
  },
  loadingText: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    color: colors.grey(0.6),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey(0.1),
    backgroundColor: colors.white(),
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontFamily: typography.h4.fontFamily,
    color: colors.black(),
  },
  badgeContainer: {
    backgroundColor: colors.red(),
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Pjs-Bold',
    color: colors.white(),
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  headerButtonText: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.blue(),
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white(),
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    shadowColor: colors.black(0.05),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: colors.grey(0.08),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: typography.body2.fontSize,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black(),
  },
  cardTime: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.grey(0.5),
  },
  cardMessage: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.6),
    lineHeight: 18,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    gap: spacing.lg,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.grey(0.05),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.h4.fontSize,
    fontFamily: typography.h4.fontFamily,
    color: colors.black(),
  },
  emptySubtitle: {
    fontSize: typography.body2.fontSize,
    fontFamily: typography.body2.fontFamily,
    color: colors.grey(0.5),
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  emptyList: {
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  emptyListItem: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.5),
    textAlign: 'left',
  },
});