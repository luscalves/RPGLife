// src/components/MissionItem.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Mission } from '../domain/rpg';
import { RpgButton } from './RpgButton';

interface MissionItemProps {
  mission: Mission;
  onComplete: () => void;
  effectiveXpReward?: number; // XP considerando bônus (opcional)
}

export const MissionItem: React.FC<MissionItemProps> = ({
  mission,
  onComplete,
  effectiveXpReward,
}) => {
  const difficultyLabelMap: Record<Mission['difficulty'], string> = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
  };

  const difficultyColorMap: Record<Mission['difficulty'], string> = {
    easy: '#10B981', // verde
    medium: '#F59E0B', // amarelo
    hard: '#EF4444', // vermelho
  };

  const difficulty = mission.difficulty;
  const difficultyLabel = difficultyLabelMap[difficulty];
  const difficultyColor = difficultyColorMap[difficulty];

  const finalXp = effectiveXpReward ?? mission.xpReward;
  const hasBonus = finalXp !== mission.xpReward;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{mission.title}</Text>

        <View style={[styles.badge, { borderColor: difficultyColor }]}>
          <Text style={[styles.badgeText, { color: difficultyColor }]}>
            {difficultyLabel}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Recompensa base:{' '}
          <Text style={styles.infoHighlight}>{mission.xpReward} XP</Text>
        </Text>

        <Text style={styles.infoText}>
          Recompensa atual:{' '}
          <Text
            style={[
              styles.infoHighlight,
              hasBonus && { color: '#FBBF24' },
            ]}
          >
            {finalXp} XP
          </Text>
        </Text>
      </View>

      <View style={styles.footerRow}>
        {!mission.completed ? (
          <RpgButton
            title="Concluir missão"
            onPress={onComplete}
            variant="primary"
          />
        ) : (
          <Text style={styles.completedText}>✅ Concluída</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontWeight: 'bold',
    color: '#F9FAFB',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#020617',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoHighlight: {
    fontWeight: '600',
    color: '#E5E7EB',
  },
  footerRow: {
    marginTop: 8,
  },
  completedText: {
    color: '#10B981',
    fontWeight: '600',
  },
});