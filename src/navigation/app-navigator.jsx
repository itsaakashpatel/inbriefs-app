import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./../screens/login";
import { GLOBAL_COLORS } from "../styles/colors";
import { StyleSheet } from "react-native";
import FeedScreen from "../screens/feed";
import SettingsScreen from "../screens/settings";
import TrendingScreen from "../screens/trending";
import AllNewsScreen from "../screens/all-news";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
          name="AllNews"
          component={AllNewsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome name="newspaper-o" size={24} color="white" />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Trending"
          component={TrendingScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="trending-up" size={24} color="white" />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="settings" size={24} color="white" />
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
