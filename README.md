Segue um `README.md` pronto para você colocar no GitHub. Depois só ajustar o nome do autor, link do repo e qualquer detalhe que queira personalizar.

````markdown
# RPG Life – Gamificação da Vida Real

Aplicativo mobile em **React Native (Expo)** que transforma tarefas do dia a dia em **missões de RPG**, com **XP**, **níveis** e **atributos de herói**.  
A ideia é tornar atividades chatas mais motivadoras usando mecânicas clássicas de jogos.

---

## 🎯 Objetivo

- Ajudar o usuário a **organizar tarefas** como se fossem **missões**.
- Recompensar o usuário com **XP** ao concluir missões.
- Permitir que o usuário **evolua um herói**, suba de nível e distribua **pontos de atributo**.
- Demonstrar na prática o uso de:
  - React Native + Expo
  - TypeScript
  - AsyncStorage (persistência local)
  - Organização em camada de **domínio + hooks + UI**.

---

## ✨ Funcionalidades

- **Perfil do Herói**
  - Nível (`level`)
  - XP atual (`currentXp`)
  - XP necessário para o próximo nível (`xpToNextLevel`)
  - Atributos:
    - `strength` (Força)
    - `intelligence` (Inteligência)
    - `vitality` (Vitalidade)
  - `unspentPoints`: pontos disponíveis para distribuir ao subir de nível.

- **Missões**
  - Criar missões com:
    - Título
    - Dificuldade: `Fácil`, `Médio`, `Difícil`
  - Cada dificuldade tem um **XP base** diferente.
  - Agrupamento em:
    - Missões ativas
    - Missões concluídas

- **Lógica de RPG**
  - Ao concluir uma missão, o usuário ganha XP.
  - Quando o XP atual passa do limite:
    - Sobe de nível.
    - O XP excedente é carregado para o próximo nível.
    - Aumenta o XP necessário em ~20%.
    - Ganha pontos de atributo para distribuir.
  - Atributos influenciam o **XP ganho**:
    - Missões **Fáceis**: bônus baseado em **Vitalidade**.
    - Missões **Médias**: bônus baseado em **Inteligência**.
    - Missões **Difíceis**: bônus baseado em **Força**.
    - Exemplo: +10% de XP por ponto no atributo correspondente.

- **Interface**
  - Tema **dark RPG**:
    - Fundo escuro
    - Cards para herói e missões
    - Cor de destaque em roxo
  - **Abas**:
    - `Missões`
    - `Herói / Upgrades`
  - Barra de XP com porcentagem e nível.
  - Botões customizados (`RpgButton`) combinando com o tema.
  - Botão para:
    - Remover missões concluídas
    - Resetar o jogo (apaga progresso do herói e missões)

- **Persistência**
  - Todo o estado (herói e missões) é salvo localmente com **AsyncStorage**.
  - Ao fechar e abrir o app, o usuário continua de onde parou.

---

