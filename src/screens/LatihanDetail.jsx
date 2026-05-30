import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert,
  Share,
  Modal,
  Dimensions,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  Heart,
  Bookmark,
  Share2,
  Edit,
  Trash2,
  Mic,
  BarChart3,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  Send,
  MoreVertical,
  X,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../libs/supabase';
import { ProfileData } from '../data/profiledata';
import { saveNotification } from '../utils/notificationHelper'; // ✅ TAMBAHKAN INI

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 0;

// Format angka
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
};

// Warna level
const getLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'pemula': return colors.green();
    case 'menengah': return colors.yellow();
    case 'mahir': return colors.orange();
    default: return colors.blue();
  }
};

const getLevelBgColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'pemula': return colors.green(0.1);
    case 'menengah': return colors.yellow(0.1);
    case 'mahir': return colors.orange(0.1);
    default: return colors.blue(0.1);
  }
};

// Komponen Comment Item
const CommentItem = ({ comment, onEdit, onDelete, onLike, currentUserId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = comment.user_id === currentUserId;
  
  return (
    <View style={commentStyles.container}>
      <Image source={{ uri: comment.avatar || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' }} style={commentStyles.avatar} />
      <View style={commentStyles.content}>
        <View style={commentStyles.header}>
          <Text style={commentStyles.name}>{comment.user_name || 'Pengguna'}</Text>
          <Text style={commentStyles.time}>{comment.created_at}</Text>
        </View>
        <Text style={commentStyles.text}>{comment.content}</Text>
        <View style={commentStyles.actions}>
          <TouchableOpacity onPress={() => onLike(comment.id)} style={commentStyles.actionButton}>
            <Heart size={14} color={comment.isLiked ? colors.red() : colors.grey(0.5)} fill={comment.isLiked ? colors.red() : 'none'} />
            <Text style={commentStyles.actionText}>{formatNumber(comment.likes || 0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(comment)} style={commentStyles.actionButton}>
            <Text style={commentStyles.actionText}>Balas</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isOwner && (
        <TouchableOpacity onPress={() => setShowMenu(true)} style={commentStyles.menuButton}>
          <MoreVertical size={16} color={colors.grey(0.5)} />
        </TouchableOpacity>
      )}
      
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={commentStyles.modalOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={commentStyles.modalContent}>
            <TouchableOpacity style={commentStyles.menuItem} onPress={() => { setShowMenu(false); onEdit(comment); }}>
              <Edit size={18} color={colors.black()} />
              <Text style={commentStyles.menuText}>Edit</Text>
            </TouchableOpacity>
            <View style={commentStyles.menuDivider} />
            <TouchableOpacity style={commentStyles.menuItem} onPress={() => { setShowMenu(false); onDelete(comment.id); }}>
              <Trash2 size={18} color={colors.red()} />
              <Text style={[commentStyles.menuText, { color: colors.red() }]}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const commentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white(),
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black(0.03),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: colors.grey(0.06),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  name: {
    fontSize: typography.body3.fontSize,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black(),
  },
  time: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.grey(0.5),
  },
  text: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.7),
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.grey(0.5),
  },
  menuButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white(),
    marginTop: 80,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    width: 140,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuText: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.black(),
  },
  menuDivider: {
    height: 0.5,
    backgroundColor: colors.grey(0.1),
  },
});

