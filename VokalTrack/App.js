// App.js
// Fungsi utama aplikasi VokalTrack untuk pembelajaran vokal

import { ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Music } from 'lucide-react-native'; // Icon mikrofon untuk tema vokal
import { colors, fontType } from './assets/theme';
import ListLatihan from './src/components/ListLatihan'; // Komponen daftar latihan vokal
import { useFonts } from 'expo-font';

export default function App() {
  // Memuat font yang sudah didefinisikan di fonts.js
  const [loaded] = useFonts(fontType);

  // Jika font belum selesai dimuat, tampilkan null (loading)
  if (!loaded) {
    return null;
  }

  return (
    // SafeAreaView memastikan konten tidak menembus status bar
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />

      {/* Header aplikasi */}
      <View style={styles.header}>
        <Text style={styles.title}>VokalTrack</Text>
        <Music color={colors.blue()} size={24} /> {/* Icon musik sebagai pengganti Bell */}
      </View>

      {/* Kategori latihan vokal (ScrollView horizontal) */}
      <View style={styles.listCategory}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ ...category.item, marginLeft: 24 }}>
            <Text style={{ ...category.title, color: colors.blue() }}>
              Semua
            </Text>
          </View>
          <View style={category.item}>
            <Text style={category.title}>Pernafasan</Text>
          </View>
          <View style={category.item}>
            <Text style={category.title}>Teknik Vokal</Text>
          </View>
          <View style={category.item}>
            <Text style={category.title}>Artikulasi</Text>
          </View>
          <View style={category.item}>
            <Text style={category.title}>Resonansi</Text>
          </View>
          <View style={{ ...category.item, marginRight: 24 }}>
            <Text style={category.title}>Pitch</Text>
          </View>
        </ScrollView>
      </View>

      {/* Komponen daftar latihan vokal */}
      <ListLatihan styles={styles} />
    </SafeAreaView>
  );
}

// Style untuk komponen utama
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
    shadowColor: colors.white(),
  },
  header: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: colors.white(),
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pjs-ExtraBold',
    color: colors.black(),
  },
  listCategory: {
    paddingVertical: 10,
  },
  listLatihan: {
    paddingVertical: 10,
    gap: 10,
  },
});

// Style untuk kategori
const category = StyleSheet.create({
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: colors.grey(0.08),
    marginHorizontal: 5,
  },
  title: {
    fontFamily: 'Pjs-SemiBold',
    fontSize: 14,
    lineHeight: 18,
    color: colors.grey(),
  },
});