import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

type Props = {};

const EditBusiness = (props: Props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
      }}
    >
      <Text>EditBusiness</Text>
      <Link href={"/new-business"}>Edit Bussisness</Link>
      <Link href={"/"}>Home</Link>
    </View>
  );
};

export default EditBusiness;
