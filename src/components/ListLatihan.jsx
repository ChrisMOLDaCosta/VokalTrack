// ListLatihan.jsx - VokalTrack Pro Version
import { ScrollView, View, StyleSheet, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme';
import { Mic, Clock, BarChart3, Star, ChevronRight } from 'lucide-react-native';
import { LatihanList } from '../data/latihan';

export default function ListLatihan({ styles: parentStyles, onLatihanPress }) {
  const navigation = useNavigation();
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const latihanHorizontal = LatihanList.slice(0, 3);
  const latihanVertikal = LatihanList.slice(3, 10);

  // Format level dengan warna yang sesuai
  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'pemula': return colors.green();
      case 'menengah': return colors.yellow();
      case 'mahir': return colors.orange();
      default: return colors.blue();
    }
  };

  const getLevelBgColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'pemula': return colors.green(0.15);
      case 'menengah': return colors.yellow(0.15);
      case 'mahir': return colors.orange(0.15);
      default: return colors.blue(0.15);
    }
  };

  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const filledStars = rating || 4;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          color={i <= filledStars ? colors.yellow() : colors.grey(0.3)}
          fill={i <= filledStars ? colors.yellow() : 'none'}
        />
      );
    }
    return stars;
  };

  const handleCardPress = (item) => {
    if (onLatihanPress) {
      onLatihanPress(item);
    } else {
      navigation.navigate('LatihanDetail', { latihanId: item.id });
    }
  };

  // Render empty state jika tidak ada data
  if (!LatihanList || LatihanList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Mic size={48} color={colors.grey(0.4)} />
        <Text style={styles.emptyTitle}>Belum Ada Latihan</Text>
        <Text style={styles.emptySubtitle}>Mulai tambah latihan vokalmu sekarang!</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={parentStyles.listLatihan}>
        
        {/* Section Title untuk Horizontal List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Rekomendasi Hari Ini</Text>
          <TouchableOpacity>
            <Text style={styles.sectionSeeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll List */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ gap: 16, paddingHorizontal: 20 }}
          decelerationRate="fast"
        >
          {latihanHorizontal.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={horizontalStyles.cardItem}
              activeOpacity={0.85}
              onPress={() => handleCardPress(item)}
            >
              <ImageBackground 
                source={{ uri: item.image }} 
                style={horizontalStyles.cardImage} 
                imageStyle={{ borderRadius: 20 }}
              >
                {/* Gradient Overlay */}
                <View style={horizontalStyles.gradientOverlay} />
                
                <View style={horizontalStyles.cardContent}>
                  <View style={horizontalStyles.cardInfo}>
                    {/* Level Badge */}
                    <View style={[horizontalStyles.levelBadge, { backgroundColor: getLevelBgColor(item.level) }]}>
                      <BarChart3 size={10} color={getLevelColor(item.level)} />
                      <Text style={[horizontalStyles.levelText, { color: getLevelColor(item.level) }]}>
                        {item.level || 'Pemula'}
                      </Text>
                    </View>
                    
                    <Text style={horizontalStyles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    
                    <View style={horizontalStyles.metaRow}>
                      <Clock size={12} color={colors.white(0.8)} />
                      <Text style={horizontalStyles.cardText}>{item.duration || '15 min'}</Text>
                      <View style={horizontalStyles.starsRow}>
                        {renderStars(item.rating)}
                      </View>
                    </View>
                  </View>
                  
                  <View style={horizontalStyles.cardIcon}>
                    <Mic color={colors.white()} size={22} />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Title untuk Vertical List */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>📋 Semua Latihan</Text>
          <TouchableOpacity>
            <ChevronRight size={20} color={colors.grey(0.6)} />
          </TouchableOpacity>
        </View>

        {/* Vertical List */}
        <View style={verticalStyles.listCard}>
          {latihanVertikal.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={verticalStyles.cardItem}
              activeOpacity={0.7}
              onPress={() => handleCardPress(item)}
            >
              <Image 
                source={{ uri: item.image }} 
                style={verticalStyles.cardImage} 
                contentFit="cover"
                transition={200}
              />
              <View style={verticalStyles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ gap: 4, flex: 1 }}>
                    <View style={verticalStyles.categoryBadge}>
                      <Text style={verticalStyles.cardCategory}>{item.category || 'Latihan'}</Text>
                    </View>
                    <Text style={verticalStyles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={verticalStyles.ratingContainer}>
                    {renderStars(item.rating)}
                  </View>
                </View>
                
                <View style={verticalStyles.cardInfo}>
                  <Clock size={10} color={colors.grey(0.6)} />
                  <Text style={verticalStyles.cardText}>{item.duration || '15 min'}</Text>
                  <View style={verticalStyles.dot} />
                  <BarChart3 size={10} color={colors.grey(0.6)} />
                  <Text style={verticalStyles.cardText}>{item.level || 'Pemula'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
  },
  sectionSeeAll: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.blue(),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Pjs-Bold',
    color: colors.grey(0.6),
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.4),
  },
});

const horizontalStyles = StyleSheet.create({
  cardItem: { 
    width: 280,
  },
  cardImage: { 
    width: '100%', 
    height: 220,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16,
    flex: 1,
  },
  cardInfo: { 
    justifyContent: 'flex-end', 
    flex: 1,
    gap: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  levelText: {
    fontSize: 10,
    fontFamily: 'Pjs-SemiBold',
  },
  cardTitle: { 
    fontFamily: 'Pjs-Bold', 
    fontSize: 16, 
    color: colors.white(),
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardText: { 
    fontSize: 11, 
    color: colors.white(0.85), 
    fontFamily: 'Pjs-Medium',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  cardIcon: { 
    backgroundColor: colors.white(0.25), 
    padding: 10, 
    borderColor: colors.white(0.5), 
    borderWidth: 0.5, 
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});

const verticalStyles = StyleSheet.create({
  listCard: { 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    gap: 12,
  },
  cardItem: { 
    backgroundColor: colors.white(),
    flexDirection: 'row', 
    borderRadius: 16,
    padding: 12,
    shadowColor: colors.black(0.05),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryBadge: {
    backgroundColor: colors.blue(0.08),
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cardCategory: { 
    color: colors.blue(), 
    fontSize: 10, 
    fontFamily: 'Pjs-SemiBold',
  },
  cardTitle: { 
    fontSize: 14, 
    fontFamily: 'Pjs-Bold', 
    color: colors.black(),
    lineHeight: 18,
  },
  cardText: { 
    fontSize: 10, 
    fontFamily: 'Pjs-Medium', 
    color: colors.grey(0.6),
  },
  cardImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 12,
    backgroundColor: colors.grey(0.05),
  },
  cardInfo: { 
    flexDirection: 'row', 
    gap: 6, 
    alignItems: 'center',
    marginTop: 6,
  },
  cardContent: { 
    gap: 8, 
    justifyContent: 'space-between', 
    paddingLeft: 12, 
    flex: 1, 
    paddingVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.grey(0.4),
  },
});