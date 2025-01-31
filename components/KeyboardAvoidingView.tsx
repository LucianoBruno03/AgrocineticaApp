import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

export const KeyboardView = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAvoidingView
    style={{
      flex: 1,
      backgroundColor: "#fff",
    }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={0}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      {children}
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
