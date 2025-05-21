import React from "react";
import Svg, { Path } from "react-native-svg";

export function ArrowLeftIcon({
  width = 24,
  height = 24,
  color = "black",
  ...props
}) {
  return (
    <Svg viewBox="0 0 24 24" width={width} height={height} {...props}>
      <Path
        fill={color}
        d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"
      />
    </Svg>
  );
}
