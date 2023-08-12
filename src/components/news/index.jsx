import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { getFirestore, getDoc, doc, updateDoc } from "firebase/firestore";

function NewsItem({ item, user }) {
  const fireStore = getFirestore();

  const saveArticleHandler = async () => {
    try {
      if (user?.id) {
        const userDocRef = doc(fireStore, "data", user.id);

        //Get existing data
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const savedNewsData = data.savedNews || [];
          const updateData = [...savedNewsData, { ...item }];

          //Update data
          await updateDoc(userDocRef, { savedNews: updateData });
          console.log("News item bookmarked!");
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.error("Error updating savedNews:", error);
    }
  };

  return (
    <View style={styles.content} key={item.id}>
      <Image
        style={{ width: 80, height: 80, borderRadius: 5, marginRight: 10 }}
        source={{ uri: item.image }}
      />
      <View style={styles.mainText}>
        <Text>{item.title}</Text>
      </View>
      <TouchableOpacity onPress={() => saveArticleHandler()}>
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
