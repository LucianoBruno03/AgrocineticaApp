import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export const KeyboardView = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAvoidingView
    style={{
      flex: 1,
      backgroundColor: "#fff",
    }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      {children}
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
