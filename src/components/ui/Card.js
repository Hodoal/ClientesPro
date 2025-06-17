// src/components/ui/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles/theme';

const Card = ({ children, style, padding = 'md', ...props }) => {
  return (
    <View 
      style={[
        styles.card, 
        styles[`padding_${padding}`],
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  padding_sm: {
    padding: spacing.sm
  },
  padding_md: {
    padding: spacing.md
  },
  padding_lg: {
    padding: spacing.lg
  },
  padding_xl: {
    padding: spacing.xl
  }
});

export default Card;