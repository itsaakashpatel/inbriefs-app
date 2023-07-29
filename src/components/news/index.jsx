import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

function NewsItem({ item }) {
  return (
    <View style={styles.content} key={item.id}>
      <Image
        style={{ width: 80, height: 80, borderRadius: 5, marginRight: 10 }}
        source={{ uri: item.image }}
      />
      <View style={styles.mainText}>
        <Text>{item.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  mainText: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default NewsItem;
