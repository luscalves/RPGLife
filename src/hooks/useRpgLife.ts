// src/hooks/useRpgLife.ts

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Hero,
  Mission,
  INITIAL_HERO,
  gainXp,
  createMission,
  Difficulty,
  DEFAULT_MISSIONS,
  allocatePoint,
  HeroAttribute,
  getMissionXpWithBonus,
} from '../domain/rpg';

import {
  HERO_STORAGE_KEY,
  MISSIONS_STORAGE_KEY,
} from '../domain/storageKeys';

function normalizeHero(stored: any): Hero {
  // Mescla com INITIAL_HERO para garantir todos os campos
  const merged: Hero = {
    ...INITIAL_HERO,
    ...stored,
  };

  // Sanitizar campos numéricos novos
  const fixNumber = (value: any, fallback: number): number => {
    if (typeof value !== 'number') return fallback;
    if (Number.isNaN(value)) return fallback;
    return value;
  };

  merged.strength = fixNumber(stored?.strength, INITIAL_HERO.strength);
  merged.intelligence = fixNumber(stored?.intelligence, INITIAL_HERO.intelligence);
  merged.vitality = fixNumber(stored?.vitality, INITIAL_HERO.vitality);
  merged.unspentPoints = fixNumber(stored?.unspentPoints, INITIAL_HERO.unspentPoints);

  return merged;
}

export function useRpgLife() {
  const [hero, setHero] = useState<Hero>(INITIAL_HERO);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar estado salvo ao iniciar
  useEffect(() => {
    async function loadState() {
      try {
        const [heroJson, missionsJson] = await Promise.all([
          AsyncStorage.getItem(HERO_STORAGE_KEY),
          AsyncStorage.getItem(MISSIONS_STORAGE_KEY),
        ]);

        if (heroJson) {
          const storedHero = JSON.parse(heroJson);
          const normalized = normalizeHero(storedHero);
          setHero(normalized);
        }

        if (missionsJson) {
          setMissions(JSON.parse(missionsJson));
        } else {
          setMissions(DEFAULT_MISSIONS);
        }
      } catch (error) {
        console.log('Error loading state', error);
      } finally {
        setLoading(false);
      }
    }

    loadState();
  }, []);

  // Salvar herói sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(hero)).catch(err =>
      console.log('Error saving hero', err),
    );
  }, [hero]);

  // Salvar missões sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(missions)).catch(
      err => console.log('Error saving missions', err),
    );
  }, [missions]);

  // Concluir missão
  function completeMission(missionId: string) {
    const mission = missions.find(m => m.id === missionId);

    if (!mission || mission.completed) {
      return;
    }

    // Calcula XP com bônus baseado nos atributos
    setHero(prevHero => {
      const xpWithBonus = getMissionXpWithBonus(prevHero, mission);
      return gainXp(prevHero, xpWithBonus);
    });

    // Marca como concluída
    setMissions(prev =>
      prev.map(m =>
        m.id === missionId ? { ...m, completed: true } : m,
      ),
    );
  }

  // Adicionar nova missão
  function addMission(title: string, difficulty: Difficulty) {
    const newMission = createMission(title, difficulty);
    setMissions(prev => [...prev, newMission]);
  }

  // Remover TODAS as missões concluídas
  function clearCompletedMissions() {
    setMissions(prev => prev.filter(m => !m.completed));
  }

  // Resetar TODO o progresso (herói + missões)
  async function resetGame() {
    try {
      await AsyncStorage.multiRemove([HERO_STORAGE_KEY, MISSIONS_STORAGE_KEY]);

      setHero(INITIAL_HERO);
      setMissions(DEFAULT_MISSIONS);
    } catch (error) {
      console.log('Error resetting game', error);
    }
  }

  // Alocar ponto de atributo
  function allocateHeroPoint(attribute: HeroAttribute) {
    setHero(prevHero => allocatePoint(prevHero, attribute));
  }

  return {
    hero,
    missions,
    loading,
    completeMission,
    addMission,
    clearCompletedMissions,
    resetGame,
    allocateHeroPoint,
  };
}