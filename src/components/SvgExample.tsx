import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SvgIcon from './ui/SvgIcon';

// Import your SVG files directly
import StarIcon from '../assets/icons/star.svg';

const SvgExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SVG Examples</Text>

      {/* Method 1: Using the SvgIcon wrapper component */}
      <View style={styles.row}>
        <Text>Using SvgIcon wrapper:</Text>
        <SvgIcon SvgComponent={StarIcon} size={30} color="#FFD700" />
      </View>

      {/* Method 2: Using SVG directly */}
      <View style={styles.row}>
        <Text>Using SVG directly:</Text>
        <StarIcon width={30} height={30} fill="#FF6B6B" />
      </View>

      {/* Method 3: Multiple sizes and colors */}
      <View style={styles.row}>
        <Text>Different sizes:</Text>
        <StarIcon width={20} height={20} fill="#4ECDC4" />
        <StarIcon width={25} height={25} fill="#45B7D1" />
        <StarIcon width={30} height={30} fill="#96CEB4" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
});

export default SvgExample;
