// import { PropsWithChildren, useRef, useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Animated,
//   Pressable,
//   LayoutAnimation,
//   Platform,
//   UIManager,
//   View,
// } from "react-native";

// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { IconSymbol } from "@/components/ui/IconSymbol";
// import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { ThemedCard } from "./ThemedCard";

// // Habilitar LayoutAnimation en Android
// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

// export interface CollapsibleProps extends PropsWithChildren {
//   title: string;
//   maxHeight?: number;
//   initiallyOpen?: boolean;
//   onToggle?: (isOpen: boolean) => void;
// }

// export function Collapsible({
//   children,
//   title,
//   maxHeight,
//   initiallyOpen = false,
//   onToggle,
// }: CollapsibleProps) {
//   const [isOpen, setIsOpen] = useState(initiallyOpen);
//   const [contentHeight, setContentHeight] = useState(0);
//   const contentRef = useRef<View>(null);
//   const theme = useColorScheme() ?? "light";

//   const measureContent = () => {
//     if (contentRef.current) {
//       contentRef.current.measure((x, y, width, height) => {
//         setContentHeight(height);
//       });
//     }
//   };

//   useEffect(() => {
//     // Medir después de que el componente se monte
//     const timeout = setTimeout(measureContent, 100);
//     return () => clearTimeout(timeout);
//   }, []);

//   const toggleCollapsible = () => {
//     LayoutAnimation.configureNext(
//       LayoutAnimation.create(
//         300,
//         LayoutAnimation.Types.easeInEaseOut,
//         LayoutAnimation.Properties.opacity
//       )
//     );

//     setIsOpen((prev) => {
//       const newValue = !prev;
//       onToggle?.(newValue);
//       return newValue;
//     });
//   };

//   const finalHeight = maxHeight
//     ? Math.min(contentHeight, maxHeight)
//     : contentHeight;

//   return (
//     <ThemedCard style={styles.collapsible}>
//       <Pressable
//         style={styles.heading}
//         onPress={toggleCollapsible}
//         android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
//       >
//         <ThemedText style={styles.title} type="defaultSemiBold">
//           {title}
//         </ThemedText>

//         <Animated.View
//           style={[
//             styles.iconContainer,
//             {
//               transform: [
//                 {
//                   rotate: isOpen ? "90deg" : "0deg",
//                 },
//               ],
//             },
//           ]}
//         >
//           <IconSymbol
//             name="chevron.right"
//             size={22}
//             weight="medium"
//             color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
//           />
//         </Animated.View>
//       </Pressable>

//       {isOpen && (
//         <View
//           ref={contentRef}
//           style={[styles.content, maxHeight ? { maxHeight } : {}]}
//           onLayout={measureContent}
//         >
//           <ThemedView>{children}</ThemedView>
//         </View>
//       )}
//     </ThemedCard>
//   );
// }

// const styles = StyleSheet.create({
//   collapsible: {
//     borderRadius: 8,
//     padding: 12,
//     width: "100%",
//   },
//   heading: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     minHeight: 48,
//     paddingHorizontal: 4,
//   },
//   title: {
//     flex: 1,
//     marginRight: 8,
//   },
//   iconContainer: {
//     width: 22,
//     height: 22,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   content: {
//     backgroundColor: "transparent",
//     paddingHorizontal: 4,
//     paddingVertical: 8,
//   },
// });
