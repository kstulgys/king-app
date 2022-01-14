import React from "react";
import {
  Box,
  VStack,
  Text,
  AspectRatio,
  Stack,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  SimpleGrid,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import Confetti from "react-confetti";

import { proxy, useSnapshot } from "valtio";

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
};

const state = proxy({
  isGameStarted: false,
  games,
  players: {},
  history: {},
  currentGame: {},
  currentTurm: {},
  winner: null,
  startTheGame: () => {
    state.isGameStarted = true;
    // state.currentTurm = Object.values(state.players)[0];
  },
  addPlayer: ({ name }) => {
    const id = Date.now();
    state.players[id] = {
      id,
      name,
      score: 0,
    };
    state.history[id] = {};
  },
  playSelectedGame: ({ gameId, playerId }) => {
    const foundGame = state.games[gameId];
    const foundPlayer = state.players[playerId];
    // let response = false;

    // if (window.confirm(`${foundPlayer.name} will play ${foundGame.name}. Do you wish to continue?`)) {
    //   response = true;
    // } else {
    //   response = false;
    // }
    // if (!response) return;
    state.currentTurm = state.players[playerId];
    state.currentGame = { game: foundGame, player: foundPlayer };
    const orderNo = Object.values(state.history[playerId]).length + 1;
    state.history[playerId][gameId] = { gameName: foundGame.name, orderNo, scores: [] };
  },
  submitGame: ({ scores, gameId }) => {
    const playerIds = Object.keys(state.players);
    playerIds.forEach((playerId) => {
      const score = scores[playerId] || 0;
      state.players[playerId].score += Math.round(score * state.currentGame.game.each);
      state.history[state.currentGame.player.id][gameId].scores.push({
        id: playerId,
        playerName: state.players[playerId].name,
        score,
      });
    });
    state.currentGame = {};
    state.checkForWinner();
  },
  checkForWinner: () => {
    const playersCount = Object.keys(state.players).length;
    const totalPlayedGamesCount = Object.values(state.history).reduce((acc: number, next: number) => {
      const count = Object.values(next).length;
      return (acc += count);
    }, 0);

    const gamesLength = Math.round(playersCount * Object.keys(games).length);
    const isGameFinished = gamesLength === totalPlayedGamesCount;

    if (isGameFinished) {
      const winner = Object.values(state.players).sort(
        (a: { score: number }, b: { score: number }) => b.score - a.score,
      ) as { name: string; score: number }[];

      const winnerData = {
        name: winner[0].name,
        score: winner[0].score,
      };
      state.winner = { ...winnerData };
    } else {
      const keys = Object.keys(state.players);

      const currentIndex = keys.indexOf(String(state.currentTurm.id));
      const nextIndex = keys[currentIndex + 1];

      if (nextIndex) {
        state.currentTurm = state.players[nextIndex];
      } else {
        state.currentTurm = state.players[keys[0]];
      }
    }
  },
});

function useState() {
  return useSnapshot(state);
}

const Home: React.FC = () => {
  const snap = useState();

  const [{ innerHeight, innerWidth }, setSize] = React.useState({
    innerWidth: 0,
    innerHeight: 0,
  });

  React.useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setSize({ innerHeight, innerWidth });
  }, []);

  return (
    <VStack minH="100vh" bg="gray.100" color="gray.900" py={[10, 20]} px={4}>
      {snap.winner && <Confetti width={innerWidth} height={innerHeight} />}
      <VStack width="full">
        <Game />
        {snap.winner && <VerticallyCenter />}
      </VStack>
    </VStack>
  );
};

