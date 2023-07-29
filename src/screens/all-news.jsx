import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import api from "../api";
import { randomUUID } from "expo-crypto";
import NewsItem from "../components/news";
import NewsItemLoader from "../components/loaders/news-item";
import { NewsItemsLoaderCounts } from "../utils/loaders";

function AllNews() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/"); // right now, all news data are coming on this route, 10 news per request
      if (response.status === 200 && response.data?.length > 0) {
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
          renderItem={NewsItem}
          keyExtractor={(item) => item.id}
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
