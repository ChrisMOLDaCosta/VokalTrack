import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Wind, Disc, Volume2, BatteryCharging, Users } from 'lucide-react-native';
import { colors } from '../../assets/theme';

const tipsData = [
  { id:'1', title:'Pemanasan Vokal', desc:'Lakukan pemanasan 5-10 menit dengan lip trill, humming, atau sirene suara.', icon:'mic' },
  { id:'2', title:'Pernapasan Diafragma', desc:'Gunakan pernapasan perut untuk kontrol napas yang lebih baik.', icon:'wind' },
  { id:'3', title:'Postur Tubuh', desc:'Berdiri tegak dengan bahu rileks, kaki selebar bahu.', icon:'disc' },
  { id:'4', title:'Hidrasi', desc:'Minum air putih hangat, hindari kafein dan susu.', icon:'battery' },
  { id:'5', title:'Jeda Latihan', desc:'Istirahat 5-10 menit setiap 30 menit latihan.', icon:'volume' },
  { id:'6', title:'Rekam Suara', desc:'Rekam latihanmu untuk mengevaluasi progres.', icon:'mic' },
  { id:'7', title:'Konsistensi', desc:'Latihan rutin 15-30 menit setiap hari lebih efektif.', icon:'users' },
];

const getIcon = (iconName, color) => {
  switch (iconName) {
    case 'mic': return <Mic color={color} size={24} />;
    case 'wind': return <Wind color={color} size={24} />;
    case 'disc': return <Disc color={color} size={24} />;
    case 'volume': return <Volume2 color={color} size={24} />;
    case 'users': return <Users color={color} size={24} />;
    default: return <BatteryCharging color={color} size={24} />;
  }
};

const TipCard = ({ title, desc, iconName }) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>{getIcon(iconName, colors.blue())}</View>
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  </View>
);

export default function TipsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tips Vokal</Text>
        <Text style={styles.subtitle}>Tingkatkan kualitas suaramu</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tipsData.map(item => <TipCard key={item.id} title={item.title} desc={item.desc} iconName={item.icon} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.white() },
  header: { paddingHorizontal:20, paddingTop:16, paddingBottom:12, borderBottomWidth:0.5, borderBottomColor: colors.grey(0.2) },
  title: { fontSize:24, fontFamily:'Pjs-ExtraBold', color: colors.black() },
  subtitle: { fontSize:14, fontFamily:'Pjs-Regular', color: colors.grey(0.6), marginTop:4 },
  scrollContent: { padding:20, gap:16, paddingBottom:90 },
  card: { flexDirection:'row', alignItems:'center', backgroundColor: colors.grey(0.04), borderRadius:16, padding:16, gap:16 },
  iconContainer: { width:48, height:48, borderRadius:24, backgroundColor: colors.blue(0.1), justifyContent:'center', alignItems:'center' },
  textContainer: { flex:1 },
  cardTitle: { fontSize:16, fontFamily:'Pjs-Bold', color: colors.black(), marginBottom:4 },
  cardDesc: { fontSize:13, fontFamily:'Pjs-Regular', color: colors.grey(0.7), lineHeight:20 },
});