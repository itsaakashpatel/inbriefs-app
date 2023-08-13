import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import NewsItem from "../components/news";
import NewsItemLoader from "../components/loaders/news-item";
import db from "../database/config";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getCurrentUser } from "../utils/currentUser";

function Trending() {
  const [bookmarkedData, setBookmarkedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Fetch User Details
  const fetchUserDetails = async () => {
    try {
      const user = await getCurrentUser();
      console.log("1st Time user Details: ", user);
      const userObject = JSON.parse(user);

      const userId = userObject.id;

      setUserDetails(userObject);

      fetchBookmarks(userId);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };



  const fetchBookmarks = async (userId) => {
    console.log("2nd time userId: ", userId);
  
    try {
      // Reference to the user's savedNews array
      // const savedNewsRef = db.collection("data").doc(userId).collection("savedNews");
      // console.log("savedNewsRef:", savedNewsRef);

      const firestore = getFirestore();
      const userDocRef = doc(firestore, "data", userId);

      //Get userinfo from firestore
      const userDoc = await getDoc(userDocRef);
      console.log("querySnapshot:", userDoc);
      // Fetch the saved news documents
      if(userDoc.exists()) {
        const userData = userDoc.data()
        const savedNewsData = userData?.savedNews

        const extractedData = savedNewsData.map(newsItem => ({
          id: newsItem.id, 
          image: newsItem.image,  // Assuming you have an 'id' field in the news item
          description: newsItem.description,
          title: newsItem.title,
        }));
  
        // Append the new data to the existing bookmarkedData array
        setBookmarkedData(prevData => [...prevData, ...extractedData]);
        setIsLoading(false);

        console.log("savedNewsData:", savedNewsData);
        // setBookmarkedData(savedNewsData);
      setIsLoading(false);
      }
      // const querySnapshot = userDoc && userDoc.savedNews;
      
  
      // const bookmarkedNews = [];
      
      // querySnapshot.forEach(doc => {
      //   const savedNewsData = doc.data();
        
      //   // Assuming 'array' is the name of the array in your savedNewsData
      //   const newsArray = savedNewsData.array;
      //   if (newsArray && newsArray.length > 0) {
      //     // Access the first element in the array and its 'description' field
      //     const description = newsArray[0].description;
      //     bookmarkedNews.push(description);
      //   }
      // });
  
      
    } catch (error) {
      console.error("Error fetching saved news:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        {NewsItemsLoaderCounts.map((item, index) => (
          <NewsItemLoader key={index} />
        ))}
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
    {bookmarkedData.length === 0 && <Text>No BookMarks !</Text>}
    {bookmarkedData.length > 0 && (
      <FlatList
        data={bookmarkedData}
        renderItem={({ item }) => <NewsItem item={item} user={user} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={fetchBookmarks}
        onEndReachedThreshold={0.1}
        ListFooterComponent={NewsItemLoader}
      />
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Add a background color to make content visible
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Trending;



