import { ScrollView, View, StyleSheet, Text, ImageBackground, Image } from 'react-native';
import { colors } from '../../assets/theme';
import { Mic, Clock, BarChart3, Star } from 'lucide-react-native';
import { LatihanList } from '../data/latihan';

export default function ListLatihan({ styles: parentStyles }) {
  const latihanHorizontal = LatihanList.slice(0, 3);
  const latihanVertikal = LatihanList.slice(3, 7);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
      <View style={parentStyles.listLatihan}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15, paddingHorizontal: 20 }}>
          {latihanHorizontal.map((item) => (
            <View key={item.id} style={horizontalStyles.cardItem}>
              <ImageBackground source={{ uri: item.image }} style={horizontalStyles.cardImage} imageStyle={{ borderRadius: 15 }}>
                <View style={horizontalStyles.cardContent}>
                  <View style={horizontalStyles.cardInfo}>
                    <Text style={horizontalStyles.cardTitle}>{item.title}</Text>
                    <Text style={horizontalStyles.cardText}>{item.duration} • {item.level}</Text>
                  </View>
                  <View style={horizontalStyles.cardIcon}>
                    <Mic color={colors.white()} size={20} />
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
        <View style={verticalStyles.listCard}>
          {latihanVertikal.map((item) => (
            <View key={item.id} style={verticalStyles.cardItem}>
              <Image source={{ uri: item.image }} style={verticalStyles.cardImage} />
              <View style={verticalStyles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ gap: 5, width: '70%' }}>
                    <Text style={verticalStyles.cardCategory}>{item.category}</Text>
                    <Text style={verticalStyles.cardTitle}>{item.title}</Text>
                  </View>
                  <Star color={colors.grey(0.6)} size={20} />
                </View>
                <View style={verticalStyles.cardInfo}>
                  <Clock size={10} color={colors.grey(0.6)} />
                  <Text style={verticalStyles.cardText}>{item.duration}</Text>
                  <BarChart3 size={10} color={colors.grey(0.6)} />
                  <Text style={verticalStyles.cardText}>{item.level}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const horizontalStyles = StyleSheet.create({
  cardItem: { width: 280 },
  cardImage: { width: '100%', height: 200, borderRadius: 5 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  cardInfo: { justifyContent: 'flex-end', height: '100%', gap: 10, maxWidth: '60%' },
  cardTitle: { fontFamily: 'Pjs-Bold', fontSize: 14, color: colors.white(), textShadowColor: colors.black(0.75), textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  cardText: { fontSize: 10, color: colors.white(), fontFamily: 'Pjs-Medium' },
  cardIcon: { backgroundColor: colors.white(0.33), padding: 5, borderColor: colors.white(), borderWidth: 0.5, borderRadius: 5 },
});

const verticalStyles = StyleSheet.create({
  listCard: { paddingHorizontal: 20, paddingVertical: 10, gap: 15 },
  cardItem: { backgroundColor: colors.blue(0.03), flexDirection: 'row', borderRadius: 10 },
  cardCategory: { color: colors.blue(), fontSize: 10, fontFamily: 'Pjs-SemiBold' },
  cardTitle: { fontSize: 14, fontFamily: 'Pjs-Bold', color: colors.black() },
  cardText: { fontSize: 10, fontFamily: 'Pjs-Medium', color: colors.blue(0.6) },
  cardImage: { width: 94, height: 94, borderRadius: 10, resizeMode: 'cover' },
  cardInfo: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  cardContent: { gap: 10, justifyContent: 'space-between', paddingRight: 10, paddingLeft: 15, flex: 1, paddingVertical: 10 },
});