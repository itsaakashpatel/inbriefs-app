import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import NewsItem from "../components/news";
import NewsItemLoader from "../components/loaders/news-item";
import db from "../database/config";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getCurrentUser } from "../utils/currentUser";
import { NewsItemsLoaderCounts } from "../utils/loaders";
import { useIsFocused } from "@react-navigation/native";

function Bookmarks() {
  const [bookmarkedData, setBookmarkedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchBookmarks();
    }
  }, [isFocused]);

  const fetchBookmarks = async () => {
    try {
      const firestore = getFirestore();
      const currenUserInfo = await getCurrentUser();
      const userObject = JSON.parse(currenUserInfo);

      const userDocRef = doc(firestore, "data", userObject.id);

      //Get userinfo from firestore
      const userDoc = await getDoc(userDocRef);
      // Fetch the saved news documents
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const savedNewsData = userData?.savedNews || [];
        console.log("querySnapshot:", savedNewsData.length);

        // Append the new data to the existing bookmarkedData array
        setBookmarkedData([...savedNewsData]);
        console.log("savedNewsData:", savedNewsData);
      }
    } catch (error) {
      console.error("Error fetching saved news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const itemEventHandler = (item) => {
    //Update the list and remove the item
    setBookmarkedData((prevData) =>
      prevData.filter((newsItem) => newsItem.id !== item.id)
    );
  };

  console.log("RENDERING BOOKMARKS", bookmarkedData.length);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        {NewsItemsLoaderCounts.map((item, index) => (
          <NewsItemLoader key={index} />
        ))}
      </View>
    );
  }

  if (!isLoading && bookmarkedData.length === 0) {
    return (
      <View style={styles.container}>
        {bookmarkedData.length === 0 && <Text>No BookMarks !</Text>}
      </View>
    );
  }

  if (!isLoading && bookmarkedData.length > 0) {
    return (
      <View style={styles.container}>
        <FlatList
          data={bookmarkedData}
          renderItem={({ item }) => (
            <NewsItem
              key={item.id}
              item={item}
              iconType="delete"
              itemEventHandler={itemEventHandler}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={fetchBookmarks}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: 100,
    margin: 10,
  },
  loader: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default React.memo(Bookmarks);
