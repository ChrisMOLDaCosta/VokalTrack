import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Clock, MessageCircle, Bookmark } from 'lucide-react-native';
import { colors } from '../../assets/theme';

const ItemBookmark = ({ item, onPressRemove }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.infoRow}>
          <Clock size={12} color={colors.grey(0.6)} />
          <Text style={styles.infoText}>{item.duration}</Text>
          <MessageCircle size={12} color={colors.grey(0.6)} />
          <Text style={styles.infoText}>{item.totalComments}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onPressRemove && onPressRemove(item.id)} style={styles.bookmarkBtn}>
        <Bookmark size={20} color={colors.blue()} fill={colors.blue()} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.white(), borderRadius: 16, padding: 12, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 12 },
  content: { flex: 1, gap: 4 },
  category: { fontSize: 12, fontFamily: 'Pjs-SemiBold', color: colors.blue() },
  title: { fontSize: 14, fontFamily: 'Pjs-Bold', color: colors.black() },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  infoText: { fontSize: 11, fontFamily: 'Pjs-Medium', color: colors.grey(0.6) },
  bookmarkBtn: { justifyContent: 'center', paddingHorizontal: 4 },
});
export default ItemBookmark;