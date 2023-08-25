import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { GLOBAL_COLORS } from "../../styles/colors";
import { sendNotification } from "../../utils/notification";
import { getCurrentUser } from "../../utils/currentUser";

function NewsItem({
  item,
  iconType = "bookmark",
  itemEventHandler = () => {},
}) {
  const fireStore = getFirestore();
  const navigation = useNavigation();

  const saveArticleHandler = async () => {
    const userObject = await getCurrentUser();
    const user = JSON.parse(userObject);
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
          sendNotification("News item bookmarked!");
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.error("Error updating savedNews:", error);
    }
  };

  const deleteArticleHandler = async () => {
    const userObject = await getCurrentUser();
    const user = JSON.parse(userObject);
    console.log("deleteArticleHandler", user);
    try {
      if (user?.id) {
        const userDocRef = doc(fireStore, "data", user.id);

        //Get existing data
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const savedNewsData = data.savedNews || [];

          //Remove item from array
          const updateData = savedNewsData.filter(
            (newsItem) => newsItem.id !== item.id
          );

          //Update data
          await updateDoc(userDocRef, { savedNews: updateData });
          console.log("News  removed!");
          sendNotification("News removed!");
          itemEventHandler(item);
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.error("Error deleting savedNews:", error);
    }
  };

  const openNewsDetails = () => {
    navigation.navigate("NewsDetails", item);
  };

  return (
    <TouchableOpacity onPress={openNewsDetails}>
      <View style={styles.content} key={item.id}>
        <Image
          style={{ width: 80, height: 80, borderRadius: 5, marginRight: 10 }}
          source={{ uri: item.image }}
        />
        <View style={styles.mainText}>
          <Text>{item.title}</Text>
        </View>
        {iconType === "bookmark" && (
          <TouchableOpacity onPress={() => saveArticleHandler()}>
            <MaterialIcons
              name="bookmark"
              size={24}
              color={GLOBAL_COLORS.PRIMARY}
            />
          </TouchableOpacity>
        )}
        {iconType === "delete" && (
          <TouchableOpacity onPress={() => deleteArticleHandler()}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
