import React from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Bell, Menu } from 'lucide-react-native';
import { colors, fontType } from './assets/theme';
import ListLatihan from './src/components/ListLatihan';
import { useFonts } from 'expo-font';
import { CategoryList } from './src/data/categories';
import { useState } from 'react';

// Komponen ItemCategory (props)
const ItemCategory = ({ item, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={categoryStyle.item}>
        <Text style={{ ...categoryStyle.title, color }}>{item.categoryName}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Komponen FlatListCategory dengan state selected
const FlatListCategory = () => {
  const [selected, setSelected] = useState(1); // kategori pertama (Pemanasan) aktif

  const renderItem = ({ item }) => {
    const color = item.id === selected ? colors.blue() : colors.grey();
    return (
      <ItemCategory
        item={item}
        onPress={() => setSelected(item.id)}
        color={color}
      />
    );
  };

  return (
    <FlatList
      data={CategoryList}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default function App() {
  const [loaded] = useFonts(fontType);
  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />
        <View style={styles.header}>
          <Text style={styles.title}>VokalTrack</Text>
          <View style={styles.headerRight}>
            <Bell color={colors.black()} size={24} />
            <Menu color={colors.black()} size={24} />
          </View>
        </View>
        <Text style={styles.subtitle}>Aplikasi mencatat latihan menyanyi</Text>
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Latihan Vokal Setiap Hari</Text>
            <Text style={styles.bannerDesc}>Catat progres latihan dan perkembangan suara kamu</Text>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d' }} style={styles.bannerImage} />
        </View>
        <View style={styles.listCategory}>
          <FlatListCategory />
        </View>
        <ListLatihan styles={styles} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  header: { paddingHorizontal: 24, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  title: { fontSize: 20, fontFamily: 'Pjs-ExtraBold', color: colors.black() },
  subtitle: { marginLeft: 24, marginTop: 4, fontSize: 13, color: colors.grey(), fontFamily: 'Pjs-Regular' },
  banner: { flexDirection: 'row', backgroundColor: colors.blue(), marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 18, alignItems: 'center' },
  bannerTitle: { color: colors.white(), fontFamily: 'Pjs-Bold', fontSize: 14 },
  bannerDesc: { color: colors.white(0.7), fontSize: 12, marginTop: 4, fontFamily: 'Pjs-Regular' },
  bannerImage: { width: 60, height: 60, borderRadius: 12 },
  listCategory: { paddingVertical: 10 },
  listLatihan: { paddingVertical: 10, gap: 10 },
  listCard: { paddingVertical: 10, gap: 15 },
});

const categoryStyle = StyleSheet.create({
  item: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, backgroundColor: colors.grey(0.08), marginHorizontal: 6 },
  title: { fontFamily: 'Pjs-SemiBold', fontSize: 13, color: colors.grey() },
});