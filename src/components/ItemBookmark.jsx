import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Clock, MessageCircle, X } from 'lucide-react-native';
import { colors } from '../../assets/theme';
import { useNavigation } from '@react-navigation/native';

const ItemBookmark = ({ item, onPressRemove }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('LatihanDetail', { latihanId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
      
      <View style={styles.content}>
        <Text style={styles.category}>{item.category || 'Latihan'}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.infoRow}>
          <Clock size={12} color={colors.grey(0.5)} />
          <Text style={styles.infoText}>{item.duration} menit</Text>
          <MessageCircle size={12} color={colors.grey(0.5)} />
          <Text style={styles.infoText}>{item.total_comments || 0}</Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={() => onPressRemove(item.id)} style={styles.removeBtn}>
        <X size={18} color={colors.red()} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white(),
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: colors.black(0.04),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: colors.grey(0.1),
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 10,
    fontFamily: 'Pjs-SemiBold',
    color: colors.blue(),
    backgroundColor: colors.blue(0.08),
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Pjs-Bold',
    color: colors.black(),
    lineHeight: 18,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 11,
    fontFamily: 'Pjs-Medium',
    color: colors.grey(0.5),
  },
  removeBtn: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});

export default ItemBookmark;