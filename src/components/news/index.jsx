import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import firebase from "firebase/app";
import db from "../../database/config";

function NewsItem({ item }) {
  const firestore = getFirestore();
  const dbCollectionRef = collection(firestore, "bookmarks"); // Corrected this line

  const bookMarkArticle = async () => {
    try {
      await addDoc(dbCollectionRef, {
        newsItemId: item.id,
        // You can add more fields as needed
      });

      console.log("News item bookmarked!");
    } catch (error) {
      console.error("Error bookmarking news item: ", error);
    }
  };

  if (user === null) {
    return (<Text>Loading...</Text>);
  }

  if (user ==!null) {
    bookMarkArticle();
  }

  return (
    <View style={styles.content} key={item.id}>
      <Image
        style={{ width: 80, height: 80, borderRadius: 5, marginRight: 10 }}
        source={{ uri: item.image }}
      />
      <View style={styles.mainText}>
        <Text>{item.title}</Text>
      </View>
      <TouchableOpacity onPress={bookMarkArticle}>
        <MaterialIcons name="bookmark" size={24} color="black" />
      </TouchableOpacity>
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
