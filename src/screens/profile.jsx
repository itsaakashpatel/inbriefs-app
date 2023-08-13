import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Switch,
  Platform,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getCurrentUser, signOut } from "../utils/currentUser";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { GLOBAL_COLORS } from "../styles/colors";
import firebase from "firebase/app";
import db from "../database/config";
import {
  getFirestore,
  collection,
  getDoc,
  addDoc,
  userDocRef,
  doc,
  setDoc,
} from "firebase/firestore";
import { parse } from "react-native-svg";

// Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
  handleSuccess: (notificationId) => {
    console.log("Success", notificationId);
  },
  handleError: (notificationId, error) => {
    console.log("Failure", notificationId, error);
  },
});

function Profile() {
  const navigation = useNavigation();
  const [user, setUserDetails] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hdImagesEnabled, setHdImagesEnabled] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === "granted") {
      setNotificationsEnabled(true);
    }
  };

  // Fetch User Details from Google eMAIL
  const fetchUserDetails = async () => {
    try {
      const user = await getCurrentUser();
      const parsedUser = JSON.parse(user);
      setUserDetails(parsedUser);
      setHdImagesEnabled(parsedUser.isHdImagesEnabled);
      console.log(
        "🚀 ~ file: profile.jsx:63 ~ fetchUserDetails ~ JSON.parse(user):",
        JSON.parse(user)
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateInFirestore = async () => {
    if (!user) return;
    try {
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "data", user.id);

      await setDoc(
        userDocRef,
        {
          isHdImagesEnabled: !hdImagesEnabled,
        },
        { merge: true }
      );

      const userDetails = await getCurrentUser();
      const parsedUser = JSON.parse(userDetails);
      parsedUser.isHdImagesEnabled = !hdImagesEnabled;

      await AsyncStorage.setItem("userInfo", JSON.stringify(parsedUser));

      console.log("User details updated in Firestore.");
    } catch (error) {
      console.error("Error updating user details in Firestore:", error.message);
    }
  };

  // Handle notification toggle
  const handleNotificationsToggle = async (value) => {
    setNotificationsEnabled((prevState) => !prevState);
    if (!value) {
      cancelNotification();
    } else {
      enableNotification();
    }
  };

  // Schedule Notification
  const enableNotification = async () => {
    const permissions = await Notifications.getPermissionsAsync();
    console.log(permissions);

    //If permission is not granted, ask for permission
    if (!permissions.granted) {
      const request = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
        },
      });
      if (!request.granted) {
        return false;
      }
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "InBriefs News",
        body: "You enabled notifications, thanks!",
        data: { image: require("../assets/logo.png") },
      },
      trigger: {
        seconds: 5,
      },
    });

    if (!id) {
      return false;
    }
  };

  // Cancel Notification
  const cancelNotification = () => {
    console.log("Canceling reminder for", Platform.OS);
    Notifications.dismissAllNotificationsAsync();
  };

  // Handle Logout
  const handleLogout = async () => {
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

  // Toggle HD Images
  const toggleHdImages = async () => {
    setHdImagesEnabled((prevState) => !prevState);
    updateInFirestore();
  };

  //  If no user found
  if (user === null) {
    return <Text>Loading...</Text>;
  }

  // If there is an user
  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* User Details */}
          <View style={styles.userInfoContainer}>
            <Image style={styles.userImg} source={{ uri: user.picture }} />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* Notifications Details */}
          <View style={styles.notificationsContainer}>
            <View style={styles.notificationsRow}>
              <MaterialIcons
                name="notifications"
                size={24}
                color={GLOBAL_COLORS.PRIMARY}
              />
              <Text style={styles.notificationsTitle}>Notifications:</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={() =>
                  handleNotificationsToggle(!notificationsEnabled)
                }
              />
            </View>
          </View>

          {/* HD Images Toggle */}
          <View style={styles.toggleContainer}>
            <MaterialIcons
              name="image"
              size={24}
              color={GLOBAL_COLORS.PRIMARY}
            />
            <Text style={styles.toggleText}>HD Images</Text>
            <Switch
              value={hdImagesEnabled}
              onValueChange={() => toggleHdImages(!hdImagesEnabled)}
            />
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons
                name="logout"
                size={24}
                color="white"
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return <Text>No data</Text>;
}

const styles = StyleSheet.create({
  // Your styles
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  userInfoContainer: {
    alignItems: "center",
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "#000",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 20,
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
  },
  notificationsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  notificationsTitle: {
    fontSize: 16,
    marginRight: 130,
    marginLeft: 10,
  },
  notificationsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },

  // Logout Container
  logoutContainer: {
    alignItems: "center",
    marginTop: 150,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  logoutIcon: {
    marginRight: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  toggleText: {
    fontSize: 16,
    marginRight: 150,
    marginLeft: 10,
  },
});

export default Profile;
