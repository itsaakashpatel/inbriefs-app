import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GLOBAL_COLORS } from "../../styles/colors";

const NewsCard = ({ imageUrl, title, content, url, publishedDate }) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Update header options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.headerLeftContainer}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerLeftText}>Go Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleReadMorePress = () => {
    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: imageUrl,
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.footer}>
        <Text style={styles.publishText}>Published at:</Text>
        <Text style={styles.publishedDate}>{publishedDate}</Text>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleReadMorePress}
        >
          <Text style={styles.readMoreText}>Read More {">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: Dimensions.get("window").width,
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  content: {
    fontSize: 16,
    marginTop: 10,
    padding: 10,
  },
  readMoreButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  readMoreText: {
    color: "blue",
  },
  headerLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  headerLeftText: {
    marginLeft: 5,
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "auto",
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  publishText: {
    marginLeft: 20,
    fontSize: 14,
    color: "white",
  },
  publishedDate: {
    fontSize: 14,
    color: "white",
  },
  readMoreButton: {},
  readMoreText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default NewsCard;
