import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { GLOBAL_COLORS } from "../../styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

function Header() {
  const navigation = useNavigation();
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userInfo");
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error in logout", error);
    }
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="settings" size={24} color="white" />
      {/* <Image
        height={20}
        source={require("../../assets/logo.png")}
        resizeMode="contain"
      /> */}
      <Text style={{ color: "white", fontSize: 20 }}>Inbriefs</Text>
      <MaterialIcons
        name="logout"
        size={24}
        color="white"
        onPress={() => logout()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    width: "100%",
    padding: 20,
  },
});

export default Header;