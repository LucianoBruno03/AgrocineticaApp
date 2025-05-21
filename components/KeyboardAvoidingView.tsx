import { useRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

export const KeyboardLoginView = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <KeyboardAvoidingView
    style={{
      flex: 1,
      backgroundColor: "transparent",
    }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={0}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      {children}
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

export const KeyboardView = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.RefObject<ScrollView>;
}) => {
  const scrollViewRef = ref || useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={30}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ flex: 1 }}
        accessible={false}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }} // Hace que el contenido se expanda
          style={{ backgroundColor: "" }}
          ref={scrollViewRef}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
