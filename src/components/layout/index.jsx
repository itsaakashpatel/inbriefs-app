import React from "react";
import Header from "./header";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

function Layout({ showHeader = true, showFooter = true, children }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {showHeader && <Header />}

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default Layout;
