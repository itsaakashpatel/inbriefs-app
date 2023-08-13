import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import { BASE_TEXT } from "../styles/global";
import { GLOBAL_COLORS } from "../styles/colors";
import GoogleButton from "../components/buttons/social/google";
import { makeRedirectUri } from "expo-auth-session";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import db from "../database/config";

function Login() {
  const navigation = useNavigation();
  console.log("expoClientId", process.env.EXPO_CLIENT_ID);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.ANDROID_CLIENT_ID,
    iosClientId: process.env.IOS_CLIENT_ID,
    expoClientId: process.env.EXPO_CLIENT_ID,
    // redirectUri: makeRedirectUri({
    //   scheme: "inbriefs",
    //   useProxy: true,
    //   preferLocalhost: true,
    //   native: "inbriefs://redirect",
    // }),
  });

  useEffect(() => {
    logIn();
  }, [response]);

  async function logIn() {
    const userInfo = await AsyncStorage.getItem("userInfo");

    if (!userInfo) {
      if (response?.type === "success") {
        const { authentication } = response;
        await getUserInfo(authentication.accessToken);
      }
    } else {
      console.log("User is already logged in");
      //User is already logged in so navigate to home screen
      navigation.navigate("Home");
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;

    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userInfoResponse = await response.json();
      userInfoResponse.accessToken = token;
      userInfoResponse.isHdImagesEnabled = false;
      //Set data to firestore
      const userRef = doc(db, "data", userInfoResponse.id);

      //Check if user is already stored or not

      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        console.log("User already exists");
        userInfoResponse.isHdImagesEnabled = userDoc.data().isHdImagesEnabled;

        await AsyncStorage.setItem(
          "userInfo",
          JSON.stringify(userInfoResponse)
        );
        //Once user is logged in navigate to home screen
        navigation.navigate("Home");
      } else {
        await setDoc(userRef, {
          id: userInfoResponse.id,
          name: userInfoResponse.name,
          email: userInfoResponse.email,
          isHdImagesEnabled: false,
          savedNews: [],
        });

        await AsyncStorage.setItem(
          "userInfo",
          JSON.stringify(userInfoResponse)
        );
        //Once user is logged in navigate to home screen
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("ERROR!", error);
      //If there is any error then navigate to login screen
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.appNameText}>Inbriefs</Text>
      <Text style={styles.appDescription}>
        A place where you can read news in 100 words...
      </Text>
      <Text style={styles.startedText}>Let's Get started...</Text>
      <GoogleButton
        onPressFunction={promptAsync}
        customStyle={styles.socialLoginButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginHorizontal: 25,
  },
  title: {
    ...BASE_TEXT,
    fontSize: 30,
  },
  appNameText: {
    ...BASE_TEXT,
    color: GLOBAL_COLORS.PRIMARY,
    fontFamily: "Inter-Extra-Bold",
    fontSize: 50,
    fontWeight: "bold",
    marginVertical: 10,
  },
  socialLoginButton: {
    marginVertical: 10,
    paddingHorizontal: 40,
  },
  appDescription: {
    ...BASE_TEXT,
    fontSize: 18,
    textAlign: "left",
  },
  startedText: {
    ...BASE_TEXT,
    fontSize: 20,
    marginTop: 50,
    marginBottom: 20,
  },
});

export default Login;
