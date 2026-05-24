// src/components/ListLatihan.jsx
// Komponen untuk menampilkan daftar latihan vokal (horizontal dan vertikal)

import { ScrollView, View, StyleSheet, Text, ImageBackground, Image } from "react-native";
import { colors } from "../../assets/theme";
import { Mic, Clock, BarChart3, Star } from "lucide-react-native";

// Komponen utama ListLatihan
// Menerima props styles dari App.js untuk konsistensi styling
export default function ListLatihan({ styles }) {
  return (
    <ScrollView>
      <View style={styles.listLatihan}>
        
        {/* Bagian Latihan Horizontal (Rekomendasi Harian) */}
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 15 }}
        >
          {/* Card 1 - Latihan Pernafasan */}
          <View style={{ ...itemHorizontal.cardItem, marginLeft: 24 }}>
            <ImageBackground
              style={itemHorizontal.cardImage}
              resizeMode="cover"
              imageStyle={{ borderRadius: 15 }}
              source={{
                uri: "https://images.unsplash.com/photo-1507676184212-d6b5c5bafd44?w=800", // gambar bernyanyi
              }}
            >
              <View style={itemHorizontal.cardContent}>
                <View style={itemHorizontal.cardInfo}>
                  <Text style={itemHorizontal.cardTitle}>
                    Latihan Pernafasan Diafragma
                  </Text>
                  <Text style={itemHorizontal.cardText}>5 menit • Pemula</Text>
                </View>
                <View>
                  <View style={itemHorizontal.cardIcon}>
                    <Mic color={colors.white()} size={20} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Card 2 - Latihan Vokal Dasar */}
          <View style={itemHorizontal.cardItem}>
            <ImageBackground
              style={itemHorizontal.cardImage}
              resizeMode="cover"
              imageStyle={{ borderRadius: 15 }}
              source={{
                uri: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9b3?w=800",
              }}
            >
              <View style={itemHorizontal.cardContent}>
                <View style={itemHorizontal.cardInfo}>
                  <Text style={itemHorizontal.cardTitle}>
                    Teknik Vokal Dasar
                  </Text>
                  <Text style={itemHorizontal.cardText}>10 menit • Menengah</Text>
                </View>
                <View>
                  <View style={itemHorizontal.cardIcon}>
                    <Mic color={colors.white()} size={20} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Card 3 - Latihan Artikulasi */}
          <View style={itemHorizontal.cardItem}>
            <ImageBackground
              style={itemHorizontal.cardImage}
              resizeMode="cover"
              imageStyle={{ borderRadius: 15 }}
              source={{
                uri: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800",
              }}
            >
              <View style={itemHorizontal.cardContent}>
                <View style={itemHorizontal.cardInfo}>
                  <Text style={itemHorizontal.cardTitle}>
                    Latihan Artikulasi & Diksi
                  </Text>
                  <Text style={itemHorizontal.cardText}>7 menit • Pemula</Text>
                </View>
                <View>
                  <View style={itemHorizontal.cardIcon}>
                    <Mic color={colors.white()} size={20} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Card 4 - Latihan Pitch */}
          <View style={{ ...itemHorizontal.cardItem, marginRight: 24 }}>
            <ImageBackground
              style={itemHorizontal.cardImage}
              resizeMode="cover"
              imageStyle={{ borderRadius: 15 }}
              source={{
                uri: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
              }}
            >
              <View style={itemHorizontal.cardContent}>
                <View style={itemHorizontal.cardInfo}>
                  <Text style={itemHorizontal.cardTitle}>
                    Latihan Pitch & Intonasi
                  </Text>
                  <Text style={itemHorizontal.cardText}>8 menit • Menengah</Text>
                </View>
                <View>
                  <View style={itemHorizontal.cardIcon}>
                    <Mic color={colors.white()} size={20} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>

        {/* Bagian Latihan Vertikal (Daftar Lengkap) */}
        <View style={itemVertical.listCard}>
          
          {/* Item 1 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300",
              }}
            />
            <View style={itemVertical.cardContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ gap: 5, width: "70%" }}>
                  <Text style={itemVertical.cardCategory}>Pernafasan</Text>
                  <Text style={itemVertical.cardTitle}>
                    Pernafasan Perut (Diafragma)
                  </Text>
                </View>
                <Star color={colors.grey(0.6)} size={20} />
              </View>
              <View style={itemVertical.cardInfo}>
                <Clock size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>5 menit</Text>
                <BarChart3 size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>Pemula</Text>
              </View>
            </View>
          </View>

          {/* Item 2 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300",
              }}
            />
            <View style={itemVertical.cardContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ gap: 5, width: "70%" }}>
                  <Text style={itemVertical.cardCategory}>Teknik Vokal</Text>
                  <Text style={itemVertical.cardTitle}>
                    Latihan Vokal Lip Trill
                  </Text>
                </View>
                <Star color={colors.grey(0.6)} size={20} />
              </View>
              <View style={itemVertical.cardInfo}>
                <Clock size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>6 menit</Text>
                <BarChart3 size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>Pemula</Text>
              </View>
            </View>
          </View>

          {/* Item 3 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300",
              }}
            />
            <View style={itemVertical.cardContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ gap: 5, width: "70%" }}>
                  <Text style={itemVertical.cardCategory}>Resonansi</Text>
                  <Text style={itemVertical.cardTitle}>
                    Latihan Resonansi Hidung & Dada
                  </Text>
                </View>
                <Star color={colors.grey(0.6)} size={20} />
              </View>
              <View style={itemVertical.cardInfo}>
                <Clock size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>8 menit</Text>
                <BarChart3 size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>Menengah</Text>
              </View>
            </View>
          </View>

          {/* Item 4 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300",
              }}
            />
            <View style={itemVertical.cardContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ gap: 5, width: "70%" }}>
                  <Text style={itemVertical.cardCategory}>Artikulasi</Text>
                  <Text style={itemVertical.cardTitle}>
                    Latihan Lidah & Bibir
                  </Text>
                </View>
                <Star color={colors.grey(0.6)} size={20} />
              </View>
              <View style={itemVertical.cardInfo}>
                <Clock size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>4 menit</Text>
                <BarChart3 size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>Pemula</Text>
              </View>
            </View>
          </View>

          {/* Item 5 */}
          <View style={itemVertical.cardItem}>
            <Image
              style={itemVertical.cardImage}
              source={{
                uri: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300",
              }}
            />
            <View style={itemVertical.cardContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ gap: 5, width: "70%" }}>
                  <Text style={itemVertical.cardCategory}>Pitch</Text>
                  <Text style={itemVertical.cardTitle}>
                    Latihan Mendengarkan Nada
                  </Text>
                </View>
                <Star color={colors.grey(0.6)} size={20} />
              </View>
              <View style={itemVertical.cardInfo}>
                <Clock size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>10 menit</Text>
                <BarChart3 size={10} color={colors.grey(0.6)} />
                <Text style={itemVertical.cardText}>Mahir</Text>
              </View>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

