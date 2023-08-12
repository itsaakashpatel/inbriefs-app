import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Layout from "../components/layout";
import { getCurrentUser } from "../utils/currentUser";
import { getFirestore, collection, doc } from "firebase/firestore";

export default function Feed() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getCurrentUser();
      setUserInfo(JSON.parse(userInfo));
    };

    getUserInfo();
  }, []);

  return (
    <Layout>
      <Text style={styles.mainText}>{userInfo?.name}</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#000",
  },
});
