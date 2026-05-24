import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../assets/theme";
import { Image } from "expo-image";
import { Bookmark } from "lucide-react-native";

const ItemHorizontal = ({ item, isBookmarked, onPress }) => {
  return (
    <View style={styles.cardItem}>
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
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.createdAt}</Text>
          </View>
          <View style={styles.cardIcon}>
            <TouchableOpacity onPress={onPress}>
              <Bookmark
                color={colors.white()}
                fill={isBookmarked ? colors.white() : "transparent"}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: { width: 280, position: "relative" },
  cardImage: { width: "100%", height: 200, borderRadius: 15 },
  overlayContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 15, overflow: "hidden" },
  cardContent: { flexDirection: "row", justifyContent: "space-between", padding: 15, flex: 1 },
  cardInfo: { justifyContent: "flex-end", height: "100%", gap: 10, maxWidth: "60%" },
  cardTitle: { fontFamily: "Pjs-Bold", fontSize: 14, color: colors.white(), textShadowColor: colors.black(0.75), textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  cardText: { fontSize: 10, color: colors.white(), fontFamily: "Pjs-Medium" },
  cardIcon: { backgroundColor: colors.white(0.33), padding: 5, borderColor: colors.white(), borderWidth: 0.5, borderRadius: 5 },
});

export default ItemHorizontal;