export default function LatihanDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { latihanId } = route.params;
  
  // State untuk latihan
  const [latihan, setLatihan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  
  // State untuk timer
  const [timerModal, setTimerModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  
  // State untuk komentar
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const startScale = useRef(new Animated.Value(1)).current;
  const likeScale = useRef(new Animated.Value(1)).current;
  let timerInterval = useRef(null);

  // ==================== FETCH DATA ====================
  const fetchLatihanDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('latihan')
        .select('*')
        .eq('id', latihanId)
        .single();
      
      if (error) throw error;
      setLatihan(data);
      setLikesCount(data?.total_likes || 0);
    } catch (error) {
      console.error('Error fetching detail:', error);
      Alert.alert('Error', 'Gagal memuat detail latihan');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('latihan_id', Number(latihanId))
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format tanggal untuk tampilan
      const formattedData = data?.map(comment => ({
        ...comment,
        created_at: new Date(comment.created_at).toLocaleString('id-ID')
      })) || [];
      
      setComments(formattedData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchLatihanDetail();
    checkBookmarkStatus();
    fetchComments();
  }, [latihanId]);

  // ✅ TIMER EFFECT DENGAN NOTIFIKASI (HANYA TAMBAHAN INI)
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerInterval.current = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      clearInterval(timerInterval.current);
      
      // ✅ KIRIM NOTIFIKASI SAAT LATIHAN SELESAI
      const notification = {
        id: `latihan_selesai_${Date.now()}`,
        type: 'achievement',
        title: 'Latihan Selesai! 🎉',
        message: `Selamat! Anda telah menyelesaikan latihan "${latihan?.title}"`,
        time: new Date(),
        icon: 'Award',
        isRead: false,
        action: 'profile',
      };
      saveNotification(notification);
      
      Alert.alert('Waktu Habis!', 'Latihan selesai. Bagus sekali! 🎉');
    }
    return () => clearInterval(timerInterval.current);
  }, [timerRunning, timerSeconds, latihan?.title]); // ✅ tambah dependensi latihan?.title

  // ==================== BOOKMARK ====================
  const checkBookmarkStatus = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('@vokaltrack_bookmarks');
      if (bookmarks) {
        const bookmarkIds = JSON.parse(bookmarks);
        setIsBookmarked(bookmarkIds.includes(latihanId));
      }
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const animateBookmark = () => {
    Animated.sequence([
      Animated.spring(bookmarkScale, { toValue: 1.3, friction: 3, tension: 40, useNativeDriver: true }),
      Animated.spring(bookmarkScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
    ]).start();
    toggleBookmark();
  };

  const toggleBookmark = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('@vokaltrack_bookmarks');
      let bookmarkIds = bookmarks ? JSON.parse(bookmarks) : [];
      
      if (isBookmarked) {
        bookmarkIds = bookmarkIds.filter(id => id !== latihanId);
        Alert.alert('Dihapus', 'Latihan dihapus dari bookmark');
      } else {
        bookmarkIds.push(latihanId);
        Alert.alert('Tersimpan', 'Latihan disimpan ke bookmark');
      }
      
      await AsyncStorage.setItem('@vokaltrack_bookmarks', JSON.stringify(bookmarkIds));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan bookmark');
    }
  };

  // ==================== LIKE ====================
  const animateLike = () => {
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.4, friction: 3, tension: 40, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
    ]).start();
    toggleLike();
  };

  const toggleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // ==================== KOMENTAR ====================
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Info', 'Tulis komentar terlebih dahulu');
      return;
    }
    
    try {
      const newComment = {
        latihan_id: Number(latihanId),
        content: commentText.trim(),
        user_id: ProfileData.id || 'user_' + Date.now(),
        user_name: ProfileData.fullName || 'Pengguna VokalTrack',
        avatar: ProfileData.profilePict || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
        likes: 0,
        // ✅ JANGAN kirim created_at, biarkan Supabase yang mengisi dengan NOW()
      };
      
      console.log('Mengirim komentar:', newComment);
      
      const { data, error } = await supabase
        .from('comments')
        .insert([newComment])
        .select();
        
      if (error) {
        console.error('Supabase error:', error);
        Alert.alert('Error', error.message);
        return;
      }
      
      console.log('Berhasil:', data);
      
      if (data && data.length > 0) {
        const newCommentWithDate = {
          ...data[0],
          created_at: new Date(data[0].created_at).toLocaleString('id-ID')
        };
        setComments([newCommentWithDate, ...comments]);
        setCommentText('');
        Alert.alert('Berhasil', 'Komentar ditambahkan');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Gagal menambahkan komentar');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!commentText.trim() || !editingComment) return;
    
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: commentText.trim() })
        .eq('id', editingComment.id);
        
      if (error) throw error;
      
      setComments(comments.map(c => 
        c.id === editingComment.id ? { ...c, content: commentText.trim() } : c
      ));
      setCommentText('');
      setEditingComment(null);
      Alert.alert('Berhasil', 'Komentar diperbarui');
    } catch (error) {
      console.error('Error updating comment:', error);
      Alert.alert('Error', 'Gagal mengupdate komentar');
    }
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert('Hapus Komentar', 'Yakin ingin menghapus komentar ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('comments')
              .delete()
              .eq('id', commentId);
            if (error) throw error;
            setComments(comments.filter(c => c.id !== commentId));
            Alert.alert('Berhasil', 'Komentar dihapus');
          } catch (error) {
            console.error('Error deleting comment:', error);
            Alert.alert('Error', 'Gagal menghapus komentar');
          }
        },
      },
    ]);
  };

  const handleLikeComment = async (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    const newLikes = (comment.likes || 0) + 1;
    
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: newLikes, isLiked: !c.isLiked } : c
    ));
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setCommentText('');
  };

  // ==================== LAINNYA ====================
  const handleDelete = () => {
    Alert.alert('Hapus Latihan', 'Yakin ingin menghapus latihan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            const { error } = await supabase
              .from('latihan')
              .delete()
              .eq('id', latihanId);
            if (error) throw error;
            Alert.alert('Berhasil', 'Latihan telah dihapus');
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainApp', params: { screen: 'LatihanTab' } }],
            });
          } catch (error) {
            Alert.alert('Error', 'Gagal menghapus latihan');
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎤 VokalTrack - ${latihan?.title}\n\nLatihan vokal untuk meningkatkan kemampuan bernyanyi!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal membagikan latihan');
    }
  };

  const startTimer = () => {
    const minutes = latihan?.duration || 15;
    setTimerSeconds(minutes * 60);
    setTimerModal(true);
  };

  const startCountdown = () => setTimerRunning(true);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const animateStart = () => {
    Animated.sequence([
      Animated.timing(startScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(startScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    startTimer();
  };

  // Animations header
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.95, 0.9],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
        <Text style={styles.loadingText}>Memuat detail latihan...</Text>
      </View>
    );
  }

  if (!latihan) return null;

  const levelColor = getLevelColor(latihan.level);
  const levelBgColor = getLevelBgColor(latihan.level);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity, paddingTop: STATUSBAR_HEIGHT + spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={20} style={styles.backButton}>
          <ArrowLeft color={colors.black()} size={24} />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, { opacity: headerOpacity }]} numberOfLines={1}>
          {latihan.title}
        </Animated.Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleShare} hitSlop={15} style={styles.headerIcon}>
            <Share2 color={colors.black()} size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(true)} hitSlop={15} style={styles.headerIcon}>
            <Edit color={colors.black()} size={22} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Menu Modal */}
      <Modal animationType="fade" transparent visible={showMenu} onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); navigation.navigate('EditLatihan', { latihanId: latihan.id }); }}>
              <Edit size={20} color={colors.black()} />
              <Text style={styles.menuText}>Edit Latihan</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); handleDelete(); }}>
              <Trash2 size={20} color={colors.red()} />
              <Text style={[styles.menuText, { color: colors.red() }]}>Hapus Latihan</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Timer Modal */}
      <Modal animationType="slide" transparent visible={timerModal} onRequestClose={() => setTimerModal(false)}>
        <View style={styles.timerModalOverlay}>
          <View style={styles.timerModalContent}>
            <View style={styles.timerHeader}>
              <Text style={styles.timerTitle}>Timer Latihan</Text>
              <TouchableOpacity onPress={() => { setTimerModal(false); setTimerRunning(false); clearInterval(timerInterval.current); }}>
                <X size={24} color={colors.black()} />
              </TouchableOpacity>
            </View>
            <View style={styles.timerDisplay}>
              <Text style={styles.timerTime}>{formatTime(timerSeconds)}</Text>
              <Text style={styles.timerLabel}>Durasi {latihan.duration} menit</Text>
            </View>
            {!timerRunning && timerSeconds > 0 && (
              <TouchableOpacity style={styles.timerStartButton} onPress={startCountdown}>
                <Play size={20} color={colors.white()} />
                <Text style={styles.timerStartText}>Mulai Timer</Text>
              </TouchableOpacity>
            )}
            {timerRunning && <Text style={styles.timerRunningText}>🔥 Latihan sedang berlangsung!</Text>}
            {timerSeconds === 0 && !timerRunning && (
              <View style={styles.timerComplete}>
                <CheckCircle size={40} color={colors.green()} />
                <Text style={styles.timerCompleteText}>Latihan Selesai!</Text>
                <Text style={styles.timerCompleteSub}>Bagus sekali! Tetap konsisten ya!</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={[styles.scrollContent, { paddingTop: STATUSBAR_HEIGHT + 70 }]}
      >
        {/* Image */}
        <Image source={{ uri: latihan.image }} style={styles.image} contentFit="cover" transition={500} />
        
        {/* Level Badge */}
        <View style={[styles.levelBadge, { backgroundColor: levelBgColor }]}>
          <BarChart3 size={14} color={levelColor} />
          <Text style={[styles.levelText, { color: levelColor }]}>Level {latihan.level || 'Pemula'}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{latihan.title}</Text>
        
        {/* Meta Info */}
        <View style={styles.metaContainer}>
          <View style={styles.categoryBadge}>
            <Mic size={12} color={colors.blue()} />
            <Text style={styles.category}>{latihan.category}</Text>
          </View>
          <Text style={styles.date}>{new Date(latihan.created_at).toLocaleDateString('id-ID')}</Text>
        </View>

        {/* Stats Row - Sejajar */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconBg}><Clock size={14} color={colors.blue()} /></View>
            <Text style={styles.statText}>{latihan.duration} menit</Text>
          </View>
          
          <TouchableOpacity style={styles.statItem} onPress={() => {}} activeOpacity={0.7}>
            <View style={styles.statIconBg}><MessageCircle size={14} color={colors.blue()} /></View>
            <Text style={styles.statText}>{formatNumber(comments.length)} komentar</Text>
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <TouchableOpacity style={styles.statItem} onPress={animateLike} activeOpacity={0.7}>
              <Heart size={16} color={isLiked ? colors.red() : colors.grey(0.6)} fill={isLiked ? colors.red() : 'none'} />
              <Text style={styles.statText}>{formatNumber(likesCount)}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.divider} />
        
        {/* Description */}
        <Text style={styles.sectionTitle}>📝 Deskripsi Latihan</Text>
        <Text style={styles.description}>
          {latihan.content || `Latihan ${latihan.title.toLowerCase()} adalah latihan vokal yang dirancang khusus untuk meningkatkan kemampuan vokal Anda.`}
        </Text>

        {/* Tips */}
        {latihan.tips && (
          <>
            <Text style={styles.sectionTitle}>💡 Tips Latihan</Text>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsText}>{latihan.tips}</Text>
            </View>
          </>
        )}

        {/* Steps */}
        <Text style={styles.sectionTitle}>📋 Langkah-langkah</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
            <Text style={styles.stepText}>Lakukan pemanasan vokal 5 menit sebelum latihan</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
            <Text style={styles.stepText}>Ikuti instruksi latihan dengan fokus</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
            <Text style={styles.stepText}>Rekam suara Anda untuk evaluasi</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>4</Text></View>
            <Text style={styles.stepText}>Catat progress di jurnal latihan</Text>
          </View>
        </View>

        {/* Achievement Card */}
        <View style={styles.achievementCard}>
          <Award size={24} color={colors.yellow()} />
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Selesaikan latihan ini</Text>
            <Text style={styles.achievementText}>Dapatkan +50 EXP dan lencana "Vocal Practice"</Text>
          </View>
          <ChevronRight size={18} color={colors.grey(0.4)} />
        </View>

        {/* ==================== KOMENTAR SECTION ==================== */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>💬 Komentar ({comments.length})</Text>
          
          {/* Input Komentar */}
          <View style={styles.commentInputContainer}>
            <Image source={{ uri: ProfileData.profilePict }} style={styles.commentAvatar} />
            <View style={styles.commentInputWrapper}>
              <TextInput
                style={styles.commentInput}
                placeholder={editingComment ? "Edit komentar..." : "Tulis komentar..."}
                placeholderTextColor={colors.grey(0.4)}
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity onPress={editingComment ? handleUpdateComment : handleAddComment} style={styles.commentSendButton}>
                <Send size={18} color={colors.blue()} />
              </TouchableOpacity>
            </View>
            {editingComment && (
              <TouchableOpacity onPress={cancelEdit} style={styles.commentCancelButton}>
                <Text style={styles.commentCancelText}>Batal</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* List Komentar */}
          {loadingComments ? (
            <ActivityIndicator color={colors.blue()} style={{ marginTop: spacing.md }} />
          ) : comments.length === 0 ? (
            <View style={styles.emptyCommentContainer}>
              <MessageCircle size={40} color={colors.grey(0.3)} />
              <Text style={styles.emptyCommentText}>Belum ada komentar</Text>
              <Text style={styles.emptyCommentSubtext}>Jadilah yang pertama berkomentar</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <CommentItem
                  comment={item}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  onLike={handleLikeComment}
                  currentUserId={ProfileData.id || 'user_current'}
                />
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Animated.View style={{ transform: [{ scale: bookmarkScale }], flex: 1 }}>
          <TouchableOpacity style={styles.bookmarkButton} onPress={animateBookmark} activeOpacity={0.7}>
            <Bookmark color={isBookmarked ? colors.blue() : colors.grey(0.6)} size={20} fill={isBookmarked ? colors.blue() : 'none'} />
            <Text style={[styles.bookmarkText, { color: isBookmarked ? colors.blue() : colors.grey(0.6) }]}>
              {isBookmarked ? 'Tersimpan' : 'Simpan'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: startScale }], flex: 2 }}>
          <TouchableOpacity style={styles.startButton} onPress={animateStart} activeOpacity={0.8}>
            <Play size={18} color={colors.white()} />
            <Text style={styles.startText}>Mulai Latihan</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white() },
  loadingText: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.grey(0.6) },
  header: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.white(), zIndex: 20, borderBottomWidth: 0.5, borderBottomColor: colors.grey(0.08) },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white() },
  headerTitle: { flex: 1, fontSize: typography.body2.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.black(), textAlign: 'center', marginHorizontal: spacing.sm },
  headerRight: { flexDirection: 'row', gap: spacing.md },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white() },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
  image: { width: '100%', height: 240, borderRadius: borderRadius.xl, marginBottom: spacing.lg },
  levelBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.round, gap: spacing.xs, marginBottom: spacing.md },
  levelText: { fontSize: typography.caption.fontSize, fontFamily: 'Pjs-SemiBold' },
  title: { fontSize: typography.h2.fontSize, fontFamily: typography.h2.fontFamily, color: colors.black(), lineHeight: 36, marginBottom: spacing.md },
  metaContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blue(0.08), paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.round, gap: spacing.xs },
  category: { fontSize: typography.caption.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.blue() },
  date: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5) },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statIconBg: { width: 32, height: 32, borderRadius: borderRadius.round, backgroundColor: colors.blue(0.08), alignItems: 'center', justifyContent: 'center' },
  statText: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.grey(0.7) },
  divider: { height: 1, backgroundColor: colors.grey(0.1), marginVertical: spacing.lg },
  sectionTitle: { fontSize: typography.h5.fontSize, fontFamily: typography.h5.fontFamily, color: colors.black(), marginBottom: spacing.md },
  description: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.grey(0.7), lineHeight: 22, marginBottom: spacing.lg },
  tipsContainer: { backgroundColor: colors.yellow(0.08), borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  tipsText: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.grey(0.7), lineHeight: 20 },
  stepsContainer: { gap: spacing.md, marginBottom: spacing.lg },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepNumber: { width: 28, height: 28, borderRadius: borderRadius.round, backgroundColor: colors.grey(0.08), alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: typography.caption.fontSize, fontFamily: 'Pjs-Bold', color: colors.grey(0.6) },
  stepText: { flex: 1, fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.grey(0.7), lineHeight: 20 },
  achievementCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blue(0.05), borderRadius: borderRadius.lg, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.lg },
  achievementContent: { flex: 1 },
  achievementTitle: { fontSize: typography.body3.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.black() },
  achievementText: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.5), marginTop: spacing.xs },
  commentSection: { marginTop: spacing.lg, marginBottom: spacing.lg },
  commentInputContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.grey(0.05), borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  commentInput: { flex: 1, fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.black(), paddingVertical: spacing.sm, maxHeight: 80 },
  commentSendButton: { padding: spacing.sm },
  commentCancelButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  commentCancelText: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.red() },
  emptyCommentContainer: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyCommentText: { fontSize: typography.body2.fontSize, fontFamily: 'Pjs-SemiBold', color: colors.grey(0.5) },
  emptyCommentSubtext: { fontSize: typography.caption.fontSize, fontFamily: typography.caption.fontFamily, color: colors.grey(0.4) },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: colors.white(), borderTopWidth: 0.5, borderTopColor: colors.grey(0.15), gap: spacing.md, paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md },
  bookmarkButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.grey(0.06), paddingVertical: spacing.md, borderRadius: borderRadius.round },
  bookmarkText: { fontSize: typography.button.fontSize, fontFamily: typography.button.fontFamily },
  startButton: { flex: 2, flexDirection: 'row', backgroundColor: colors.blue(), paddingVertical: spacing.md, borderRadius: borderRadius.round, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, shadowColor: colors.blue(), shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  startText: { fontSize: typography.button.fontSize, fontFamily: typography.button.fontFamily, color: colors.white() },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  modalContent: { backgroundColor: colors.white(), marginTop: 100, marginRight: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.sm, width: 160, elevation: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  menuText: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.black() },
  menuDivider: { height: 0.5, backgroundColor: colors.grey(0.1), marginHorizontal: spacing.xs },
  timerModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  timerModalContent: { backgroundColor: colors.white(), borderRadius: borderRadius.xxl, padding: spacing.xl, width: width - 48, alignItems: 'center' },
  timerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: spacing.xl },
  timerTitle: { fontSize: typography.h5.fontSize, fontFamily: typography.h5.fontFamily, color: colors.black() },
  timerDisplay: { alignItems: 'center', marginBottom: spacing.xl },
  timerTime: { fontSize: 52, fontFamily: 'Pjs-ExtraBold', color: colors.blue() },
  timerLabel: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.grey(0.5), marginTop: spacing.sm },
  timerStartButton: { flexDirection: 'row', backgroundColor: colors.blue(), paddingHorizontal: 32, paddingVertical: spacing.md, borderRadius: borderRadius.round, alignItems: 'center', gap: spacing.sm },
  timerStartText: { fontSize: typography.button.fontSize, fontFamily: typography.button.fontFamily, color: colors.white() },
  timerRunningText: { fontSize: typography.body2.fontSize, fontFamily: typography.body2.fontFamily, color: colors.green(), marginTop: spacing.lg },
  timerComplete: { alignItems: 'center', gap: spacing.md },
  timerCompleteText: { fontSize: typography.h5.fontSize, fontFamily: typography.h5.fontFamily, color: colors.green(), marginTop: spacing.sm },
  timerCompleteSub: { fontSize: typography.body3.fontSize, fontFamily: typography.body3.fontFamily, color: colors.grey(0.5) },
});