// src/components/HeroStats.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Hero, HeroAttribute } from '../domain/rpg';

interface HeroStatsProps {
  hero: Hero;
  onAllocatePoint: (attribute: HeroAttribute) => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  hero,
  onAllocatePoint,
}) => {
  const canSpend = hero.unspentPoints > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Status do Herói</Text>

      <View style={styles.row}>
        <Ionicons name="person-outline" size={18} color="#E5E7EB" />
        <Text style={styles.info}>Nível: {hero.level}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="star-outline" size={18} color="#E5E7EB" />
        <Text style={styles.info}>Pontos disponíveis: {hero.unspentPoints}</Text>
      </View>

      <View style={styles.divider} />

      {/* Força - braço mostrando bíceps */}
      <View style={styles.rowBetween}>
        <View style={styles.attrLabelRow}>
          <MaterialCommunityIcons
            name="arm-flex"
            size={20}
            color="#FACC15"
          />
          <Text style={styles.attrText}>Força: {hero.strength}</Text>
        </View>
        <Button
          title="+"
          onPress={() => onAllocatePoint('strength')}
          disabled={!canSpend}
        />
      </View>

      {/* Inteligência - mantém sparkles */}
      <View style={styles.rowBetween}>
        <View style={styles.attrLabelRow}>
          <Ionicons name="sparkles-outline" size={18} color="#60A5FA" />
          <Text style={styles.attrText}>
            Inteligência: {hero.intelligence}
          </Text>
        </View>
        <Button
          title="+"
          onPress={() => onAllocatePoint('intelligence')}
          disabled={!canSpend}
        />
      </View>

      {/* Vitalidade - agora usa o ícone que era da força (fitness-outline) */}
      <View style={styles.rowBetween}>
        <View style={styles.attrLabelRow}>
          <Ionicons name="fitness-outline" size={18} color="#34D399" />
          <Text style={styles.attrText}>Vitalidade: {hero.vitality}</Text>
        </View>
        <Button
          title="+"
          onPress={() => onAllocatePoint('vitality')}
          disabled={!canSpend}
        />
      </View>

      {!canSpend && (
        <Text style={styles.helper}>
          Complete missões e suba de nível para ganhar mais pontos.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#111827', // card
    borderColor: '#1F2937', // cardBorder
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#F9FAFB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  info: {
    marginLeft: 6,
    color: '#E5E7EB',
  },
  attrLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attrText: {
    marginLeft: 6,
    color: '#E5E7EB',
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 8,
  },
});