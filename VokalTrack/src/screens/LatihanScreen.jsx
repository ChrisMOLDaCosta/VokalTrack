// src/screens/LatihanScreen.jsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Flame, Star } from 'lucide-react-native';
import { colors } from '../../assets/theme';
import { LatihanList } from '../data/latihan';
import ItemSmall from '../components/ItemSmall';

// Data kategori untuk filter (sama seperti di HomeScreen)
const categoryFilters = [
  { id: 1, name: 'Semua' },
  { id: 2, name: 'Pemanasan' },
  { id: 3, name: 'Pernapasan' },
  { id: 4, name: 'Teknik Vokal' },
  { id: 5, name: 'Artikulasi' },
  { id: 6, name: 'Resonansi' },
  { id: 7, name: 'Pitch Control' },
  { id: 8, name: 'Vokal Power' },
];

const popularLatihan = LatihanList.slice(2, 6);

const RecentChip = ({ label }) => (
  <TouchableOpacity style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

const PopularCard = ({ item }) => (
  <TouchableOpacity style={styles.popularCard} activeOpacity={0.7}>
    <View style={styles.popularIcon}>
      <Flame size={18} color={colors.orange()} />
    </View>
    <View style={styles.popularContent}>
      <Text style={styles.popularTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.popularMeta}>{item.duration} • {item.level}</Text>
    </View>
    <View style={styles.popularBadge}>
      <Star size={14} color={colors.yellow()} />
      <Text style={styles.popularRating}>4.8</Text>
    </View>
  </TouchableOpacity>
);

export default function LatihanScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(1); // "Semua" aktif

  // Filter latihan berdasarkan kategori yang dipilih
  const filteredLatihan = selectedCategoryId === 1
    ? LatihanList
    : LatihanList.filter(item => {
        const selectedCategory = categoryFilters.find(c => c.id === selectedCategoryId);
        if (!selectedCategory) return false;
        return item.category.toLowerCase() === selectedCategory.name.toLowerCase();
      });

  const recentSearches = ['Pemanasan', 'Pernapasan', 'Vokal Power', 'Artikulasi', 'Resonansi'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.grey(0.6)} />
            <Text style={styles.searchPlaceholder}>Cari latihan vokal...</Text>
          </View>
        </View>

        {/* Kategori Filter (interaktif, warna biru saat dipilih) */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categoryFilters.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  selectedCategoryId === cat.id && styles.categoryItemActive,
                ]}
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategoryId === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Pencarian Terbaru */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pencarian Terbaru</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}
          >
            {recentSearches.map((label, idx) => (
              <RecentChip key={idx} label={label} />
            ))}
          </ScrollView>
        </View>

        {/* Daftar Latihan (hasil filter) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Semua Latihan</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rekomendasiList}>
            {filteredLatihan.map((item, index) => (
              <ItemSmall item={item} key={index} />
            ))}
          </View>
        </View>

        {/* Populer Minggu Ini */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Populer Minggu Ini</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.popularList}>
            {popularLatihan.map((item) => (
              <PopularCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Tips Vokal Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips Vokal</Text>
          <Text style={styles.tipsText}>
            Lakukan pemanasan 5-10 menit sebelum latihan. Minum air putih yang cukup, hindari kafein berlebih.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey(0.06),
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 15,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.5),
    flex: 1,
  },
  categorySection: {
    marginTop: 8,
    marginBottom: 8,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryItem: {
    paddingHorizontal: 16,
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: 'Pjs-Medium',
    color: colors.blue(),
  },
  chipContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.grey(0.08),
    borderWidth: 0.5,
    borderColor: colors.grey(0.2),
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.7),
  },
  rekomendasiList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  popularList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white(),
    borderRadius: 16,
    padding: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  popularIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.orange(0.15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularContent: {
    flex: 1,
  },
  popularTitle: {
    fontSize: 15,
    fontFamily: 'Pjs-SemiBold',
    color: colors.black(),
  },
  popularMeta: {
    fontSize: 12,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.6),
    marginTop: 2,
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
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: colors.blue(0.08),
    borderRadius: 16,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Pjs-Bold',
    color: colors.blue(),
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 13,
    fontFamily: 'Pjs-Regular',
    color: colors.grey(0.7),
    lineHeight: 20,
  },
});