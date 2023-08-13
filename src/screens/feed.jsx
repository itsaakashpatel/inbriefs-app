import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Layout from "../components/layout";
import { getCurrentUser } from "../utils/currentUser";
import api from "../api";
import NewsItemLoader from "../components/loaders/news-item";
import { NewsItemsLoaderCounts } from "../utils/loaders";
import NewsItem from "../components/news";
import { randomUUID } from "expo-crypto";
import UserStats from "../components/stats";

export default function Feed() {
  const [userInfo, setUserInfo] = useState(null);
  const [trendingStories, setTrendingStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/"); // right now, all news data are coming on this route, 10 news per request
      if (response.status === 200 && response.data?.length > 0) {
        setTrendingStories((prevState) => [
          ...prevState,
          ...response.data.map((newsItem) => ({
            id: randomUUID(),
            ...newsItem,
          })),
        ]);
      }
    } catch (error) {
      console.log("Error fetching setTrendingStories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getCurrentUser();
      setUserInfo(JSON.parse(userInfo));
    };

    getUserInfo();
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <Text style={styles.mainText}>Hi, {userInfo?.name}</Text>
        {NewsItemsLoaderCounts.splice(0, 5).map((item, index) => (
          <NewsItemLoader key={index} />
        ))}
      </Layout>
    );
  }

  return (
    <Layout>
      <Text style={styles.mainText}>Hi, {userInfo?.name}</Text>
      <UserStats userId={userInfo?.id} />
      <Text style={styles.trendingText}> Trending now!</Text>
      <View style={styles.container}>
        {trendingStories.length === 0 && (
          <Text>No trending news found for today!</Text>
        )}
        {trendingStories.length > 0 && (
          <FlatList
            data={trendingStories}
            renderItem={({ item }) => <NewsItem item={item} user={userInfo} />}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={fetchData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={NewsItemLoader}
          />
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  mainText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#000",
    marginHorizontal: 5,
  },
  trendingText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#000",
    marginTop: 40,
  },
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
