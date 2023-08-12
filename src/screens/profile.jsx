import React, { useState, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View, SafeAreaView, Switch, Platform, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser, signOut } from '../utils/currentUser';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { GLOBAL_COLORS } from "../styles/colors";
import firebase from "firebase/app";
import db from "../database/config";
import { getFirestore, collection, getDoc, addDoc, userDocRef, doc, setDoc } from "firebase/firestore";

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
  }
});

function Profile() {
  const navigation = useNavigation();
  const [user, setUserDetails] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hdImagesEnabled, setHdImagesEnabled] = useState(false);

  const containerStyle = {
    ...styles.container,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);


  // Fetch User Details from Google eMAIL
  const fetchUserDetails = async () => {
    try {
      const user = await getCurrentUser();
      setUserDetails(JSON.parse(user));
      console.log("Fetched user details:", user);

      updateFirestore(JSON.parse(user));

    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

   // Update Firestore
//    const updateFirestore = async (user) => {

//   // try {
//   //   const firestore = getFirestore();
//   //   const usersCollectionRef = collection(firestore, "news");
    

//   //   await addDoc(usersCollectionRef, {
//   //     email: user.email,
//   //     id: user.id,
//   //     isNotification: notificationsEnabled,  
//   //     isDarkMode: isDarkMode,   
//   //     isImageLoad: hdImagesEnabled,  //
//   //   });
//   //   console.log("User details updated in Firestore.");
//   // } catch (error) {
//   //   console.error("Error updating user details in Firestore:", error.message);
//   // }

//   try {
//     const firestore = getFirestore();
//     const usersCollectionRef = collection(firestore, "news", user.id);
    

//     await addDoc(usersCollectionRef, {
//       email: user.email,
//       id: user.id,
//       isNotification: notificationsEnabled,  
//       isDarkMode: isDarkMode,   
//       isImageLoad: hdImagesEnabled,  //
//     });
//     console.log("User details updated in Firestore.");
//   } catch (error) {
//     console.error("Error updating user details in Firestore:", error.message);
//   }
// };

const updateFirestore = async (user) => {
  try {
    const firestore = getFirestore();
    const userDocRef = doc(firestore, "News", user.id);

    await setDoc(userDocRef, {
      email: user.email,
      id: user.id,
      isNotification: notificationsEnabled,
        isDarkMode: isDarkMode,
        isImageLoad: hdImagesEnabled,
      newsData: {
        // isNotification: notificationsEnabled,
        // isDarkMode: isDarkMode,
        // isImageLoad: hdImagesEnabled,
        bookmarks: [], // You can initialize bookmarks as an empty array
      },
    });

    console.log("User details updated in Firestore.");
  } catch (error) {
    console.error("Error updating user details in Firestore:", error.message);
  }
};

  // Handle notification toggle
  const handleNotificationsToggle = async () => {
    setNotificationsEnabled(prevState => !prevState);
    if (!reminder) {
      scheduleReminder(); // Correct function name
      await setReminder(true);
    } else {
      cancelReminder();
      await setReminder(false);
    }
    updateFirestore();
  };

  // Schedule Reminder
  const scheduleReminder = async () => {
    console.log("Scheduling reminder for", Platform.OS);
    const permissions = await Notifications.getPermissionsAsync();
    console.log(permissions);
    if (!permissions.granted) {
      const request = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true
        }
      });
      console.log('Request', request);
      if (!request.granted) {
        return false;
      }
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "InBriefs News",
        body: "Check the recent news",
        data: { image: require('../img/keval.png') }
      },
      trigger: {
        seconds: 5,
      }
    });
    if (!id) {
      return false;
    }
  };

  // Cancel Reminder
  const cancelReminder = () => {
    console.log("Canceling reminder for", Platform.OS);
    // Add logic to cancel the scheduled reminder if needed
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

  // Toggle theme
  const toggleTheme = async () => {
    setIsDarkMode(prevState => !prevState);
    updateFirestore();
  };

  // Toggle HD Images
  const toggleHdImages = async () => {
    setHdImagesEnabled(prevState => !prevState);
    updateFirestore();
  };

  //  If no user found
  if (user === null) {
    return (<Text>Loading...</Text>);
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
            <View style={styles.notificationsrow}>
              <MaterialIcons name="notifications" size={24} color="black" />
              <Text style={styles.notificationstitle}>Notifications:</Text>
              <Switch style={styles.notificationsswitch} value={reminder} onValueChange={handleNotificationsToggle} />
            </View>
          </View>

          {/* Dark mode Theme */}
          <View style={styles.toggleContainer}>
            <MaterialIcons name="dark_mode" size={24} color="black" />
            <Text style={styles.toggleText}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </View>

          {/* HD Images Toggle */}
          <View style={styles.toggleContainer}>
            <MaterialIcons name="image" size={24} color="black" />
            <Text style={styles.toggleText}>HD Images</Text>
            <Switch value={hdImagesEnabled} onValueChange={toggleHdImages} />
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="white" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }

 

  return <Text>No data</Text>
}

const styles = StyleSheet.create({
  // Your styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#000',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
  },
  notificationscontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  notificationstitle: {
    fontSize: 16,
    marginRight: 130,

  },
  notificationsrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,

  },

  // Logout Container
  logoutContainer: {
    alignItems: 'center',
    marginTop: 150,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  logoutIcon: {
    marginRight: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: "100%",
  },
  toggleText: {
    fontSize: 16,
    marginRight: 150,
  },
  darkContainer: {
    backgroundColor: '#000', // Example color for dark mode background
  },
  darkText: {
    color: '#fff', // Example color for dark mode text
  },
});

export default Profile;