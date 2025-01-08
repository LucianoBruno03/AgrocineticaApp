import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";


export const KeyboardView = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAvoidingView
    style={{
      flex: 1,
  
    }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      {children}
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
