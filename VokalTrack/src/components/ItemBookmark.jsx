import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Clock, MessageCircle, Bookmark } from "lucide-react-native";
import { Image } from "expo-image";
import { colors } from '../../assets/theme';

const truncateText = (text, maxWords) => {
  if (!text) return "Latihan vokal untuk meningkatkan teknik suara.";
  const words = text.split(" ");
  if (words.length > maxWords) return words.slice(0, maxWords).join(" ") + "...";
  return text;
};

export default function ItemBookmark({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.cardItem} activeOpacity={0.9} onPress={() => console.log("Detail latihan", item.id)}>
      <View style={styles.imageWrapper}>
        <Image style={styles.cardImage} source={{ uri: item.image }} contentFit="cover" transition={200} />
        <View style={[StyleSheet.absoluteFillObject, styles.cardContent]}>
          <View style={styles.cardCategory}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryLabel}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.cardIcon}>
            <TouchableOpacity onPress={onPress} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <Bookmark color={colors.white()} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogContent}>{truncateText(item.content, 12)}</Text>
        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <Clock size={14} color={colors.grey(0.6)} />
            <Text style={styles.cardText}>{item.duration}</Text>
          </View>
          <View style={styles.infoRow}>
            <MessageCircle size={14} color={colors.grey(0.6)} />
            <Text style={styles.cardText}>{item.totalComments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardItem: { backgroundColor: colors.black(0.03), borderRadius: 15, overflow: "hidden", marginBottom: 10 },
  imageWrapper: { position: "relative", width: "100%", height: 145 },
  cardImage: { width: "100%", height: "100%" },
  cardContent: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  textContainer: { paddingHorizontal: 15, paddingVertical: 12, gap: 15 },
  cardInfo: { flexDirection: "row", gap: 20, alignItems: "center" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  cardTitle: { fontFamily: "Pjs-Bold", fontSize: 14, color: colors.white() },
  cardText: { fontSize: 12, fontFamily: "Pjs-Medium", color: colors.grey(0.6) },
  cardIcon: { backgroundColor: colors.white(0.33), padding: 5, borderColor: colors.white(), borderWidth: 0.5, borderRadius: 5, alignSelf: "flex-start" },
  cardCategory: { justifyContent: "flex-end", flex: 1 },
  categoryBadge: { backgroundColor: colors.white(), paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, alignSelf: "flex-start" },
  categoryLabel: { fontSize: 10, fontFamily: "Pjs-SemiBold", color: colors.blue() },
  blogTitle: { fontSize: 16, fontFamily: "Pjs-Bold", color: colors.black() },
  blogContent: { fontSize: 12, lineHeight: 20, fontFamily: "Pjs-Medium", color: colors.grey() },
});