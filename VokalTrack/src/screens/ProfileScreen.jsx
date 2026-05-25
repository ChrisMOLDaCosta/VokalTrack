import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Settings, Edit2, LogOut, Plus } from 'lucide-react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';
import { ProfileData } from '../data/profiledata';
import { LatihanList } from '../data/latihan';
import ItemSmall from '../components/ItemSmall';

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1e6) return (num/1e6).toFixed(1).replace(/\.0$/,'') + 'M';
  if (num >= 1e3) return (num/1e3).toFixed(1).replace(/\.0$/,'') + 'K';
  return num.toString();
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [following] = useState(ProfileData.following);
  const [followers] = useState(ProfileData.follower);
  const userLatihan = LatihanList.slice(0,4);

  const handleFollow = () => Alert.alert('Info', 'Fitur follow akan tersedia di update berikutnya');
  const handleSettings = () => Alert.alert('Pengaturan', 'Fitur pengaturan akan segera hadir');
  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => Alert.alert('Logout', 'Terima kasih telah menggunakan VokalTrack') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings}><Settings color={colors.black()} size={24} /></TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}><LogOut color={colors.black()} size={24} /></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image style={styles.profileImage} source={{ uri: ProfileData.profilePict }} contentFit="cover" />
          <Text style={styles.name}>{ProfileData.name}</Text>
          <Text style={styles.bio}>Vocalis | VokalTrack User</Text>
          <Text style={styles.memberSince}>Bergabung sejak {ProfileData.createdAt}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}><Text style={styles.statValue}>{userLatihan.length}</Text><Text style={styles.statLabel}>Latihan</Text></View>
            <TouchableOpacity style={styles.statItem} onPress={handleFollow}><Text style={styles.statValue}>{formatNumber(following)}</Text><Text style={styles.statLabel}>Mengikuti</Text></TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollow}><Text style={styles.statValue}>{formatNumber(followers)}</Text><Text style={styles.statLabel}>Pengikut</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
            <Edit2 size={16} color={colors.white()} />
            <Text style={styles.editProfileText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latihan Terbaru</Text>
          <View style={styles.latihanList}>
            {userLatihan.map((item, index) => <ItemSmall item={item} key={index} />)}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('AddLatihan')}>
        <Plus size={24} color={colors.white()} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.white() },
  header: { paddingHorizontal:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:52, marginTop:8 },
  scrollContent: { paddingBottom:90 },
  profileHeader: { alignItems:'center', marginTop:8, paddingHorizontal:20, gap:6 },
  profileImage: { width:100, height:100, borderRadius:50, borderWidth:2, borderColor: colors.blue() },
  name: { fontSize:22, fontFamily:'Pjs-Bold', color: colors.black(), marginTop:8 },
  bio: { fontSize:14, fontFamily:'Pjs-Medium', color: colors.grey(0.7) },
  memberSince: { fontSize:12, fontFamily:'Pjs-Regular', color: colors.grey(0.6) },
  statsContainer: { flexDirection:'row', gap:40, marginTop:12, marginBottom:8 },
  statItem: { alignItems:'center', gap:4 },
  statValue: { fontSize:18, fontFamily:'Pjs-Bold', color: colors.black() },
  statLabel: { fontSize:12, fontFamily:'Pjs-Medium', color: colors.grey(0.6) },
  editProfileButton: { flexDirection:'row', alignItems:'center', gap:8, marginTop:8, paddingHorizontal:24, paddingVertical:10, backgroundColor: colors.blue(), borderRadius:30 },
  editProfileText: { fontSize:14, fontFamily:'Pjs-SemiBold', color: colors.white() },
  section: { marginTop:24 },
  sectionTitle: { fontSize:18, fontFamily:'Pjs-Bold', color: colors.black(), paddingHorizontal:20, marginBottom:12 },
  latihanList: { paddingHorizontal:20, gap:12 },
  floatingButton: { position:'absolute', bottom:24, right:24, backgroundColor: colors.blue(), width:56, height:56, borderRadius:28, justifyContent:'center', alignItems:'center', elevation:5, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4 },
});