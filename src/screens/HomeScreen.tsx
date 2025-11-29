// src/screens/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Alert,
  SectionList,
  TouchableOpacity,
} from 'react-native';

import { useRpgLife } from '../hooks/useRpgLife';
import { XpBar } from '../components/XpBar';
import { MissionItem } from '../components/MissionItem';
import { Mission, getMissionXpWithBonus } from '../domain/rpg';
import { HeroStats } from '../components/HeroStats';
import { RpgButton } from '../components/RpgButton';

type MissionSection = {
  title: string;
  type: 'active' | 'completed';
  data: Mission[];
};

export const HomeScreen: React.FC = () => {
  const {
    hero,
    missions,
    loading,
    completeMission,
    addMission,
    clearCompletedMissions,
    resetGame,
    allocateHeroPoint,
  } = useRpgLife();

  // ESTADO DO FORMULÁRIO
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'easy',
  );

  const [lastLevel, setLastLevel] = useState(hero.level);

  // ABA ATIVA: 'missions' ou 'hero'
  const [activeTab, setActiveTab] = useState<'missions' | 'hero'>('missions');

  // Detectar level up
  useEffect(() => {
    if (hero.level > lastLevel) {
      Alert.alert(
        'Level Up!',
        `Parabéns! Você subiu para o nível ${hero.level}.`,
      );
      setLastLevel(hero.level);
    } else if (hero.level < lastLevel) {
      setLastLevel(hero.level);
    }
  }, [hero.level, lastLevel]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#020617',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
        <Text style={{ color: '#E5E7EB', marginTop: 8 }}>
          Carregando seu herói...
        </Text>
      </View>
    );
  }

  function handleAddMission() {
    if (!newTitle.trim()) {
      return;
    }

    addMission(newTitle.trim(), newDifficulty);
    setNewTitle('');
  }

  function handleResetGame() {
    Alert.alert(
      'Resetar jogo',
      'Tem certeza que deseja resetar todo o progresso? Isso não pode ser desfeito.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            resetGame();
          },
        },
      ],
    );
  }

  // Filtrar missões
  const activeMissions = missions.filter(m => !m.completed);
  const completedMissions = missions.filter(m => m.completed);

  const sections: MissionSection[] = [
    {
      title: 'Missões ativas',
      type: 'active',
      data: activeMissions,
    },
    {
      title: 'Missões concluídas',
      type: 'completed',
      data: completedMissions,
    },
  ];

  // Componente do "menu strip"
  const renderTabButton = (label: string, tabKey: 'missions' | 'hero') => {
    const isActive = activeTab === tabKey;

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tabKey)}
        style={{
          flex: 1,
          paddingVertical: 8,
          borderBottomWidth: 2,
          borderBottomColor: isActive ? '#8B5CF6' : '#374151',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: isActive ? 'bold' : 'normal',
            color: isActive ? '#E5E7EB' : '#9CA3AF',
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Seletor de dificuldade com destaque
  const renderDifficultyOption = (
    label: string,
    value: 'easy' | 'medium' | 'hard',
  ) => {
    const isSelected = newDifficulty === value;

    return (
      <TouchableOpacity
        onPress={() => setNewDifficulty(value)}
        style={{
          flex: 1,
          paddingVertical: 8,
          marginHorizontal: 4,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isSelected ? '#8B5CF6' : '#374151',
          backgroundColor: isSelected ? '#111827' : '#020617',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: isSelected ? 'bold' : 'normal',
            color: '#E5E7EB',
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const difficultyLabel = (() => {
    switch (newDifficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return '';
    }
  })();

  return (
    <View style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      {/* Barra de XP sempre visível */}
      <XpBar hero={hero} />

      {/* Menu strip de abas */}
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 16 }}>
        {renderTabButton('Missões', 'missions')}
        {renderTabButton('Herói', 'hero')}
      </View>

      {/* Conteúdo de acordo com a aba ativa */}
      {activeTab === 'missions' && (
        <View style={{ flex: 1 }}>
          {/* Formulário de criação de missão */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 4,
                color: '#E5E7EB',
              }}
            >
              Nova missão
            </Text>

            <TextInput
              placeholder="Título da missão"
              placeholderTextColor="#6B7280"
              value={newTitle}
              onChangeText={setNewTitle}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
                borderColor: '#374151',
                color: '#E5E7EB',
                backgroundColor: '#020617',
              }}
            />

            {/* Seletor de dificuldade com destaque */}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 4,
              }}
            >
              {renderDifficultyOption('Fácil', 'easy')}
              {renderDifficultyOption('Médio', 'medium')}
              {renderDifficultyOption('Difícil', 'hard')}
            </View>

            <Text style={{ marginBottom: 8, color: '#9CA3AF' }}>
              Dificuldade selecionada:{' '}
              <Text style={{ fontWeight: 'bold', color: '#E5E7EB' }}>
                {difficultyLabel}
              </Text>
            </Text>

            <RpgButton
              title="Adicionar missão"
              onPress={handleAddMission}
              variant="primary"
            />
          </View>

          {/* Botão para remover todas as concluídas */}
          <View style={{ marginBottom: 8 }}>
            <RpgButton
              title="Remover missões concluídas"
              onPress={clearCompletedMissions}
              variant="secondary"
            />
          </View>

          {/* Lista seccionada de missões */}
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section }) => (
              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: 8,
                  marginBottom: 4,
                  color: '#E5E7EB',
                }}
              >
                {section.title}
              </Text>
            )}
            renderItem={({ item, section }) => {
              const effectiveXp = getMissionXpWithBonus(hero, item);

              return (
                <MissionItem
                  mission={item}
                  effectiveXpReward={effectiveXp}
                  onComplete={
                    section.type === 'active'
                      ? () => completeMission(item.id)
                      : () => {}
                  }
                />
              );
            }}
            ListEmptyComponent={
              <Text style={{ color: '#9CA3AF' }}>
                Você ainda não tem missões cadastradas.
              </Text>
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </View>
      )}

      {activeTab === 'hero' && (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: 8,
              color: '#E5E7EB',
            }}
          >
            Herói / Upgrades
          </Text>

          <Text style={{ color: '#9CA3AF' }}>
            XP: {hero.currentXp} / {hero.xpToNextLevel}
          </Text>

          {/* Status + upgrades */}
          <HeroStats hero={hero} onAllocatePoint={allocateHeroPoint} />

          {/* Botão de reset de jogo */}
          <View style={{ marginTop: 16 }}>
            <RpgButton
              title="Resetar jogo"
              onPress={handleResetGame}
              variant="danger"
            />
          </View>
        </View>
      )}
    </View>
  );
};