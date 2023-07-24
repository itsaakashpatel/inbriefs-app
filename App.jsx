import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./src/navigation/app-navigator";

//This is will show flash screen until custom fonts are loaded
// SplashScreen.preventAutoHideAsync();

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Function to load and register the Inter font with fallbacks
    try {
      const loadFonts = async () => {
        await Font.loadAsync({
          "Inter-Regular": require("./src/assets/fonts/Inter-Regular.ttf"),
          "Inter-Bold": require("./src/assets/fonts/Inter-Bold.ttf"),
          "Inter-Extra-Bold": require("./src/assets/fonts/Inter-ExtraBold.ttf"),
        });

        setFontsLoaded(true);
      };

      const checkUserStatus = async () => {
        const userInfo = await AsyncStorage.getItem("userInfo");
        if (Boolean(userInfo)) {
          setIsLoggedIn(true);
        }
      };

      loadFonts();
      checkUserStatus();
    } catch (error) {
      console.log("Error loading fonts", error);
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      //Once fonts are loaded hide splash screen
      await SplashScreen.hideAsync();
      console.log("Splash screen hidden", isLoggedIn);
    }
  }, [setFontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <AppNavigator isLoggedIn={isLoggedIn} />
    </View>
  );
}

//STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
