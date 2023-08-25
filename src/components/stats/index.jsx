import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { GLOBAL_COLORS } from "../../styles/colors";

const Stats = ({ userId }) => {
  const [userData, setUserData] = useState({
    savedArticles: 0,
    totalAppViews: 20,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      //Fetch user data from firestore
      const db = getFirestore();
      const userRef = doc(db, "data", userId);

      setIsLoading(true);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        console.log("No such document!");
      } else {
        const data = docSnap.data();
        setUserData({
          savedArticles: data.savedNews ? data.savedNews.length : 0,
          totalAppViews: data.totalAppViews ? data.totalAppViews : 25,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.statItem}>
          <Ionicons name="bookmark-outline" size={24} color="black" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Saved Articles</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="eye-outline" size={24} color="black" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Total Page Views</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Ionicons
          name="bookmark-outline"
          size={24}
          color={GLOBAL_COLORS.PRIMARY}
        />
        <Text style={styles.statValue}>{userData.savedArticles}</Text>
        <Text style={styles.statLabel}>Saved Articles</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="eye-outline" size={24} color={GLOBAL_COLORS.PRIMARY} />
        <Text style={styles.statValue}>{userData.totalAppViews}</Text>
        <Text style={styles.statLabel}>Total App Views</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
});

export default Stats;
