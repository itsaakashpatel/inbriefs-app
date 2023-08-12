import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import api from "../api";
import { randomUUID } from "expo-crypto";
import NewsItem from "../components/news";
import NewsItemLoader from "../components/loaders/news-item";
import { NewsItemsLoaderCounts } from "../utils/loaders";
import { getCurrentUser } from "../utils/currentUser";

function AllNews() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUserDetails] = useState(null);

  useEffect(() => {
    fetchData();
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const user = await getCurrentUser();
      setUserDetails(JSON.parse(user));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/"); // right now, all news data are coming on this route, 10 news per request
      if (response.status === 200 && response.data?.length > 0) {
        console.log(
          "🚀 ~ file: all-news.jsx:22 ~ fetchData ~ response:",
          response.data.length
        );
        setData((prevState) => [
          ...prevState,
          ...response.data.map((newsItem) => ({
            id: randomUUID(),
            ...newsItem,
          })),
        ]);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
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
      {data.length === 0 && <Text>No news found for today!</Text>}
      {data.length > 0 && (
        <FlatList
          data={data}
          renderItem={({ item }) => <NewsItem item={item} user={user} />}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={fetchData}
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
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    margin: 10,
  },
  loader: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default AllNews;
