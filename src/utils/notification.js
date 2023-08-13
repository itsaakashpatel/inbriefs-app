import * as Notifications from "expo-notifications";
export const sendNotification = async (msg) => {
  console.log("🚀 ~ file: notification.js:3 ~ sendNotification ~ msg:", msg);
  const permissions = await Notifications.getPermissionsAsync();
  console.log(permissions);

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

  if (permissions.granted) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "InBriefs",
        body: msg,
        data: { image: require("../assets/logo.png") },
      },
      trigger: {
        seconds: 5,
      },
    });

    if (!id) {
      return false;
    }
  }
};
