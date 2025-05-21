import { IconProps } from "@/types/icons";
import React from "react";
import Svg, { Path } from "react-native-svg";

export function AddIcon(props: IconProps) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props.width || 24}
      height={props.height || 24}
      {...props}
    >
      <Path
        fill={props.color || "black"}
        d="M20 14h-6v6h-4v-6H4v-4h6V4h4v6h6z"
      />
    </Svg>
  );
}
