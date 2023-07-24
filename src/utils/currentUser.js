import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCurrentUser = async () => {
  const userInfo = await AsyncStorage.getItem("userInfo");
  if (userInfo) {
    return JSON.stringify(userInfo);
  } else {
    return null;
  }
};
