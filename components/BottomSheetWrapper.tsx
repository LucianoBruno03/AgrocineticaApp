import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";

interface BottomSheetWrapperProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  enableSwipeToDismiss?: boolean;
}

export const BottomSheetWrapper: React.FC<BottomSheetWrapperProps> = ({
  isVisible,
  onClose,
  children,
  height = "50%",
  enableSwipeToDismiss = true,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get("window").height;

  // Convert height prop to number if it's a percentage
  const containerHeight =
    typeof height === "string" && height.includes("%")
      ? screenHeight * (parseInt(height) / 100)
      : typeof height === "number"
      ? height
      : screenHeight * 0.5;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableSwipeToDismiss,
      onMoveShouldSetPanResponder: () => enableSwipeToDismiss,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > containerHeight * 0.2) {
          // If dragged more than 20% of the height, close the bottom sheet
          closeBottomSheet();
        } else {
          // Otherwise, snap back to original position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      openBottomSheet();
    }
  }, [isVisible]);

  const openBottomSheet = () => {
    slideAnim.setValue(0);
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: containerHeight,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      height: containerHeight,
      backgroundColor:
        colorScheme === "light"
          ? Colors.light.background
          : Colors.dark.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: "hidden",
    },
    dragIndicator: {
      width: 40,
      height: 4,
      backgroundColor: "#CECECE",
      borderRadius: 2,
      marginVertical: 8,
      alignSelf: "center",
    },
  });

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={closeBottomSheet}
    >
      <TouchableWithoutFeedback onPress={closeBottomSheet}>
        <Animated.View
          style={[styles.modalContainer, { opacity: modalOpacity }]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: slideAnim,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.dragIndicator} />
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
