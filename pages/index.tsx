import React from "react";
import {
  Spacer,
  FormControl,
  Box,
  VStack,
  Text,
  Heading,
  AspectRatio,
  Stack,
  Button,
  Input,
  useBoolean,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import Confetti from "react-confetti";

import { proxy, snapshot, useSnapshot } from "valtio";

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

const players = {
  1: {
    id: 1,
    name: "Player-1",
    score: 0,
    history: [],
  },
  2: {
    id: 2,
    name: "Player-2",
    score: 0,
    history: [],
  },
  3: {
    id: 3,
    name: "Player-3",
    score: 0,
    history: [],
  },
};

const history = {
  1: {
    // [gameId]: {
    //   gameName: "King",
    //   orderNo: 1,
    //   scores: [[playerId]: '1', playerName:"Karolis" score:100]
    // },
  },
  2: {},
  3: {},
};

// const playedGames = [{name:'King', scores:[{name:"Edita", score:100},{name:"Karolis", score:100}]}]

const state = proxy({
  games,
  players: {},
  history,
  currentGame: {},
  addPlayer: ({ name }) => {
    const id = Date.now();
    state.players[id] = {
      id,
      name,
      score: 0,
    };
    state.history[id] = {};
  },
  playGame: ({ gameId, playerId }) => {
    const foundGame = state.games[gameId];
    const foundPlayer = state.players[playerId];
    // let response = false;
    // if (window.confirm(`${foundPlayer.name} will play ${foundGame.name}`. Do you wish to continue?)) {
    //   response = true;
    // } else {
    //   response = false;
    // }
    // if (!response) return;
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
  },
});

function useState() {
  return useSnapshot(state);
}

const Home: React.FC = () => {
  const [isOn, { on, off, toggle }] = useBoolean(false);
  const [isPlaying, { on: onPlay, off: onOffPlay }] = useBoolean(false);
  const [{ innerHeight, innerWidth }, setSize] = React.useState({
    innerWidth: 0,
    innerHeight: 0,
  });

  React.useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setSize({ innerHeight, innerWidth });
  }, []);

  return (
    <VStack minH="100vh" bg="gray.100" color="white" py={[10, 20]} px={4}>
      {/* <Confetti width={innerWidth} height={innerHeight} /> */}
      {/* {!isOn && (
        <Heading as="h1" textAlign="center" fontSize={["4xl", "6xl"]}>
          Wellcome to King game
        </Heading>
      )} */}
      <VStack width="full">
        {!isOn && <Welcome on={on} />}
        {isOn && !isPlaying && <AddPlayers onPlay={onPlay} />}
        {isPlaying && <Game />}
      </VStack>
    </VStack>
  );
};

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
    Object.values(scores).reduce((acc, next) => {
      return (acc += next);
    }, 0) * each;

  return Math.round(current);
}

