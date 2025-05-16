import { IconProps } from "@/types/icons";
import React from "react";
import Svg, { Path } from "react-native-svg";

export function PackageIcon(props: IconProps) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props.width || 24}
      height={props.height || 24}
      {...props}
    >
      <Path
        fill={props.color || "black"}
        d="M11 19.425v-6.85L5 9.1v6.85zm2 0l6-3.475V9.1l-6 3.475zM12 22.3l-9-5.175V6.875L12 1.7l9 5.175v10.25zm4-13.775l1.925-1.1L12 4l-1.95 1.125zm-4 2.325l1.95-1.125L8.025 6.3l-1.95 1.125z"
      />
    </Svg>
  );
}
