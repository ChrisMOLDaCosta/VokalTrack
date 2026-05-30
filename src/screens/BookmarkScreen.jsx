import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Bookmark, BookOpen, Clock, Mic, TrendingUp, Trash2 } from 'lucide-react-native';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';
import ItemBookmark from '../components/ItemBookmark';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../libs/supabase';

const STORAGE_KEY = '@vokaltrack_bookmarks';

export default function BookmarkScreen() {
  const navigation = useNavigation();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let bookmarkedIds = stored ? JSON.parse(stored) : [];
      
      if (bookmarkedIds.length === 0) {
        setBookmarks([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('latihan')
        .select('*')
        .in('id', bookmarkedIds);
      
      if (error) throw error;
      setBookmarks(data || []);
      
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (id) => {
    const newBookmarks = bookmarks.filter(item => item.id !== id);
    setBookmarks(newBookmarks);
    const newIds = newBookmarks.map(item => item.id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
  };

  const clearAllBookmarks = async () => {
    if (bookmarks.length === 0) return;
    
    Alert.alert(
      'Hapus Semua Bookmark',
      `Yakin ingin menghapus semua ${bookmarks.length} latihan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: async () => {
            setBookmarks([]);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const totalDuration = bookmarks.reduce((sum, item) => sum + (parseInt(item.duration) || 0), 0);
  const avgRating = bookmarks.length > 0 
    ? (bookmarks.reduce((sum, item) => sum + (item.rating || 0), 0) / bookmarks.length).toFixed(1) 
    : 0;

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}j ${mins}m` : `${hours} jam`;
    }
    return `${minutes} menit`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue()} />
          <Text style={styles.loadingText}>Memuat bookmark...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bookmark</Text>
        </View>
        <View style={styles.emptyContainer}>
          <BookOpen size={56} color={colors.grey(0.3)} />
          <Text style={styles.emptyTitle}>Belum Ada Bookmark</Text>
          <Text style={styles.emptySubtitle}>
            Tandai latihan favoritmu dengan menekan ikon bookmark
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('MainApp', { screen: 'LatihanTab' })}
          >
            <Mic size={18} color={colors.white()} />
            <Text style={styles.emptyButtonText}>Jelajahi Latihan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bookmark</Text>
        <TouchableOpacity onPress={clearAllBookmarks} style={styles.clearButton}>
          <Trash2 size={20} color={colors.red()} />
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <BookOpen size={20} color={colors.blue()} />
          <Text style={styles.statValue}>{bookmarks.length}</Text>
          <Text style={styles.statLabel}>Total Latihan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Clock size={20} color={colors.green()} />
          <Text style={styles.statValue}>{formatDuration(totalDuration)}</Text>
          <Text style={styles.statLabel}>Total Durasi</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <TrendingUp size={20} color={colors.yellow()} />
          <Text style={styles.statValue}>{avgRating}</Text>
          <Text style={styles.statLabel}>Rata-rata Rating</Text>
        </View>
      </View>

      {/* Bookmark List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue()]} />
        }
      >
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>Latihan Tersimpan</Text>
          <Text style={styles.listHeaderCount}>{bookmarks.length} item</Text>
        </View>
        
        {bookmarks.map((item) => (
          <ItemBookmark key={item.id} item={item} onPressRemove={removeBookmark} />
        ))}
        
        <View style={{ height: 80 }} />
      </ScrollView>
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
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.6),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pjs-ExtraBold',
    color: colors.black(),
  },
  clearButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grey(0.05),
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.grey(0.2),
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  listHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black(),
  },
  listHeaderCount: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.5),
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    backgroundColor: colors.blue(),
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: 'Pjs-SemiBold',
    color: colors.white(),
  },
});