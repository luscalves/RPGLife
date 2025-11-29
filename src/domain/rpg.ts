// src/domain/rpg.ts

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Hero {
  level: number;
  currentXp: number;
  xpToNextLevel: number;

  // Atributos do herói
  strength: number;       // Força
  intelligence: number;   // Inteligência
  vitality: number;       // Vitalidade

  // Pontos para distribuir
  unspentPoints: number;
}

export interface Mission {
  id: string;
  title: string;
  difficulty: Difficulty;
  xpReward: number; // XP base
  completed: boolean;
}

// Estado inicial do herói
export const INITIAL_HERO: Hero = {
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
  strength: 1,
  intelligence: 1,
  vitality: 1,
  unspentPoints: 0,
};

// Regras de XP por dificuldade (base)
export function getXpRewardByDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 10;
    case 'medium':
      return 25;
    case 'hard':
      return 50;
    default:
      return 0;
  }
}

// Criação de missão
export function createMission(title: string, difficulty: Difficulty): Mission {
  return {
    id: String(Date.now()),
    title,
    difficulty,
    xpReward: getXpRewardByDifficulty(difficulty),
    completed: false,
  };
}

// Missões padrão iniciais
export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Arrumar o quarto',
    difficulty: 'easy',
    xpReward: getXpRewardByDifficulty('easy'),
    completed: false,
  },
  {
    id: '2',
    title: 'Estudar 30 minutos',
    difficulty: 'medium',
    xpReward: getXpRewardByDifficulty('medium'),
    completed: false,
  },
  {
    id: '3',
    title: 'Fazer exercício físico 20 minutos',
    difficulty: 'hard',
    xpReward: getXpRewardByDifficulty('hard'),
    completed: false,
  },
];

// Lógica de ganhar XP + level up + pontos de atributo
export function gainXp(hero: Hero, gainedXp: number): Hero {
  let currentXp = hero.currentXp + gainedXp;
  let level = hero.level;
  let xpToNextLevel = hero.xpToNextLevel;
  let unspentPoints = hero.unspentPoints;

  const POINTS_PER_LEVEL = 3; // pontos por level up

  while (currentXp >= xpToNextLevel) {
    currentXp -= xpToNextLevel;
    level += 1;
    xpToNextLevel = Math.round(xpToNextLevel * 1.2);
    unspentPoints += POINTS_PER_LEVEL;
  }

  return {
    ...hero,
    level,
    currentXp,
    xpToNextLevel,
    unspentPoints,
  };
}

// Progresso de XP (0..1)
export function getXpProgress(hero: Hero): number {
  if (hero.xpToNextLevel === 0) return 0;
  return hero.currentXp / hero.xpToNextLevel;
}

// Atributos possíveis para alocação
export type HeroAttribute = 'strength' | 'intelligence' | 'vitality';

// Alocar um ponto em um atributo
export function allocatePoint(hero: Hero, attribute: HeroAttribute): Hero {
  if (hero.unspentPoints <= 0) {
    return hero;
  }

  return {
    ...hero,
    [attribute]: hero[attribute] + 1,
    unspentPoints: hero.unspentPoints - 1,
  };
}

// XP efetivo da missão considerando atributos
export function getMissionXpWithBonus(hero: Hero, mission: Mission): number {
  let multiplier = 1;

  // Regra de bônus:
  // - Fácil: Vitalidade
  // - Médio: Inteligência
  // - Difícil: Força
  switch (mission.difficulty) {
    case 'easy':
      multiplier += hero.vitality * 0.02;      // +2% por ponto de VIT
      break;
    case 'medium':
      multiplier += hero.intelligence * 0.02;  // +2% por ponto de INT
      break;
    case 'hard':
      multiplier += hero.strength * 0.02;      // +2% por ponto de STR
      break;
  }

  const xp = mission.xpReward * multiplier;
  return Math.round(xp);
}