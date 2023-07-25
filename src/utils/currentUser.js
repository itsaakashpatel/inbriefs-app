import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCurrentUser = async () => {
  return await AsyncStorage.getItem("userInfo");
};
