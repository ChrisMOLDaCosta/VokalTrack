import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Clock, MessageCircle } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";

const ItemSmall = ({ item }) => {
  const navigation = useNavigation();

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
        <View style={{ flexDirection: "row", gap: 30 }}>
          <View style={{ gap: 5, flex: 1 }}>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Clock size={10} color={colors.grey(0.6)} />
          <Text style={styles.cardText}>{item.duration}</Text>
          <MessageCircle size={10} color={colors.grey(0.6)} />
          <Text style={styles.cardText}>{item.totalComments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    backgroundColor: colors.blue(0.03),
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  cardCategory: { color: colors.blue(), fontSize: 10, fontFamily: "Pjs-SemiBold" },
  cardTitle: { fontSize: 14, fontFamily: "Pjs-Bold", color: colors.black() },
  cardText: { fontSize: 10, fontFamily: "Pjs-Medium", color: colors.grey(0.6) },
  cardImage: { width: 94, height: 94, borderRadius: 10 },
  cardInfo: { flexDirection: "row", gap: 5, alignItems: "center" },
  cardContent: { gap: 10, justifyContent: "space-between", paddingRight: 10, paddingLeft: 15, flex: 1, paddingVertical: 10 },
});

export default ItemSmall;