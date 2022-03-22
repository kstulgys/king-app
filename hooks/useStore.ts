import { proxy, useSnapshot } from "valtio";

const turkishKing = {};
const frenchKing = {};

const games = {
  1: {
    id: 1,
    name: "Tricks++",
    each: 12,
    totalPoints: 120,
    count: 10,
  },
  2: {
    id: 2,
    name: "Tricks++",
    each: 12,
    totalPoints: 120,
    count: 10,
  },
  3: {
    id: 3,
    name: "Tricks--",
    each: -4,
    totalPoints: -40,
    count: 10,
  },
  4: {
    id: 4,
    name: "Hearts",
    each: -5,
    totalPoints: -40,
    count: 8,
  },
  5: {
    id: 5,
    name: "Queens",
    each: -10,
    totalPoints: -40,
    count: 4,
  },
  6: {
    id: 6,
    name: "Jacks",
    each: -10,
    totalPoints: -40,
    count: 4,
  },
  7: {
    id: 7,
    name: "King",
    each: -40,
    totalPoints: -40,
    count: 1,
  },
  8: {
    id: 8,
    name: "Last 2",
    each: -20,
    totalPoints: -40,
    count: 2,
  },
} as const;

//@ts-ignore
type History =
  | {
      [key: string]: {}[];
    }
  | {};
type Player = { id: string; name: string; score: number };
type Players = { [key: string]: Player } | {};
type Keys = keyof typeof games;
type Game = typeof games[Keys];
type CurrentGame = { player: Player; game?: Game } | undefined;

const state = proxy({
  games,
  winner: undefined as Player,
  hasStarted: false,
  players: {} as Players,
  history: {} as History,
  currentGame: undefined as CurrentGame,
  isScoreTableAvailable: false,
  onStartGame: (players) => {
    Object.entries(players).forEach(([id, name]) => {
      state.players[id] = { id, name, score: 0 };
      state.history[id] = [];
    });
    state.hasStarted = true;
  },
  onPlaySelectedGame: (gameId, playerId) => {
    state.currentGame = { player: state.players[playerId], game: state.games[gameId] };
    state.history[playerId].push({ game: state.games[gameId], scores: {} });
  },
  onFinishCurrentGame: () => {
    state.isScoreTableAvailable = true;
  },
  onSubmitCurrentGame: (scores: { [key: string]: number }) => {
    const index = state.history[state.currentGame.player.id].findIndex(
      ({ game }) => game.id === state.currentGame.game.id,
    );
    state.history[state.currentGame.player.id][index].scores = { ...scores };
    Object.entries(scores).forEach(([key, value]) => {
      state.players[key].score += value;
    });
    state.isScoreTableAvailable = false;
    let nextPlayer = state.players[+state.currentGame.player.id + 1];
    if (!nextPlayer) nextPlayer = state.players[1];
    state.currentGame = { player: nextPlayer };
    // check for winner
    state.winner = null;
  },
});

export function useStore() {
  return useSnapshot(state);
}
