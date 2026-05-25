import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, TextInput,
  RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Flame, Star } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';
import ItemSmall from '../components/ItemSmall';
import axios from 'axios';

// GANTI DENGAN ENDPOINT MOCKAPI ANDA
const API_URL = 'https://6a146b636c7db8aac0547e60.mockapi.io/latihan';

const categoryFilters = [
  { id: 1, name: 'Semua' }, { id: 2, name: 'Pemanasan' }, { id: 3, name: 'Pernapasan' },
  { id: 4, name: 'Teknik Vokal' }, { id: 5, name: 'Artikulasi' }, { id: 6, name: 'Resonansi' },
  { id: 7, name: 'Pitch Control' }, { id: 8, name: 'Vokal Power' }
];

const RecentChip = ({ label }) => (
  <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>{label}</Text></TouchableOpacity>
);

const PopularCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.popularCard} activeOpacity={0.7}
      onPress={() => navigation.navigate('LatihanDetail', { latihanId: item.id })}>
      <View style={styles.popularIcon}><Flame size={18} color={colors.orange()} /></View>
      <View style={styles.popularContent}>
        <Text style={styles.popularTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.popularMeta}>{item.duration} • {item.level}</Text>
      </View>
      <View style={styles.popularBadge}><Star size={14} color={colors.yellow()} /><Text style={styles.popularRating}>4.8</Text></View>
    </TouchableOpacity>
  );
};

export default function LatihanScreen() {
  const navigation = useNavigation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [latihanList, setLatihanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchLatihan = async () => {
    try {
      const response = await axios.get(API_URL);
      setLatihanList(response.data);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data latihan');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchLatihan(); }, []));
  const onRefresh = useCallback(async () => { setRefreshing(true); await fetchLatihan(); setRefreshing(false); }, []);

  const filteredLatihan = latihanList.filter(item => {
    const matchCategory = selectedCategoryId === 1 ||
      item.category === categoryFilters.find(c => c.id === selectedCategoryId)?.name;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });
  const popularLatihan = latihanList.slice(0, 4);
  const recentSearches = ['Pemanasan', 'Pernapasan', 'Vokal Power', 'Artikulasi', 'Resonansi'];

  const diffClampY = Animated.diffClamp(scrollY, 0, 100);
  const searchY = diffClampY.interpolate({ inputRange: [0,100], outputRange: [0,-100], extrapolate: 'clamp' });
  const recentY = diffClampY.interpolate({ inputRange: [0,100], outputRange: [0,-80], extrapolate: 'clamp' });

  if (loading) {
    return <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: colors.white() }}>
      <ActivityIndicator size="large" color={colors.blue()} />
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue()]} />}
      >
        <Animated.View style={{ transform: [{ translateY: searchY }] }}>
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Search size={20} color={colors.grey(0.6)} />
              <TextInput style={styles.searchInput} placeholder="Cari latihan vokal..." value={searchQuery} onChangeText={setSearchQuery} />
            </View>
          </View>
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: recentY }] }}>
          <View style={styles.categorySection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
              {categoryFilters.map(cat => (
                <TouchableOpacity key={cat.id} style={[styles.categoryItem, selectedCategoryId === cat.id && styles.categoryItemActive]}
                  onPress={() => setSelectedCategoryId(cat.id)}>
                  <Text style={[styles.categoryText, selectedCategoryId === cat.id && styles.categoryTextActive]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pencarian Terbaru</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
              {recentSearches.map((label, idx) => <RecentChip key={idx} label={label} />)}
            </ScrollView>
          </View>
        </Animated.View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Semua Latihan</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddLatihan')}><Text style={styles.seeAllText}>+ Tambah</Text></TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            {filteredLatihan.map(item => <ItemSmall key={item.id} item={item} />)}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionHeaderTitle}>Populer Minggu Ini</Text></View>
          <View style={styles.listContainer}>{popularLatihan.map(item => <PopularCard key={item.id} item={item} />)}</View>
        </View>
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips Vokal</Text>
          <Text style={styles.tipsText}>Lakukan pemanasan 5-10 menit sebelum latihan.</Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.white() }, scrollContent: { paddingBottom: 90 },
  searchSection: { paddingHorizontal:20, paddingTop:12 }, searchBar: { flexDirection:'row', alignItems:'center', backgroundColor: colors.grey(0.06), borderRadius:14, padding:12, gap:12 },
  searchInput: { flex:1, fontSize:15, fontFamily:'Pjs-Regular', color: colors.black(), padding:0 },
  categorySection: { marginTop:8 }, categoryContainer: { paddingHorizontal:20, gap:10 },
  categoryItem: { paddingHorizontal:16, paddingVertical:8, borderRadius:30, backgroundColor: colors.grey(0.08) },
  categoryItemActive: { backgroundColor: colors.blue() },
  categoryText: { fontSize:14, fontFamily:'Pjs-Medium', color: colors.grey(0.7) },
  categoryTextActive: { color: colors.white() },
  section: { marginTop:24 }, sectionTitle: { fontSize:18, fontFamily:'Pjs-Bold', color: colors.black(), paddingHorizontal:20, marginBottom:12 },
  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, marginBottom:12 },
  sectionHeaderTitle: { fontSize:18, fontFamily:'Pjs-Bold', color: colors.black() },
  seeAllText: { fontSize:13, fontFamily:'Pjs-Medium', color: colors.blue() },
  chipContainer: { paddingHorizontal:20, gap:10 }, chip: { paddingHorizontal:18, paddingVertical:8, borderRadius:30, backgroundColor: colors.grey(0.08), borderWidth:0.5, borderColor: colors.grey(0.2) },
  chipText: { fontSize:13, fontFamily:'Pjs-Medium', color: colors.grey(0.7) },
  listContainer: { paddingHorizontal:20, gap:12 },
  popularCard: { flexDirection:'row', alignItems:'center', backgroundColor: colors.white(), borderRadius:16, padding:12, gap:14, elevation:2 },
  popularIcon: { width:40, height:40, borderRadius:20, backgroundColor: colors.orange(0.15), justifyContent:'center', alignItems:'center' },
  popularContent: { flex:1 }, popularTitle: { fontSize:15, fontFamily:'Pjs-SemiBold', color: colors.black() },
  popularMeta: { fontSize:12, fontFamily:'Pjs-Regular', color: colors.grey(0.6), marginTop:2 },
  popularBadge: { flexDirection:'row', alignItems:'center', gap:4, backgroundColor: colors.yellow(0.1), paddingHorizontal:8, paddingVertical:4, borderRadius:20 },
  popularRating: { fontSize:12, fontFamily:'Pjs-SemiBold', color: colors.yellow() },
  tipsCard: { marginHorizontal:20, marginTop:24, backgroundColor: colors.blue(0.08), borderRadius:16, padding:16, marginBottom:20 },
  tipsTitle: { fontSize:16, fontFamily:'Pjs-Bold', color: colors.blue(), marginBottom:6 },
  tipsText: { fontSize:13, fontFamily:'Pjs-Regular', color: colors.grey(0.7), lineHeight:20 }
});