function VerticallyCenter() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const snap = useState();

  React.useEffect(() => {
    onOpen();
  }, []);

  return (
    <>
      <Button onClick={onOpen}>Trigger modal</Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>{snap?.winner.name}</Text>
            <AspectRatio maxW="560px" width="full" ratio={6 / 5} rounded="md" overflow="hidden">
              <iframe frameBorder="0" src="https://giphy.com/embed/okLCopqw6ElCDnIhuS" allowFullScreen />
            </AspectRatio>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function PlayerStats({ name, score }) {
  return (
    <HStack isInline justifyContent="space-between">
      <Box>
        <Text m={0}>{name}</Text>
      </Box>
      <Box>
        <Text m={0}>{score}</Text>
      </Box>
    </HStack>
  );
}

function getCurrentResult({ scores, each }) {
  const current =
    Object.values(scores as number[]).reduce((acc, next) => {
      return (acc += next);
    }, 0) * each;

  return Math.round(current);
}

function SelectResult() {
  const snap = useState();

  const [scores, setCount] = React.useState({});

  const handleSelect = ({ playerId, score }) => {
    setCount((prev) => ({ ...prev, [playerId]: +score }));
  };

  const currentCount = React.useMemo(() => {
    return getCurrentResult({ scores, each: snap.currentGame.game.each });
  }, [scores, snap.currentGame.game.each]);

  const isDisabled = currentCount !== snap.currentGame.game.totalPoints;

  React.useEffect(() => {
    if (!isDisabled) return;
    const isLastLeft = Math.round(Object.keys(snap.players).length - Object.keys(scores).length) === 1;
    if (isLastLeft) {
      const playersIds = Object.keys(snap.players);
      const playersWithScoresIds = Object.keys(scores);
      const playerId = playersIds.find((key) => !playersWithScoresIds.includes(key));
      const score = Math.round((snap.currentGame.game.totalPoints - currentCount) / snap.currentGame.game.each);
      handleSelect({ playerId, score });
    }
  }, [scores, isDisabled, snap.players, currentCount, snap.currentGame]);

  const playerList = React.useMemo(() => {
    return Object.values(snap.players);
  }, [snap.players]);

  return (
    <Stack>
      {playerList.map(({ id, name }) => {
        const selectedValue = scores?.[id] || 0;
        return (
          <HStack key={id} justifyContent="space-between">
            <Box pr={4}>
              <Text m={0}>{name}</Text>
            </Box>
            <Box width={20}>
              <Select
                value={selectedValue}
                name={id}
                onChange={(e) => handleSelect({ playerId: e.target.name, score: e.target.value })}
              >
                {Array(snap.currentGame.game.count + 1)
                  .fill(null)
                  .map((_, index) => {
                    return (
                      <option key={index} value={index}>
                        {index}
                      </option>
                    );
                  })}
              </Select>
            </Box>
          </HStack>
        );
      })}
      <Button isDisabled={isDisabled} onClick={() => snap.submitGame({ scores, gameId: snap.currentGame.game.id })}>
        Submit {currentCount}/{snap.currentGame.game.totalPoints}
      </Button>
    </Stack>
  );
}

function Statistics() {
  const snap = useState();

  const playerList = React.useMemo(() => {
    return Object.values(snap.players).sort((a, b) => b.score - a.score);
  }, [snap.players]);

  return (
    <Stack p={4} shadow="base" bg="white" rounded="md" color="gray.900" width="full">
      <Text fontWeight="black">Stats</Text>
      <Stack spacing={4}>
        {playerList.map((player) => {
          return <PlayerStats key={player.id} {...player} />;
        })}
      </Stack>
      {snap.currentGame?.game ? (
        <Stack spacing={4}>
          <Stack>
            <Text m={0} textAlign="center">
              Current game
            </Text>
            <Text m={0} textAlign="center">
              {snap.currentGame.game.name} (by {snap.currentGame.player.name})
            </Text>
            <SelectResult />
          </Stack>
        </Stack>
      ) : (
        <Box pt={4}>
          <Text m={0} textAlign="center" fontWeight="bold">
            Select a game
          </Text>
        </Box>
      )}
    </Stack>
  );
}

function Game() {
  const snap = useState();

  return (
    <Stack width="full" spacing={[4]} direction={["column-reverse", "column-reverse", "row"]}>
      <Box flex={snap.isGameStarted ? [1, 1, 7] : 1}>
        <PlayersContainer />
      </Box>
      <Box display={snap.isGameStarted ? "block" : "none"} flex={[1, 1, 3]}>
        <Statistics />
      </Box>
    </Stack>
  );
}

function PlayersContainer() {
  const snap = useState();

  const playerList = React.useMemo(() => {
    return Object.values(snap.players);
  }, [snap.players]);

  const getHistory = React.useCallback(
    ({ id }) => {
      return Object.values(snap.history[id]);
    },
    [snap.history],
  );

  return (
    <Stack spacing={4} color="gray.900">
      {!snap.isGameStarted && <AddPlayerContainer />}
      {playerList.map(({ name, id }) => {
        return (
          <Stack key={id} shadow="base" bg="white" p={4} rounded="md">
            <Box flex="1" textAlign="left">
              <Text mb={1} fontWeight="black" textAlign="center">
                {name}
              </Text>
            </Box>
            <PlayerGames playerId={id} />
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text m={0} fontSize="sm">
                        Played games stats
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <SimpleGrid columns={playerList.length + 1}>
                    <Box></Box>
                    {playerList.map(({ name, id }) => {
                      return (
                        <Box key={id}>
                          <Text textAlign="center">{name}</Text>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                  {getHistory({ id }).map((item) => {
                    return (
                      <SimpleGrid key={item.gameName} columns={playerList.length + 1}>
                        <Box>
                          <Text>{item.gameName}</Text>
                        </Box>
                        {item.scores.map(({ playerName, score }) => {
                          return (
                            <Box key={playerName}>
                              <Text textAlign="center">{score}</Text>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    );
                  })}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
        );
      })}
    </Stack>
  );

  function AddPlayerContainer() {
    const snap = useState();

    const [name, setName] = React.useState("");
    const ref = React.useRef();

    const handleAddPlayer = ({ name }) => {
      snap.addPlayer({ name });
      setName("");
    };

    const handleInputFocus = () => {
      // ref.current?.focus();
    };

    React.useEffect(() => {
      handleInputFocus();
    }, []);

    const isStartDisabled = React.useMemo(() => {
      return Object.keys(snap.players).length < 2;
    }, [snap.players]);

    const isAddDisabled = React.useMemo(() => {
      return Object.keys(snap.players).length === 4;
    }, [snap.players]);

    return (
      <Stack
        as="form"
        spacing={4}
        onSubmit={(e) => {
          e.preventDefault();
          if (!isAddDisabled) {
            const santized = name.trim();
            if (santized.length > 0) {
              handleAddPlayer({ name: santized });
              handleInputFocus();
            }
          }
        }}
      >
        <Input
          ref={ref}
          placeholder="Enter player name"
          height={12}
          bg="white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <HStack spacing={4}>
          <Button type="submit" isDisabled={isAddDisabled} width="full" height={12} bg="white" shadow="base">
            Add Player
          </Button>
          <Button
            type="submit"
            isDisabled={isStartDisabled}
            width="full"
            height={12}
            onClick={() => {
              snap.startTheGame();
            }}
            bg="white"
            shadow="base"
          >
            Start the game
          </Button>
        </HStack>
      </Stack>
    );
  }

  function GameButton({ name, gameId, playerId }) {
    const snap = useState();

    const isPlayed = !!snap.history[playerId][gameId];

    const shouldBeDisabled = React.useMemo(() => {
      if (!snap.isGameStarted) return true;
      const isFirstToPlay = Object.keys(snap.currentTurm).length === 0;
      if (isFirstToPlay) return false;
      return isPlayed || String(snap.currentTurm?.id) !== String(playerId);
    }, [isPlayed, snap.isGameStarted, snap.currentTurm, playerId]);

    return (
      <Button
        isDisabled={shouldBeDisabled}
        key={gameId}
        height={[12, 16]}
        fontSize={["sm", "md"]}
        onClick={() => snap.playSelectedGame({ playerId, gameId })}
        bg={isPlayed ? "teal.500" : "gray.100"}
        color={isPlayed ? "white" : "gray.900"}
        _hover={{}}
        shadow="base"
      >
        {name}
      </Button>
    );
  }

  function PlayerGames({ playerId }) {
    const snap = useState();

    const gameList = React.useMemo(() => {
      return Object.values(snap.games);
    }, [snap.games]);

    return (
      <SimpleGrid columns={[2, 2, 4]} spacing={[2, 2, 4]} color="gray.900" width="full">
        {gameList.map(({ id: gameId, name }) => {
          return <GameButton key={gameId} gameId={gameId} name={name} playerId={playerId} />;
        })}
      </SimpleGrid>
    );
  }
}

// function Welcome({ on }) {
//   return (
//     <Stack width="full" spacing={4}>
//       <AspectRatio maxW="560px" width="full" ratio={6 / 5} rounded="md" overflow="hidden">
//         <iframe frameBorder="0" src="https://giphy.com/embed/okLCopqw6ElCDnIhuS" allowFullScreen />
//       </AspectRatio>

//       <Stack maxW="560px" width="full">
//         <Box>
//           <Button
//             onClick={on}
//             fontWeight="black"
//             color="gray.900"
//             width="full"
//             _active={{}}
//             size="lg"
//             colorScheme="teal"
//             height={[12, 16]}
//             px={10}
//           >
//             Start
//           </Button>
//         </Box>
//       </Stack>
//     </Stack>
//   );
// }

export default Home;
