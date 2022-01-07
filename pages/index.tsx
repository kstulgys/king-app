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

import { proxy, useSnapshot } from "valtio";

const games = [
  {
    id: 1,
    name: "Tricks+",
    each: 12,
    totalPoints: 120,
    count: 10,
  },
  {
    id: 2,
    name: "Tricks++",
    each: 12,
    totalPoints: 120,
    count: 10,
  },
  {
    id: 3,
    name: "Tricks-",
    each: -4,
    totalPoints: -40,
    count: 10,
  },
  {
    id: 4,
    name: "Hearts",
    each: -5,
    totalPoints: -40,
    count: 8,
  },
  {
    id: 5,
    name: "Queens",
    each: -10,
    totalPoints: -40,
    count: 4,
  },
  {
    id: 6,
    name: "Jacks",
    each: -10,
    totalPoints: -40,
    count: 4,
  },
  {
    id: 7,
    name: "King",
    each: -40,
    totalPoints: -40,
    count: 1,
  },
  {
    id: 8,
    name: "Last 2",
    each: -20,
    totalPoints: -40,
    count: 2,
  },
];

const state = proxy({
  games,
  players: [
    { id: 1, name: "Player-1", score: 0, history: [] },
    { id: 2, name: "Player-2", score: 0, history: [] },
    { id: 3, name: "Player-3", score: 0, history: [] },
  ],
  currentGame: {},
  playGame: ({ gameId, playerId }) => {
    const foundGame = state.games.find(({ id }) => id === gameId);
    // let response = false;
    // if (window.confirm(`Play ${foundGame.name}?`)) {
    //   response = true;
    // } else {
    //   response = false;
    // }
    // if (!response) return;
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    const foundPlayer = state.players[playerIndex];
    state.currentGame = { game: foundGame, player: foundPlayer };
    const playerHistory = state.players[playerIndex].history;
    state.players[playerIndex].history = [...playerHistory, { ...foundGame }];
  },
  submitGame: ({ scores }) => {
    state.players = state.players.map((player) => {
      const score = scores[player.id];
      return { ...player, score: Math.round(player.score + Math.round((score || 0) * state.currentGame.game.each)) };
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

  return (
    <VStack minH="100vh" bg="gray.100" color="white" py={[10, 20]} px={4}>
      {!isOn && (
        <Heading as="h1" textAlign="center" fontSize={["4xl", "6xl"]}>
          Wellcome to King game
        </Heading>
      )}
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

  React.useEffect(() => {}, [scores]);

  const handleSelect = ({ playerId, num }) => {
    console.log({ playerId, num });
    setCount((prev) => ({ ...prev, [playerId]: num }));
  };

  const currentCount = React.useMemo(() => {
    return getCurrentResult({ scores, each: snap.currentGame.game.each });
  }, [scores, snap.currentGame.game.each]);

  const isDisabled = currentCount !== snap.currentGame.game.totalPoints;

  return (
    <Stack>
      {snap.players.map((player) => {
        return (
          <HStack key={player.id}>
            <Box pr={4}>
              <Text m={0}>{player.name}</Text>
            </Box>
            <Box flex={1}>
              <Select onChange={(e) => handleSelect({ playerId: player.id, num: +e.target.value })}>
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
      <Button isDisabled={isDisabled} onClick={() => snap.submitGame({ scores })}>
        Submit {currentCount}/{snap.currentGame.game.totalPoints}
      </Button>
    </Stack>
  );
}

function Statistics() {
  const snap = useState();

  return (
    <Stack p={4} shadow="base" bg="white" rounded="md" color="gray.900" width="full">
      <Text fontWeight="black">Stats</Text>
      <Stack spacing={4}>
        {snap.players.map((player) => {
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
              {snap.currentGame.game.name} ({snap.currentGame.player.name})
            </Text>
            <SelectResult />
          </Stack>
        </Stack>
      ) : (
        <Box>
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
  return (
    <Stack spacing={4} color="gray.900">
      {snap.players.map(({ name, id }) => {
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
                  <Text>Hello</Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
        );
      })}
    </Stack>
  );

  function GameButton({ name, gameId, playerId }) {
    const snap = useState();

    const isPlayed = React.useMemo(() => {
      return snap.players.find(({ id }) => id === playerId)?.history.find(({ id }) => id === gameId);
    }, [snap.players, snap.currentGame, gameId, playerId]);

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

    return (
      <SimpleGrid columns={[2, 2, 4]} spacing={[2, 2, 4]} color="gray.900" width="full">
        {snap.games.map(({ id: gameId, name }) => {
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
