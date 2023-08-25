import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./../screens/login";
import { GLOBAL_COLORS } from "../styles/colors";
import { StyleSheet } from "react-native";
import FeedScreen from "../screens/feed";
import BookmarksScreen from "../screens/bookmarks";
import AllNewsScreen from "../screens/all-news";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/profile";
import NewsDetailsScreen from "../screens/news-details";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const DashboardNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { ...styles.container },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="dynamic-feed" size={24} color="white" />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="All News"
          component={AllNewsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome name="newspaper-o" size={24} color="white" />
            ),
          }}
        />
        <Tab.Screen
          name="Bookmarks"
          component={BookmarksScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="bookmark" size={24} color="white" />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="supervised-user-circle"
                size={24}
                color="white"
              />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false, // Hide the header on the login screen
          }}
        />

        <Stack.Screen
          name="Home"
          component={DashboardNavigator}
          options={{
            headerShown: false, // Hide the header on the login screen
          }}
        />

        <Stack.Screen
          name="NewsDetails"
          component={NewsDetailsScreen}
          options={{
            title: "News Content",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    color: "#fff",
  },
});

export default AppNavigator;
