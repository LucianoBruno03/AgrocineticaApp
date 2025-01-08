import { StyleSheet, Platform, ScrollView, View, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedCard } from '@/components/ThemedCard';
import { useRef } from 'react';
import { Colors } from '../../../constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const scrollToPosition = (y: number) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="play"
          style={styles.headerImage}
        />
      }>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Cards</ThemedText>
      </ThemedView>

      <ThemedView style={styles.cardContainer}>

        <ThemedCard style={styles.card}>
          <ThemedText type="title">1</ThemedText>
        </ThemedCard>

        <ThemedCard style={styles.card}>
          <ThemedText type="title">2</ThemedText>
        </ThemedCard>

        <ThemedCard style={styles.card}>
          <ThemedText type="title">3</ThemedText>
        </ThemedCard>

        <ThemedCard style={styles.card}>
          <ThemedText type="title">4</ThemedText>
        </ThemedCard>
        
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Animated</ThemedText>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <HelloWave /><HelloWave /><HelloWave /><HelloWave />
      </ThemedView>
d
      <View style={{ flex: 1 }}>
      <Button title="Scroll to Top" onPress={scrollToTop} />
      <Button title="Scroll to Bottom" onPress={scrollToBottom} />
      <Button title="Scroll to Position 100}" onPress={() => scrollToPosition(100)} />

      <ScrollView ref={scrollViewRef} style={{height: 200}}>
        <ThemedText style={{ padding: 20 }}>Content 1</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 2</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 3</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 4</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 5</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 6</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 7</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 8</ThemedText>
        <ThemedText style={{ padding: 20 }}>Content 9</ThemedText>
      </ScrollView>
    </View>
    
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  cardContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap',  
    justifyContent: 'space-between', 
  },
  card: {
    width: '49%',
    padding: 12,  
    marginBottom: 10,
    borderRadius: 12,  
  },
});
