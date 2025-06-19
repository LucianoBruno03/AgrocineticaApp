import { IconProps } from "@/types/icons";
import React from "react";
import Svg, { Path } from "react-native-svg";

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props.width || 24}
      height={props.height || 24}
      {...props}
    >
      <Path
        fill={props.color || "#dd1d46"}
        d="M14 16.94v-4H5.08l-.03-2.01H14V6.94l5 5Z"
      />
    </Svg>
  );
}
