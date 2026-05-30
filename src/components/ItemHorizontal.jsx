// src/components/ItemHorizontal.jsx - FIXED
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../assets/theme";
import { Image } from "expo-image";
import { Bookmark, Clock } from "lucide-react-native";

const ItemHorizontal = ({ item, isBookmarked, onPress, onCardPress }) => {
  const durationText = item.duration ? `${item.duration} menit` : "15 menit";

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onCardPress} style={styles.cardItem}>
      <Image
        style={styles.cardImage}
        source={{ uri: item.image }}
        contentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
        transition={300}
      />
      <View style={styles.overlayContainer}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title || "Latihan Vokal"}</Text>
            <View style={styles.durationRow}>
              <Clock size={12} color={colors.white(0.9)} />
              <Text style={styles.cardText}>{durationText}</Text>
            </View>
          </View>
          <View style={styles.cardIcon}>
            <TouchableOpacity onPress={onPress} hitSlop={10}>
              <Bookmark
                color={colors.white()}
                fill={isBookmarked ? colors.white() : "transparent"}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardItem: { width: 280, marginRight: 16, borderRadius: 20, overflow: "hidden" },
  cardImage: { width: "100%", height: 200 },
  overlayContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.35)" },
  cardContent: { flexDirection: "row", justifyContent: "space-between", padding: 15, flex: 1 },
  cardInfo: { justifyContent: "flex-end", height: "100%", gap: 8, maxWidth: "65%" },
  cardTitle: { fontFamily: "Pjs-Bold", fontSize: 14, color: colors.white() },
  durationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardText: { fontSize: 10, color: colors.white(0.9), fontFamily: "Pjs-Medium" },
  cardIcon: { backgroundColor: colors.white(0.25), padding: 6, borderRadius: 8, alignSelf: "flex-start" },
});

export default ItemHorizontal;