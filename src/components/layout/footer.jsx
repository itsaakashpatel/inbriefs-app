import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { GLOBAL_COLORS } from "../../styles/colors";

function Footer() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    width: "100%",
  },
});

export default Footer;
