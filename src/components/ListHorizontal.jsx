// src/components/ListHorizontal.jsx - FIXED
import { View, FlatList } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ItemHorizontal from "./ItemHorizontal";

const ListHorizontal = ({ data }) => {
  const navigation = useNavigation();
  const [bookmark, setBookmark] = useState([]);

  const toggleBookmark = (itemId) => {
    if (bookmark.includes(itemId)) {
      setBookmark(bookmark.filter((id) => id !== itemId));
    } else {
      setBookmark([...bookmark, itemId]);
    }
  };

  const handleCardPress = (item) => {
    navigation.navigate("LatihanDetail", { latihanId: item.id });
  };

  const renderItem = ({ item }) => {
    const isBookmarked = bookmark.includes(item.id);
    return (
      <ItemHorizontal
        item={item}
        isBookmarked={isBookmarked}
        onPress={() => toggleBookmark(item.id)}
        onCardPress={() => handleCardPress(item)}
      />
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default ListHorizontal;