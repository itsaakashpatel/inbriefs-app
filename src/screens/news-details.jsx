import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import NewsCard from "../components/news/card";

const NewsDetailsScreen = ({ route }) => {
  const { image, title, url, content, publishedAt } = route.params; // Adjust the parameter name
  const convertDate = new Date(publishedAt).toLocaleString("en-US", {
    timeZone: "America/New_York", // EST timezone
  });

  return (
    <SafeAreaView style={styles.container}>
      <NewsCard
        imageUrl={image}
        title={title}
        url={url}
        content={content}
        publishedDate={convertDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default NewsDetailsScreen;