// Style untuk item vertikal (daftar latihan)
const itemVertical = StyleSheet.create({
  listCard: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 15,
  },
  cardItem: {
    backgroundColor: colors.blue(0.03),
    flexDirection: "row",
    borderRadius: 10,
  },
  cardCategory: {
    color: colors.blue(),
    fontSize: 10,
    fontFamily: "Pjs-SemiBold",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Pjs-Bold",
    color: colors.black(),
  },
  cardText: {
    fontSize: 10,
    fontFamily: "Pjs-Medium",
    color: colors.blue(0.6),
  },
  cardImage: {
    width: 94,
    height: 94,
    borderRadius: 10,
    resizeMode: "cover",
  },
  cardInfo: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  cardContent: {
    gap: 10,
    justifyContent: "space-between",
    paddingRight: 10,
    paddingLeft: 15,
    flex: 1,
    paddingVertical: 10,
  },
});

// Style untuk item horizontal (rekomendasi)
const itemHorizontal = StyleSheet.create({
  cardItem: {
    width: 280,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  cardInfo: {
    justifyContent: "flex-end",
    height: "100%",
    gap: 10,
    maxWidth: "60%",
  },
  cardTitle: {
    fontFamily: "Pjs-Bold",
    fontSize: 14,
    color: colors.white(),
  },
  cardText: {
    fontSize: 10,
    color: colors.white(),
    fontFamily: "Pjs-Medium",
  },
  cardIcon: {
    backgroundColor: colors.white(0.33),
    padding: 5,
    borderColor: colors.white(),
    borderWidth: 0.5,
    borderRadius: 5,
  },
});