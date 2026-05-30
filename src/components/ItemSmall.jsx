// src/components/ItemSmall.jsx - FIXED
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Clock, MessageCircle } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";

const ItemSmall = ({ item }) => {
  const navigation = useNavigation();

  // Format duration
  const durationText = item.duration ? `${item.duration} menit` : "15 menit";
  const commentsText = item.totalComments !== undefined ? item.totalComments : 0;

  return (
    <TouchableOpacity
      style={styles.cardItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("LatihanDetail", { latihanId: item.id })}
    >
      <Image
        style={styles.cardImage}
        source={{ uri: item.image }}
        contentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
        transition={200}
      />
      <View style={styles.cardContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 5, flex: 1 }}>
            <Text style={styles.cardCategory}>{item.category || "Latihan"}</Text>
            <Text style={styles.cardTitle}>{item.title || "Latihan Vokal"}</Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Clock size={10} color={colors.grey(0.6)} />
          <Text style={styles.cardText}>{durationText}</Text>
          <MessageCircle size={10} color={colors.grey(0.6)} />
          <Text style={styles.cardText}>{commentsText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    backgroundColor: colors.blue(0.03),
    flexDirection: "row",
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 10,
  },
  cardImage: { width: 80, height: 80, borderRadius: 12 },
  cardContent: { flex: 1, paddingLeft: 12, justifyContent: "space-between", paddingVertical: 4 },
  cardCategory: { color: colors.blue(), fontSize: 10, fontFamily: "Pjs-SemiBold" },
  cardTitle: { fontSize: 14, fontFamily: "Pjs-Bold", color: colors.black() },
  cardInfo: { flexDirection: "row", gap: 6, alignItems: "center", marginTop: 6 },
  cardText: { fontSize: 10, fontFamily: "Pjs-Medium", color: colors.grey(0.6) },
});

export default ItemSmall;