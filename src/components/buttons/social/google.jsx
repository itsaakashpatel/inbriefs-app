import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GLOBAL_COLORS } from "../../../styles/colors";

function GoogleButton({ customStyle, onPressFunction }) {
  return (
    <FontAwesome.Button
      name="google"
      backgroundColor={GLOBAL_COLORS.PRIMARY}
      onPress={() => onPressFunction()}
      size={30}
      style={{ ...customStyle, textAlign: "center" }}
      borderRadius={15}
    >
      Login with Google
    </FontAwesome.Button>
  );
}

export default GoogleButton;
