// src/components/XpBar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Hero, getXpProgress } from '../domain/rpg';

interface XpBarProps {
  hero: Hero;
}

export const XpBar: React.FC<XpBarProps> = ({ hero }) => {
  const progress = getXpProgress(hero);
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Nível {hero.level} • XP {hero.currentXp} / {hero.xpToNextLevel}
      </Text>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
    color: '#E5E7EB', // textPrimary
  },
  barBackground: {
    height: 16,
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#111827', // card
    borderWidth: 1,
    borderColor: '#374151', // cardBorder
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8B5CF6', // accent
  },
  percentage: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF', // textSecondary
  },
});