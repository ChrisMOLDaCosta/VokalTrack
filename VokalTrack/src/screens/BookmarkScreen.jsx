import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, BookOpen } from 'lucide-react-native';
import { colors } from '../../assets/theme';
import { LatihanList } from '../data/latihan';
import ItemBookmark from '../components/ItemBookmark';

export default function BookmarkScreen() {
  const [bookmarks, setBookmarks] = useState(LatihanList.filter(item => item.id % 2 === 0));

  const removeBookmark = (id) => {
    Alert.alert('Hapus Bookmark', 'Apakah Anda yakin ingin menghapus latihan ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => setBookmarks(bookmarks.filter(item => item.id !== id)) },
    ]);
  };

  if (bookmarks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bookmark Latihan</Text>
          <TouchableOpacity><Plus color={colors.black()} size={24} /></TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <BookOpen size={64} color={colors.grey(0.4)} />
          <Text style={styles.emptyText}>Belum ada latihan yang ditandai</Text>
          <Text style={styles.emptySubText}>Tandai latihan favoritmu dari halaman Latihan</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmark Latihan</Text>
        <TouchableOpacity><Plus color={colors.black()} size={24} /></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {bookmarks.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <ItemBookmark item={item} />
              <TouchableOpacity style={styles.deleteButton} onPress={() => removeBookmark(item.id)} activeOpacity={0.7}>
                <Trash2 size={18} color={colors.red()} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 52, marginTop: 8 },
  title: { fontSize: 20, fontFamily: 'Pjs-ExtraBold', color: colors.black(), letterSpacing: -0.3 },
  scrollContent: { paddingBottom: 90 },
  listContainer: { paddingHorizontal: 20, gap: 12, paddingVertical: 10 },
  cardWrapper: { position: 'relative' },
  deleteButton: { position: 'absolute', bottom: 12, right: 12, backgroundColor: colors.white(0.95), padding: 8, borderRadius: 20, zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingHorizontal: 40 },
  emptyText: { fontSize: 16, fontFamily: 'Pjs-Medium', color: colors.grey(0.6), textAlign: 'center' },
  emptySubText: { fontSize: 13, fontFamily: 'Pjs-Regular', color: colors.grey(0.4), textAlign: 'center' },
});