function SelectResult() {
  const snap = useState();
  const [scores, setCount] = React.useState({});

  const handleSelect = (e) => {
    const { name: playerId, value: score } = e.target;
    setCount((prev) => ({ ...prev, [playerId]: +score }));
  };

  const currentCount = React.useMemo(() => {
    return getCurrentResult({ scores, each: snap.currentGame.game.each });
  }, [scores, snap.currentGame.game.each]);

  const isDisabled = currentCount !== snap.currentGame.game.totalPoints;

  const playerList = React.useMemo(() => {
    return Object.values(snap.players);
  }, [snap.players]);

  return (
    <Stack>
      {playerList.map(({ id, name }) => {
        return (
          <HStack key={id} justifyContent="space-between">
            <Box pr={4}>
              <Text m={0}>{name}</Text>
            </Box>
            <Box width={20}>
              <Select name={id} onChange={handleSelect}>
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
    return Object.values(snap.players);
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
  return (
    <Stack width="full" spacing={[4]} direction={["column-reverse", "column-reverse", "row"]}>
      <Box flex={[1, 1, 7]}>
        <PlayersContainer />
      </Box>
      <Box flex={[1, 1, 3]}>
        <Statistics />
      </Box>
    </Stack>
  );
}

function PlayersContainer() {
  const snap = useState();
  const [name, setName] = React.useState("");

  const playerList = React.useMemo(() => {
    return Object.values(snap.players);
  }, [snap.players]);

  const getHistory = React.useCallback(
    ({ id }) => {
      return Object.values(snap.history[id]);
    },
    [snap.history],
  );

  const handleAddPlayer = (e) => {
    snap.addPlayer({ name });
    setName("");
  };

  return (
    <Stack spacing={4} color="gray.900">
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
      <Stack direction={["column", "column", "row"]}>
        <Input bg="white" value={name} onChange={(e) => setName(e.target.value)} />
        <Button colorScheme="pink" onClick={handleAddPlayer}>
          Add Player
        </Button>
      </Stack>
    </Stack>
  );

  function GameButton({ name, gameId, playerId }) {
    const snap = useState();

    const isPlayed = React.useMemo(() => {
      return snap.history[playerId][gameId];
    }, [snap.history, gameId, playerId]);

    return (
      <Button
        isDisabled={!!snap.currentGame?.game}
        key={gameId}
        height={[12, 16]}
        fontSize={["sm", "md"]}
        onClick={() => snap.playGame({ playerId, gameId })}
        bg={isPlayed ? "teal.500" : "gray.100"}
        color={isPlayed ? "white" : "gray.900"}
        _hover={{}}
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
  // return (
  //   <Accordion allowMultiple>
  //     {[0, 0, 0, 0].map((_, index) => {
  //       return (
  //         <AccordionItem key={index}>
  //           <h2>
  //             <AccordionButton>
  //               <Box flex="1" textAlign="left">
  //                 Player {index + 1}
  //               </Box>
  //               <AccordionIcon />
  //             </AccordionButton>
  //           </h2>
  //           <AccordionPanel py={4} px={0}>
  //             <PlayerGame />
  //           </AccordionPanel>
  //         </AccordionItem>
  //       );
  //     })}
  //   </Accordion>
  // );
}

function Welcome({ on }) {
  return (
    <Stack width="full" spacing={4}>
      <AspectRatio maxW="560px" width="full" ratio={6 / 5} rounded="md" overflow="hidden">
        <iframe frameBorder="0" src="https://giphy.com/embed/okLCopqw6ElCDnIhuS" allowFullScreen />
      </AspectRatio>

      <Stack maxW="560px" width="full">
        <Box>
          <Button
            onClick={on}
            fontWeight="black"
            color="gray.900"
            width="full"
            _active={{}}
            size="lg"
            colorScheme="teal"
            height={[12, 16]}
            px={10}
          >
            Start
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}

function AddPlayers({ onPlay }) {
  const [players, setPlayer] = React.useState([]);
  const [playerName, setPlayerName] = React.useState("");

  const addPlayer = () => {
    const obj = { name: playerName };
    setPlayer((prev) => [...prev, obj]);
  };

  const handlePlay = () => {
    onPlay();
  };
  return (
    <Stack width="full" spacing={4}>
      <Stack spacing={4}>
        <PlayerInput label="Player 1 name" />
        <PlayerInput label="Player 2 name" />
        <PlayerInput label="Player 3 name" />
        <PlayerInput label="Player 4 name" />
      </Stack>
      <Box>
        <Button
          onClick={handlePlay}
          fontWeight="black"
          color="gray.900"
          width="full"
          _active={{}}
          size="lg"
          colorScheme="teal"
          height={[12, 16]}
          px={10}
        >
          Play!
        </Button>
      </Box>
    </Stack>
  );
}

function PlayerInput({ label }) {
  return (
    <FormControl id={label}>
      <FormLabel fontWeight="black">{label}</FormLabel>
      <Input
        type="text"
        placeholder="Enter player name"
        _placeholder={{
          color: "gray.600",
        }}
        width="full"
        height={16}
        fontSize="2xl"
        fontWeight="black"
        textAlign="center"
      />
    </FormControl>
  );
}

export default Home;
