import { View, FlatList } from "react-native";
import React, { useState } from "react";
import ItemHorizontal from "./ItemHorizontal";

const ListHorizontal = ({ data }) => {
  const [bookmark, setBookmark] = useState([]);

  const toggleBookmark = (itemId) => {
    if (bookmark.includes(itemId)) {
      setBookmark(bookmark.filter((id) => id !== itemId));
    } else {
      setBookmark([...bookmark, itemId]);
    }
  };

  const renderItem = ({ item }) => {
    const isBookmarked = bookmark.includes(item.id);
    return (
      <ItemHorizontal
        item={item}
        isBookmarked={isBookmarked}
        onPress={() => toggleBookmark(item.id)}
      />
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default ListHorizontal;