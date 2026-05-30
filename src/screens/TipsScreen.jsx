// src/screens/TipsScreen.jsx - UPGRADED VERSION
import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Mic,
  Wind,
  Disc,
  Volume2,
  BatteryCharging,
  Users,
  Heart,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { colors, spacing, layout, borderRadius, typography } from '../../assets/theme';

const { width } = Dimensions.get('window');

const tipsData = [
  {
    id: '1',
    title: 'Pemanasan Vokal',
    desc: 'Lakukan pemanasan 5-10 menit dengan lip trill, humming, atau sirene suara sebelum mulai bernyanyi.',
    icon: 'mic',
    category: 'Dasar',
    duration: '5-10 menit',
    level: 'Pemula',
  },
  {
    id: '2',
    title: 'Pernapasan Diafragma',
    desc: 'Gunakan pernapasan perut untuk kontrol napas yang lebih baik dan sustain nada panjang.',
    icon: 'wind',
    category: 'Teknik',
    duration: '10 menit',
    level: 'Pemula',
  },
  {
    id: '3',
    title: 'Postur Tubuh Ideal',
    desc: 'Berdiri tegak dengan bahu rileks, kaki selebar bahu, dan dagu sejajar dengan lantai.',
    icon: 'disc',
    category: 'Teknik',
    duration: '5 menit',
    level: 'Pemula',
  },
  {
    id: '4',
    title: 'Hidrasi & Pola Makan',
    desc: 'Minum air putih hangat, hindari kafein, susu, dan makanan pedas sebelum latihan vokal.',
    icon: 'battery',
    category: 'Kesehatan',
    duration: 'Setiap hari',
    level: 'Semua Level',
  },
  {
    id: '5',
    title: 'Jeda & Istirahat',
    desc: 'Istirahat 5-10 menit setiap 30 menit latihan untuk mencegah kelelahan pita suara.',
    icon: 'volume',
    category: 'Kesehatan',
    duration: '5-10 menit',
    level: 'Semua Level',
  },
  {
    id: '6',
    title: 'Rekam & Evaluasi',
    desc: 'Rekam latihanmu untuk mendengar progres dan menemukan area yang perlu ditingkatkan.',
    icon: 'mic',
    category: 'Latihan',
    duration: 'Setiap sesi',
    level: 'Menengah',
  },
  {
    id: '7',
    title: 'Konsistensi Adalah Kunci',
    desc: 'Latihan rutin 15-30 menit setiap hari lebih efektif daripada latihan panjang sekali seminggu.',
    icon: 'users',
    category: 'Motivasi',
    duration: '15-30 menit/hari',
    level: 'Semua Level',
  },
  {
    id: '8',
    title: 'Jaga Kesehatan Pita Suara',
    desc: 'Hindari berteriak, merokok, dan tempat berdebu. Istirahatkan suara saat sakit.',
    icon: 'heart',
    category: 'Kesehatan',
    duration: 'Jangka panjang',
    level: 'Semua Level',
  },
  {
    id: '9',
    title: 'Latihan Artikulasi',
    desc: 'Latihan tongue twisters untuk memperjelas pengucapan kata saat bernyanyi.',
    icon: 'disc',
    category: 'Teknik',
    duration: '5 menit',
    level: 'Pemula',
  },
  {
    id: '10',
    title: 'Kembangkan Vibrato',
    desc: 'Latihan vibrato dengan sustain nada dan variasi tekanan napas secara perlahan.',
    icon: 'sparkles',
    category: 'Advanced',
    duration: '10 menit',
    level: 'Mahir',
  },
];

const getIcon = (iconName, color, size = 24) => {
  switch (iconName) {
    case 'mic': return <Mic color={color} size={size} />;
    case 'wind': return <Wind color={color} size={size} />;
    case 'disc': return <Disc color={color} size={size} />;
    case 'volume': return <Volume2 color={color} size={size} />;
    case 'users': return <Users color={color} size={size} />;
    case 'heart': return <Heart color={color} size={size} />;
    case 'sparkles': return <Sparkles color={color} size={size} />;
    default: return <BatteryCharging color={color} size={size} />;
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Dasar': return colors.green();
    case 'Teknik': return colors.blue();
    case 'Kesehatan': return colors.orange();
    case 'Latihan': return colors.blue();
    case 'Motivasi': return colors.yellow();
    case 'Advanced': return colors.red();
    default: return colors.grey();
  }
};

const getLevelColor = (level) => {
  switch (level) {
    case 'Pemula': return colors.green();
    case 'Menengah': return colors.yellow();
    case 'Mahir': return colors.orange();
    default: return colors.blue();
  }
};

const CategoryBadge = ({ category }) => {
  const color = getCategoryColor(category);
  return (
    <View style={[styles.categoryBadge, { backgroundColor: color + '15' }]}>
      <Text style={[styles.categoryText, { color }]}>{category}</Text>
    </View>
  );
};

