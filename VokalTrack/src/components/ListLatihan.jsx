import { ScrollView, View } from "react-native";
import ListHorizontal from "./ListHorizontal";
import ItemSmall from "./ItemSmall";
import { LatihanList } from "../data/latihan";

export default function ListLatihan({ styles }) {
  const horizontalData = LatihanList.slice(0, 5);
  const verticalData = LatihanList.slice(5);

  return (
    <ScrollView>
      <View style={styles.listLatihan}>
        <ListHorizontal data={horizontalData} />
        <View style={styles.listCard}>
          {verticalData.map((item, index) => (
            <ItemSmall item={item} key={index} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}