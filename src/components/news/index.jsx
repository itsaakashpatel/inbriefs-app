// import React, { useState, useEffect } from "react";
// import { MaterialIcons } from "@expo/vector-icons";
// import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import * as AuthSession from "expo-auth-session";
// import firebase from "firebase/app";
// import db from "../../database/config";
// //import { getCurrentUser } from './'
// // import getCurrentUser from "/src/utils/currentUser";


// function NewsItem({ item }) {

//   const [user, setUserDetails] = useState(null);

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);


//   // Fetch User Details from Google eMAIL
//   const fetchUserDetails = async () => {
//     try {
//       const user = await getCurrentUser();
//       setUserDetails(JSON.parse(user));
//       console.log("Fetched user details:", user);

//       updateFirestore(JSON.parse(user));

//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   const firestore = getFirestore();
//   //const dbCollectionRef = collection(firestore, "bookmarks"); // Corrected this line
//   const dbCollectionRef = collection(firestore, "users", user.id, "bookmarks"); // Create a reference to the user's bookmarks collection


//   const bookMarkArticle = async () => {
//     try {
//       // Add the news item ID to the user's bookmarks collection
//       await addDoc(dbCollectionRef, {
//         newsItemId: item.id,
//         title: item.title,
//         imageUrl: item.image,
//         // Add other fields as needed
//       });

//       console.log("News item bookmarked!");
//     } catch (error) {
//       console.error("Error bookmarking news item: ", error);
//     }
//   };;

//   return (
//     <View style={styles.content} key={item.id}>
//       <Image
//         style={{ width: 80, height: 80, borderRadius: 5, marginRight: 10 }}
//         source={{ uri: item.image }}
//       />
//       <View style={styles.mainText}>
//         <Text>{item.title}</Text>
//       </View>
//       <TouchableOpacity onPress={bookMarkArticle}>
//         <MaterialIcons name="bookmark" size={24} color="black" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     flexDirection: "row",
//     margin: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     paddingBottom: 10,
//   },
//   mainText: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "center",
//   },
// });

// export default NewsItem;


import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import db from "../../database/config"; // Make sure your Firebase configuration is imported here


function NewsItem({ item }) {
  const [user, setUserDetails] = useState(null);
  
  useEffect(() => {
    fetchUserDetails();
  }, [item]);

  const fetchUserDetails = async () => {
    try {

      const user = await getCurrentUser();
      setUserDetails(JSON.parse(user));
      console.log("Fetched user details:", user);
      updateFirestore(JSON.parse(user));

      if (user && user.id) {
        const dbCollectionRef = collection(getFirestore(), "users",user.id,
        "bookmarks"
        );
        updateFirestore(user, dbCollectionRef);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateFirestore = async (user, dbCollectionRef) => {
    const bookMarkArticle = async () => {
      try {
        await addDoc(dbCollectionRef, {
          newsItemId: item.id,
          title: item.title,
          imageUrl: item.image,
        });

        console.log("News item bookmarked!");
      } catch (error) {
        console.error("Error bookmarking news item: ", error);
      }
    };

    // Rest of your existing code here

    return (
      <View style={styles.content} key={item.id}>
        <Image
          style={{ width: 80, height: 80, borderRadius: 5, marginRight: 10 }}
          source={{ uri: item.image }}
        />
        <View style={styles.mainText}>
          <Text>{item.title}</Text>
        </View>
        <TouchableOpacity onPress={bookMarkArticle}>
          <MaterialIcons name="bookmark" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    content: {
      flexDirection: "row",
      margin: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingBottom: 10,
    },
    mainText: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
    },
  });
}


export default NewsItem;
