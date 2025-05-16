import { useColorScheme } from "@/hooks/useColorScheme.web";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { HeaderButton } from "@react-navigation/elements";
import {
  DrawerActions,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import MenuIcon from "../ui/icons/MenuIcon";

type Props = {
  accessibilityLabel?: string;
  pressColor?: string;
  pressOpacity?: number;
  tintColor?: string;
};

const CustomDrawerToggleButton = ({
  tintColor,
  accessibilityLabel = "Show navigation menu",
  ...rest
}: Props) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const colorScheme = useColorScheme() ?? "light";

  const color = colorScheme === "light" ? "#000" : "#fff";

  return (
    <HeaderButton
      {...rest}
      accessibilityLabel={accessibilityLabel}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <MenuIcon width={24} height={24} color={color} />
    </HeaderButton>
  );
};

export default CustomDrawerToggleButton;

const styles = StyleSheet.create({});
