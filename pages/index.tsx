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
} from "@chakra-ui/react";

import { proxy, useSnapshot } from "valtio";

const games = [
  {
    no: 1,
    title: "Tricks+",
    each: 12,
    totalPoints: 120,
    count: 10,
    currentPoints: 0,
    result: [],
  },
  {
    no: 2,
    title: "Tricks++",
    each: 12,
    totalPoints: 120,
    count: 10,
    currentPoints: 0,
    result: [],
  },
  {
    no: 3,
    title: "Tricks-",
    each: -4,
    totalPoints: -40,
    count: 10,
    currentPoints: 0,
    result: [],
  },
  {
    no: 4,
    title: "Hearts",
    each: -5,
    totalPoints: -40,
    count: 8,
    currentPoints: 0,
    result: [],
  },
  {
    no: 5,
    title: "Queens",
    each: -10,
    totalPoints: -40,
    count: 4,
    currentPoints: 0,
    result: [],
  },
  {
    no: 6,
    title: "Jacks",
    each: -10,
    totalPoints: -40,
    count: 4,
    currentPoints: 0,
    result: [],
  },
  {
    no: 7,
    title: "King",
    each: -40,
    totalPoints: -40,
    count: 1,
    currentPoints: 0,
    result: [],
  },
  {
    no: 8,
    title: "Last 2",
    each: -20,
    totalPoints: -40,
    count: 2,
    currentPoints: 0,
    result: [],
  },
];

const initGame = Array(4)
  .fill(null)
  .map((_, index) => ({ ...games, player: `Player ${index + 1}` }));

// You wrap your state
const state = proxy({ game: initGame });

function useState() {
  return useSnapshot(state);
}

const Home: React.FC = () => {
  const [isOn, { on, off, toggle }] = useBoolean(false);
  const [isPlaying, { on: onPlay, off: onOffPlay }] = useBoolean(false);

  return (
    <VStack minH="100vh" bg="gray.900" color="white" py={[10, 20]} px={4}>
      {!isOn && (
        <Heading as="h1" textAlign="center" fontSize={["4xl", "6xl"]}>
          Wellcome to King game
        </Heading>
      )}
      <VStack maxW="560px" width="full">
        {!isOn && <Welcome on={on} />}
        {isOn && !isPlaying && <AddPlayers onPlay={onPlay} />}
        {isPlaying && <Game />}
      </VStack>
    </VStack>
  );
};

function Game() {
  return (
    <Stack width="full">
      <PlayersContainer />
    </Stack>
  );
}

function PlayerGame() {
  return (
    <Grid templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={[2, 4]} color="gray.900">
      {games.map(({ title }) => {
        return (
          <Button key={title} height={[12, 16]} fontSize={["sm", "md"]}>
            <Stack>
              <Text m={0} textAlign="center">
                {title}
              </Text>
              {/* <Text m={0} textAlign="center">
              ✅
            </Text> */}
            </Stack>
          </Button>
        );
      })}
    </Grid>
  );
}

function PlayersContainer() {
  return (
    <Accordion allowMultiple>
      {[0, 0, 0, 0].map((_, index) => {
        return (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Player {index + 1}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel py={4} px={0}>
              <PlayerGame />
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
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