## 🧱 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/) (Expo)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo](https://expo.dev/)
- [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage)
- (Opcional) [`@expo/vector-icons`](https://docs.expo.dev/guides/icons/) para ícones de atributos

---

## 🧠 Modelo de Dados

### Hero

```ts
export interface Hero {
  level: number;
  currentXp: number;
  xpToNextLevel: number;

  strength: number;      // Força
  intelligence: number;  // Inteligência
  vitality: number;      // Vitalidade

  unspentPoints: number; // Pontos livres para distribuir
}
````

### Mission

```ts
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Mission {
  id: string;
  title: string;
  difficulty: Difficulty;
  xpReward: number; // XP base
  completed: boolean;
}
```

---

## ⚙️ Lógica de Jogo (resumo)

### Recompensa por dificuldade

```ts
getXpRewardByDifficulty('easy')   // ex: 10 XP
getXpRewardByDifficulty('medium') // ex: 25 XP
getXpRewardByDifficulty('hard')   // ex: 50 XP
```

### Bônus de XP por atributo

```ts
// Pseudo-código de getMissionXpWithBonus(hero, mission)
base = mission.xpReward

switch (mission.difficulty) {
  case 'easy':
    bonusPercent = hero.vitality * 0.10;      // +10% por ponto de VIT
    break;
  case 'medium':
    bonusPercent = hero.intelligence * 0.10;  // +10% por ponto de INT
    break;
  case 'hard':
    bonusPercent = hero.strength * 0.10;      // +10% por ponto de STR
    break;
}

xpFinal = base * (1 + bonusPercent)
```

### Level Up

* Soma o XP ganho ao XP atual.
* Enquanto `currentXp >= xpToNextLevel`:

  * `currentXp -= xpToNextLevel`
  * `level++`
  * `xpToNextLevel` aumenta em ~20% (escala de dificuldade)
  * `unspentPoints += POINTS_PER_LEVEL` (ex.: 3 pontos por nível)

---

## 💾 Persistência com AsyncStorage

Chaves utilizadas:

```ts
export const HERO_STORAGE_KEY = '@rpg-life:hero';
export const MISSIONS_STORAGE_KEY = '@rpg-life:missions';
```

* Ao carregar o app:

  * Lê `hero` e `missions` das chaves.
  * Usa uma função de **normalização** (`normalizeHero`) para garantir que:

    * Campos novos tenham valores padrão.
    * Campos numéricos não fiquem `NaN` ou `undefined`.
* Ao alterar `hero` ou `missions`:

  * Salva automaticamente com `AsyncStorage.setItem(...)`.

Isso facilita a evolução do modelo de dados sem quebrar estados antigos salvos.

---

## 🏗 Arquitetura

* `src/domain/rpg.ts`

  * Tipos (`Hero`, `Mission`, `Difficulty`, `HeroAttribute`)
  * Funções de negócio:

    * `gainXp`
    * `getXpRewardByDifficulty`
    * `getMissionXpWithBonus`
    * `allocatePoint`
    * `INITIAL_HERO`, `DEFAULT_MISSIONS`

* `src/hooks/useRpgLife.ts`

  * Hook que centraliza:

    * Estado: `hero`, `missions`, `loading`
    * Ações:

      * `completeMission`
      * `addMission`
      * `clearCompletedMissions`
      * `resetGame`
      * `allocateHeroPoint`
  * Integração com AsyncStorage (carregar/salvar).

* `src/screens/HomeScreen.tsx`

  * Abas: `Missões` e `Herói`
  * Usa:

    * `XpBar`
    * `MissionItem`
    * `HeroStats`
    * `RpgButton`
  * Controla formulário de criação de missão e UI de navegação.

* `src/components/`

  * `XpBar.tsx` – barra de XP (nível, XP atual, progresso)
  * `MissionItem.tsx` – card de missão com XP base/atual
  * `HeroStats.tsx` – painel de atributos e distribuição de pontos
  * `RpgButton.tsx` – botão customizado no tema dark RPG

---

## 📁 Estrutura de Pastas (simplificada)

```bash
src/
  components/
    HeroStats.tsx
    MissionItem.tsx
    RpgButton.tsx
    XpBar.tsx

  domain/
    rpg.ts
    storageKeys.ts

  hooks/
    useRpgLife.ts

  screens/
    HomeScreen.tsx

  App.tsx
```

---

## 🚀 Instalação e Execução

Pré-requisitos:

* Node.js
* npm ou yarn
* Expo CLI (opcional, pode usar `npx expo`)

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/rpg-life.git
cd rpg-life
```

### 2. Instalar dependências

```bash
npm install
# ou
yarn
```

### 3. Instalar AsyncStorage (se ainda não estiver no projeto)

```bash
npx expo install @react-native-async-storage/async-storage
```

### 4. (Opcional) Ícones com Expo

```bash
npx expo install @expo/vector-icons
```

### 5. Rodar o projeto

```bash
npx expo start
# ou
npm start
# ou
yarn start
```

Abra no emulador Android/iOS ou no seu dispositivo via aplicativo Expo Go.

---

## 🔮 Próximos Passos (Ideias de Evolução)

* Autenticação e sincronização com backend.
* Missões diárias/semanais com reset automático.
* Sistema de conquistas (ex.: “10 missões difíceis concluídas”).
* Inventário e itens cosméticos para o herói.
* Animações (feedback visual de level up, XP, etc.).
* Modo “hardcore” com penalidades para missões não concluídas.

---

## 👤 Autor

* Lucas Alves de Souza
* contato: lucalves14@hotmail.com
* GitHub: `[luscalves](https://github.com/luscalves)`
