import { proxy, useSnapshot } from "valtio";
import { proxyWithComputed } from "valtio/utils";

const games = {
  1: {
    id: 1,
    name: "Tricks+",
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
    name: "Tricks-",
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
      // player id
      [key: string]: {
        // game id
        [key: string]: {
          game: Game;
          // player ids: score
          scores: { [key: string]: number };
        };
      };
    }
  | {};
type Player = { id: string; name: string; score: number };
type Players = { [key: string]: Player } | {};
type Keys = keyof typeof games;
type Game = typeof games[Keys];
type CurrentGame = { player: Player; game: Game } | undefined;

const state = proxyWithComputed(
  {
    games,
    players: {
      1: {
        id: 1,
        name: "Karolis",
        score: 0,
      },
      2: {
        id: 2,
        name: "Edita",
        score: 0,
      },
      3: {
        id: 3,
        name: "Kamile",
        score: 0,
      },
    } as Players,
    history: {
      1: {},
      2: {},
      3: {},
    } as History,
    currentGame: undefined as CurrentGame,
    isScoreTableAvailable: false,
    onAddPlayer: ({ name }) => {
      const id = Date.now();
      state.players[id] = { id, name, score: 0 };
      state.history[id] = {};
    },
    onPlaySelectedGame: (gameId, playerId) => {
      state.currentGame = { player: state.players[playerId], game: state.games[gameId] };
      state.history[playerId][gameId] = { game: state.games[gameId], scores: {} };
    },
    onFinishCurrentGame: () => {
      state.isScoreTableAvailable = true;
    },
    onSubmitCurrentGame: (scores: { [key: string]: number }) => {
      state.history[state.currentGame.player.id][state.currentGame.game.id] = { ...scores };
      Object.entries(scores).forEach(([key, value]) => {
        state.players[key].score += value;
      });
      state.currentGame = undefined;
      state.isScoreTableAvailable = false;
    },
  },
  {
    winner: (snap) => {
      return null;
    },
  },
);

// const state = proxy({
//   isGameStarted: false,
//   games,
//   players: {},
//   history: {},
//   currentGame: {},
//   currentTurm: {},
//   winner: null,
//   startTheGame: () => {
//     state.isGameStarted = true;
//   },
//   addPlayer: ({ name }) => {
//     const id = Date.now();
//     state.players[id] = {
//       id,
//       name,
//       score: 0,
//     };
//     state.history[id] = {};
//   },
//   playSelectedGame: ({ gameId, playerId }) => {
//     const foundGame = state.games[gameId];
//     const foundPlayer = state.players[playerId];
//     let response = false;

//     if (window.confirm(`${foundPlayer.name} will play ${foundGame.name}. Do you wish to continue?`)) {
//       response = true;
//     } else {
//       response = false;
//     }
//     if (!response) return;
//     state.currentTurm = state.players[playerId];
//     state.currentGame = { game: foundGame, player: foundPlayer };
//     const orderNo = Object.values(state.history[playerId]).length + 1;
//     state.history[playerId][gameId] = { gameName: foundGame.name, orderNo, scores: [] };
//   },
//   submitGame: ({ scores, gameId }) => {
//     const playerIds = Object.keys(state.players);
//     playerIds.forEach((playerId) => {
//       const score = scores[playerId] || 0;
//       // @ts-ignore
//       state.players[playerId].score += Math.round(score * state.currentGame.game.each);
//       // @ts-ignore
//       state.history[state.currentGame.player.id][gameId].scores.push({
//         id: playerId,
//         playerName: state.players[playerId].name,
//         score,
//       });
//     });
//     state.currentGame = {};
//     state.checkForWinner();
//   },
//   checkForWinner: () => {
//     const playersCount = Object.keys(state.players).length;
//     const totalPlayedGamesCount = Object.values(state.history).reduce((acc: number, next: number) => {
//       const count = Object.values(next).length;
//       return (acc += count);
//     }, 0);

//     const gamesLength = Math.round(playersCount * Object.keys(games).length);
//     const isGameFinished = gamesLength === totalPlayedGamesCount;

//     if (isGameFinished) {
//       const winner = Object.values(state.players).sort(
//         (a: { score: number }, b: { score: number }) => b.score - a.score,
//       ) as { name: string; score: number }[];

//       const winnerData = {
//         name: winner[0].name,
//         score: winner[0].score,
//       };
//       state.winner = { ...winnerData };
//     } else {
//       const keys = Object.keys(state.players);
//       // @ts-ignore

//       const currentIndex = keys.indexOf(String(state.currentTurm.id));
//       const nextIndex = keys[currentIndex + 1];

//       if (nextIndex) {
//         state.currentTurm = state.players[nextIndex];
//       } else {
//         state.currentTurm = state.players[keys[0]];
//       }
//     }
//   },
// });

export function useStore() {
  return useSnapshot(state);
}
