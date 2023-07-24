import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { BASE_TEXT } from "../styles/global";
import Header from "../components/layout/header";
import { getCurrentUser } from "./../utils/currentUser";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <Text style={styles.mainText}>Home</Text>
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
