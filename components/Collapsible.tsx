import { PropsWithChildren, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { type ViewProps } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedCard } from './ThemedCard';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function Collapsible({ children, title, ...otherProps }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const theme = useColorScheme() ?? 'light';

  const toggleCollapsible = () => {
    setIsOpen((prev) => {
      const newHeight = prev ? 0 : 1;

      Animated.timing(animatedHeight, {
        toValue: newHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();

      return !prev;
    });
  };

  const maxHeight = 200;

  const animatedStyle = {
    height: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, maxHeight],
    }),
    overflow: 'hidden' as 'hidden',
  };

  return (
    <ThemedCard style={styles.Collapsible}>
      <TouchableOpacity
        style={styles.heading}
        onPress={toggleCollapsible}
        activeOpacity={0.8}>

        <ThemedText type="defaultSemiBold">{title}</ThemedText>

        <IconSymbol
          name="chevron.right"
          size={22}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

      </TouchableOpacity>

      <Animated.View style={animatedStyle}>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.View>

    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  Collapsible:{
    borderRadius: 8,
    padding: 12,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'space-between',
  },
  content: {
    backgroundColor: "transparent",
    marginTop: 6,
    marginLeft: 24,
  },
});