const TipCard = ({ title, desc, iconName, category, duration, level, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const levelColor = getLevelColor(level);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.card}>
          <View style={styles.indexContainer}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>

          <View style={styles.iconContainer}>
            {getIcon(iconName, colors.blue(), 28)}
          </View>

          <View style={styles.textContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{title}</Text>
              <CategoryBadge category={category} />
            </View>
            <Text style={styles.cardDesc}>{desc}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Clock size={12} color={colors.grey(0.5)} />
                <Text style={styles.footerText}>{duration}</Text>
              </View>
              <View style={styles.footerDot} />
              <View style={[styles.levelBadge, { backgroundColor: levelColor + '15' }]}>
                <Award size={10} color={levelColor} />
                <Text style={[styles.levelText, { color: levelColor }]}>{level}</Text>
              </View>
            </View>
          </View>

          <ChevronRight size={18} color={colors.grey(0.3)} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CategorySection = ({ title, data, icon: Icon }) => {
  const filteredTips = tipsData.filter(tip => tip.category === title);
  if (filteredTips.length === 0) return null;
  const categoryColor = getCategoryColor(title);

  return (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryTitleContainer}>
          <Icon size={20} color={categoryColor} />
          <Text style={[styles.categoryTitle, { color: categoryColor }]}>
            {title}
          </Text>
        </View>
        <Text style={styles.categoryCount}>{filteredTips.length} tips</Text>
      </View>
      {filteredTips.slice(0, 3).map((tip, idx) => (
        <TipCard key={tip.id} {...tip} index={idx} />
      ))}
      {filteredTips.length > 3 && (
        <TouchableOpacity style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>Lihat semua tips {title} →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function TipsScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const categories = [...new Set(tipsData.map(tip => tip.category))];

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.title}>Tips Vokal</Text>
        <Text style={styles.subtitle}>Tingkatkan kualitas suaramu</Text>
      </Animated.View>

      {/* Featured Tip Banner */}
      <View style={styles.featuredBanner}>
        <View style={styles.featuredIcon}>
          <Sparkles size={32} color={colors.white()} />
        </View>
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>Tip Hari Ini</Text>
          <Text style={styles.featuredText}>
            Lakukan pemanasan 10 menit sebelum latihan vokal untuk hasil maksimal!
          </Text>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Statistics Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{tipsData.length}</Text>
            <Text style={styles.statLabel}>Total Tips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{categories.length}</Text>
            <Text style={styles.statLabel}>Kategori</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>⭐ 4.9</Text>
            <Text style={styles.statLabel}>Rating Tips</Text>
          </View>
        </View>

        {/* Tips by Category */}
        {categories.map((category, idx) => {
          let IconComponent;
          switch (category) {
            case 'Dasar': IconComponent = Mic; break;
            case 'Teknik': IconComponent = Disc; break;
            case 'Kesehatan': IconComponent = Heart; break;
            case 'Latihan': IconComponent = Volume2; break;
            case 'Motivasi': IconComponent = Users; break;
            case 'Advanced': IconComponent = Award; break;
            default: IconComponent = Sparkles;
          }
          return (
            <CategorySection
              key={idx}
              title={category}
              data={tipsData}
              icon={IconComponent}
            />
          );
        })}

        {/* All Tips Button */}
        <TouchableOpacity style={styles.allTipsButton}>
          <Text style={styles.allTipsText}>Lihat Semua Tips Vokal</Text>
          <ChevronRight size={18} color={colors.white()} />
        </TouchableOpacity>

        <View style={{ height: layout.bottomPadding }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey(0.1),
    backgroundColor: colors.white(),
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontFamily: typography.h2.fontFamily,
    color: colors.black(),
  },
  subtitle: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.5),
    marginTop: spacing.xs,
  },
  featuredBanner: {
    flexDirection: 'row',
    backgroundColor: colors.blue(),
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: colors.blue(),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white(0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: typography.body2.fontSize,
    fontFamily: 'Pjs-SemiBold',
    color: colors.white(0.9),
  },
  featuredText: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.white(),
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grey(0.04),
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.h4.fontSize,
    fontFamily: typography.h4.fontFamily,
    color: colors.black(),
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.grey(0.5),
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.grey(0.15),
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryTitle: {
    fontSize: typography.h5.fontSize,
    fontFamily: typography.h5.fontFamily,
  },
  categoryCount: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.5),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white(),
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    gap: spacing.md,
    shadowColor: colors.black(0.05),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: colors.grey(0.08),
  },
  indexContainer: {
    width: 24,
    alignItems: 'center',
  },
  indexText: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.4),
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.blue(0.08),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.body2.fontSize,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  categoryText: {
    fontSize: typography.caption.fontSize,
    fontFamily: 'Pjs-SemiBold',
  },
  cardDesc: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.grey(0.6),
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.grey(0.5),
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.grey(0.3),
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.sm,
    gap: 2,
  },
  levelText: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
  },
  viewMoreButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  viewMoreText: {
    fontSize: typography.body3.fontSize,
    fontFamily: typography.body3.fontFamily,
    color: colors.blue(),
  },
  allTipsButton: {
    flexDirection: 'row',
    backgroundColor: colors.blue(),
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.blue(),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  allTipsText: {
    fontSize: typography.button.fontSize,
    fontFamily: typography.button.fontFamily,
    color: colors.white(),
  },
});