import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Animated, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MessageCircle, Heart, Bookmark, Share2, Edit, Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { colors } from '../../assets/theme';
import axios from 'axios';

const API_URL = 'https://6a146b636c7db8aac0547e60.mockapi.io/latihan';

const formatNumber = (num) => {
  if (num >= 1e9) return (num/1e9).toFixed(1)+'B';
  if (num >= 1e6) return (num/1e6).toFixed(1)+'M';
  if (num >= 1e3) return (num/1e3).toFixed(1)+'K';
  return num.toString();
};

export default function LatihanDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { latihanId } = route.params;
  const [latihan, setLatihan] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => { fetchLatihan(); }, []);

  const fetchLatihan = async () => {
    try {
      const response = await axios.get(`${API_URL}/${latihanId}`);
      setLatihan(response.data);
    } catch (error) { Alert.alert('Error', 'Gagal memuat detail latihan'); }
    finally { setLoading(false); }
  };

  const handleDelete = () => {
    Alert.alert('Hapus Latihan', 'Yakin ingin menghapus?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${latihanId}`);
            navigation.goBack();
          } catch (error) { Alert.alert('Error', 'Gagal menghapus'); }
        }
      }
    ]);
  };

  const diffClampY = Animated.diffClamp(scrollY, 0, 52);
  const headerY = diffClampY.interpolate({ inputRange:[0,52], outputRange:[0,-52], extrapolate:'clamp' });
  const bottomBarY = diffClampY.interpolate({ inputRange:[0,52], outputRange:[0,52], extrapolate:'clamp' });

  if (loading) return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><ActivityIndicator size="large" color={colors.blue()} /></View>;
  if (!latihan) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white()} />
      <Animated.View style={[styles.header, { transform: [{ translateY: headerY }] }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={20}><ArrowLeft color={colors.black()} size={24} /></TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('EditLatihan', { latihanId: latihan.id })} hitSlop={20}><Edit color={colors.black()} size={24} /></TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} hitSlop={20}><Trash2 color={colors.red()} size={24} /></TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={{ uri: latihan.image }} style={styles.image} contentFit="cover" />
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{latihan.category}</Text>
          <Text style={styles.date}>{latihan.createdAt}</Text>
        </View>
        <Text style={styles.title}>{latihan.title}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Clock size={16} color={colors.grey(0.6)} /><Text style={styles.statText}>{latihan.duration}</Text></View>
          <View style={styles.statItem}><MessageCircle size={16} color={colors.grey(0.6)} /><Text style={styles.statText}>{latihan.totalComments} komentar</Text></View>
          <View style={styles.statItem}><Heart size={16} color={colors.grey(0.6)} /><Text style={styles.statText}>{formatNumber(latihan.totalLikes || 128)}</Text></View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.description}>{latihan.content || `Latihan ${latihan.title.toLowerCase()} untuk meningkatkan kemampuan vokal Anda.`}</Text>
        <View style={{ height: 80 }} />
      </Animated.ScrollView>
      <Animated.View style={[styles.bottomBar, { transform: [{ translateY: bottomBarY }] }]}>
        <TouchableOpacity style={styles.bookmarkButton}><Bookmark color={colors.blue()} size={20} /><Text style={styles.bookmarkText}>Simpan</Text></TouchableOpacity>
        <TouchableOpacity style={styles.startButton}><Text style={styles.startText}>Mulai Latihan</Text></TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.white() },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingVertical:12, backgroundColor: colors.white(), position:'absolute', top:0, left:0, right:0, zIndex:10 },
  headerRight: { flexDirection:'row', gap:24 },
  scrollContent: { paddingHorizontal:20, paddingTop:80, paddingBottom:160 },
  image: { width:'100%', height:220, borderRadius:20, marginBottom:16 },
  metaContainer: { flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
  category: { fontSize:14, fontFamily:'Pjs-SemiBold', color: colors.blue() },
  date: { fontSize:12, fontFamily:'Pjs-Medium', color: colors.grey(0.6) },
  title: { fontSize:22, fontFamily:'Pjs-Bold', color: colors.black(), marginBottom:12 },
  statsRow: { flexDirection:'row', gap:20, marginBottom:16, flexWrap:'wrap' },
  statItem: { flexDirection:'row', alignItems:'center', gap:6 },
  statText: { fontSize:13, fontFamily:'Pjs-Medium', color: colors.grey(0.7) },
  divider: { height:1, backgroundColor: colors.grey(0.2), marginVertical:16 },
  description: { fontSize:14, fontFamily:'Pjs-Regular', color: colors.grey(0.8), lineHeight:22 },
  bottomBar: { position:'absolute', bottom:0, left:0, right:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingVertical:12, backgroundColor: colors.white(), borderTopWidth:0.5, borderTopColor: colors.grey(0.2), gap:12 },
  bookmarkButton: { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor: colors.grey(0.1), paddingVertical:14, borderRadius:30 },
  bookmarkText: { fontSize:14, fontFamily:'Pjs-SemiBold', color: colors.blue() },
  startButton: { flex:2, backgroundColor: colors.blue(), paddingVertical:14, borderRadius:30, alignItems:'center' },
  startText: { fontSize:14, fontFamily:'Pjs-SemiBold', color: colors.white() },
});