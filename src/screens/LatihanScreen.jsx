import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Flame, Star, Mic, Clock, X, ChevronRight, TrendingUp } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';
import ItemSmall from '../components/ItemSmall';
import { supabase } from '../libs/supabase';

const { width } = Dimensions.get('window');

// Data kategori yang masuk akal untuk latihan vokal
const categoryOptions = [
  { id: 1, name: 'Semua' },
  { id: 2, name: 'Pemanasan' },
  { id: 3, name: 'Pernapasan' },
  { id: 4, name: 'Teknik Vokal' },
  { id: 5, name: 'Artikulasi' },
  { id: 6, name: 'Resonansi' },
  { id: 7, name: 'Pitch Control' },
  { id: 8, name: 'Vokal Power' },
];

// Category Item Component
const CategoryItem = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryItem, isSelected && styles.categoryItemActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

// Popular Card Component
const PopularCard = ({ item, index }) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <TouchableOpacity
      style={styles.popularCard}
      activeOpacity={0.8}
      onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      onPress={() => navigation.navigate('LatihanDetail', { latihanId: item.id })}
    >
      <Animated.View style={[styles.popularCardInner, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.popularRank}>
          <Text style={styles.popularRankText}>{index + 1}</Text>
        </View>
        <View style={styles.popularIcon}>
          <Flame size={18} color={colors.orange()} />
        </View>
        <View style={styles.popularContent}>
          <Text style={styles.popularTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.popularMeta}>
            <Clock size={10} color={colors.grey(0.5)} />
            <Text style={styles.popularMetaText}>{item.duration || 15} menit</Text>
            <Text style={styles.popularMetaDot}>•</Text>
            <Text style={styles.popularMetaText}>{item.level || 'Pemula'}</Text>
          </View>
        </View>
        <View style={styles.popularBadge}>
          <Star size={12} color={colors.yellow()} fill={colors.yellow()} />
          <Text style={styles.popularRating}>{item.rating || 4.5}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Recent Search Chip
const RecentChip = ({ label, onPress }) => (
  <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.7}>
    <Mic size={12} color={colors.grey(0.5)} />
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

export default function LatihanScreen() {
  const navigation = useNavigation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [latihanList, setLatihanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);

  // Fetch data from Supabase
  const fetchLatihan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('latihan')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLatihanList(data || []);
    } catch (error) {
      console.error('Error fetching latihan:', error);
      Alert.alert('Error', 'Gagal mengambil data latihan');
      setLatihanList([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchLatihan(); }, []));
  const onRefresh = useCallback(async () => { setRefreshing(true); await fetchLatihan(); setRefreshing(false); }, []);

  // Filter logic
  const filteredLatihan = latihanList.filter(item => {
    const selectedCategory = categoryOptions.find(c => c.id === selectedCategoryId);
    const matchCategory = selectedCategoryId === 1 || item.category === selectedCategory?.name;
    const matchSearch = searchQuery === '' || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Top 5 popular by rating
  const popularLatihan = [...latihanList]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  const recentSearches = ['Pemanasan', 'Pernapasan', 'Vokal Power', 'Artikulasi', 'Pitch Control'];
  const totalLatihan = latihanList.length;
  const avgDuration = latihanList.length > 0
    ? Math.round(latihanList.reduce((sum, item) => sum + (item.duration || 0), 0) / latihanList.length)
    : 0;

  // Search bar animation
  const diffClampY = Animated.diffClamp(scrollY, 0, 120);
  const searchY = diffClampY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  });

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue()} />
        <Text style={styles.loadingText}>Memuat latihan vokal...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />
      
      {/* Search Bar */}
      <Animated.View style={[styles.searchWrapper, { transform: [{ translateY: searchY }] }]}>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.grey(0.5)} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Cari latihan vokal..."
              placeholderTextColor={colors.grey(0.4)}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} hitSlop={10}>
                <X size={18} color={colors.grey(0.5)} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Main Scroll Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue()]} />}
      >
        {/* Stats Header - Symmetric */}
        <View style={styles.statHeader}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalLatihan}</Text>
            <Text style={styles.statLabel}>Total Latihan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgDuration}</Text>
            <Text style={styles.statLabel}>Rata-rata (min)</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <TrendingUp size={20} color={colors.blue()} />
            <Text style={styles.statLabel}>Terus tingkatkan</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categoryOptions.map(cat => (
              <CategoryItem
                key={cat.id}
                item={cat}
                isSelected={selectedCategoryId === cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Searches */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pencarian Terbaru</Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>Hapus</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
            {recentSearches.map((label, idx) => (
              <RecentChip key={idx} label={label} onPress={() => setSearchQuery(label)} />
            ))}
          </ScrollView>
        </View>

        {/* All Exercises Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Hasil: "${searchQuery}"` : 'Semua Latihan'}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddLatihan')}>
              <Text style={styles.addText}>+ Tambah</Text>
            </TouchableOpacity>
          </View>

          {filteredLatihan.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Mic size={48} color={colors.grey(0.3)} />
              <Text style={styles.emptyTitle}>Tidak ada latihan</Text>
              <Text style={styles.emptySubtitle}>Coba kata kunci lain atau tambah latihan baru</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('AddLatihan')}>
                <Text style={styles.emptyButtonText}>+ Tambah Latihan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {filteredLatihan.map(item => (
                <ItemSmall key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>

        {/* Popular This Week */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Populer Minggu Ini</Text>
          </View>
          <View style={styles.popularList}>
            {popularLatihan.map((item, index) => (
              <PopularCard key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsIcon}>
            <Mic size={20} color={colors.white()} />
          </View>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>💡 Tips Vokal Hari Ini</Text>
            <Text style={styles.tipsText}>
              Lakukan pemanasan vokal 5-10 menit sebelum latihan untuk hasil maksimal!
            </Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </Animated.ScrollView>
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
    gap: 16,
    backgroundColor: colors.white(),
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.6),
  },
  searchWrapper: {
    backgroundColor: colors.white(),
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey(0.1),
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey(0.05),
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Pjs-Regular',
    color: colors.black(),
    padding: 0,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Stats Header - Symmetric design
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue(0.05),
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: colors.grey(0.2),
  },
  categorySection: {
    marginBottom: 8,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.grey(0.08),
  },
  categoryItemActive: {
    backgroundColor: colors.blue(),
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.7),
  },
  categoryTextActive: {
    color: colors.white(),
  },
  recentSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
  },
  clearText: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
  },
  addText: {
    fontSize: 13,
    fontFamily: 'Pjs-Medium',
    color: colors.blue(),
  },
  chipContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.grey(0.08),
    borderWidth: 0.5,
    borderColor: colors.grey(0.15),
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.7),
  },
  section: {
    marginTop: 24,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Pjs-SemiBold',
    color: colors.grey(0.6),
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.4),
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: colors.blue(),
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 8,
  },
  emptyButtonText: {
    fontSize: 13,
    fontFamily: 'Pjs-Medium',
    color: colors.white(),
  },
  popularList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  popularCard: {
    backgroundColor: colors.white(),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: colors.grey(0.1),
  },
  popularCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  popularRank: {
    width: 24,
    alignItems: 'center',
  },
  popularRankText: {
    fontSize: 14,
    fontFamily: 'Pjs-Bold',
    color: colors.grey(0.4),
  },
  popularIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.orange(0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularContent: {
    flex: 1,
  },
  popularTitle: {
    fontSize: 14,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black(),
  },
  popularMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  popularMetaText: {
    fontSize: 11,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
  },
  popularMetaDot: {
    fontSize: 10,
    color: colors.grey(0.3),
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.yellow(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  popularRating: {
    fontSize: 12,
    fontFamily: 'Pjs-SemiBold',
    color: colors.yellow(),
  },
  tipsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: colors.blue(0.08),
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  tipsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue(),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Pjs-Bold',
    color: colors.blue(),
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 12,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.7),
    lineHeight: 18,
  },
});