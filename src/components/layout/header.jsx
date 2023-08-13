import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { GLOBAL_COLORS } from "../../styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as AuthSession from "expo-auth-session";

function Header() {
  const navigation = useNavigation();
  const logout = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");

    if (JSON.parse(userInfo)?.accessToken) {
      const token = JSON.parse(userInfo)?.accessToken;
      console.log("🚀 ~ file: header.jsx:15 ~ logout ~ token:", token);
      try {
        await AuthSession.revokeAsync(
          { token },
          { revocationEndpoint: "https://oauth2.googleapis.com/revoke" }
        );
        await AsyncStorage.removeItem("userInfo");
        navigation.navigate("Login");
      } catch (error) {
        console.log("Error in logout", error);
      }
    } else {
      console.log("ELSE");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={{ width: 50, height: 50 }}
          source={require("../../assets/logo.png")}
          resizeMode="contain"
        />
        <Text
          style={{
            color: "white",
            fontSize: 20,
            marginLeft: 20,
            fontWeight: "bold",
          }}
        >
          Inbriefs
        </Text>
      </View>
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
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Header;
