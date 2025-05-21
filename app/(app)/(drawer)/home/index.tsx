import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <>
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/images/agrocinetica/logo.png")}
          style={styles.imageContainer}
          resizeMode="contain"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageContainer: {
    width: width * 0.8,
    height: undefined,
    aspectRatio: 1,
  },
});
