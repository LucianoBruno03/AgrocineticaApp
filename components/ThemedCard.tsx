import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedCard({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'backgroundSecondary');
  const shadow = useThemeColor({ light: lightColor, dark: darkColor }, "shadow");

  return <View style={[{ backgroundColor }, shadow, style]} {...otherProps} />;
}
