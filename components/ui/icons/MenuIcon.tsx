import React from "react";
import Svg, { Path } from "react-native-svg";

export default function MenuIcon({
  width = 24,
  height = 24,
  color = "black",
  ...props
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path fill={color} d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
    </Svg>
  );
}
