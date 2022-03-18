import React from "react";
import {
  FormControl,
  FormLabel,
  Stack,
  Text,
  Box,
  Button,
  SimpleGrid,
  HStack,
  Select,
  useBoolean,
  Input,
} from "@chakra-ui/react";
import { useStore } from "../hooks/useStore";
import { percentToValue } from "@chakra-ui/utils";

export default function App() {
  const { players, hasStarted } = useStore();
  return (
    <Box bg="gray.100" minH="100vh" height="full">
      {!hasStarted ? (
        <AddPlayers />
      ) : (
        <Stack direction={["column-reverse", "column-reverse", "row"]} p={4} spacing={6}>
          <Stack width={["full", "full", "70%"]} spacing={[6, 6, 8]}>
            {Object.values(players).map((p) => (
              <PlayerBoard key={p.id} {...p} />
            ))}
          </Stack>
          <Stack width={["full", "full", "30%"]}>
            <Stats />
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

function AddPlayers() {
  const { onStartGame } = useStore();
  const [players, setPlayers] = React.useState<{ [key: string]: string }>({});

  const canSubmit = Object.keys(players).length > 2;

  const onPlayerNameChange = (e) => {
    const { id, value } = e.target;
    const state = { ...players };
    if (!value) {
      delete state[id];
    } else {
      state[id] = value;
    }
    setPlayers(state);
  };

  const handleSartGame = () => {
    const validatedPlayers = Object.entries(players).reduce((acc, [key, value]) => {
      if (value.trim()) acc[key] = value.trim();
      return acc;
    }, {});
    onStartGame(validatedPlayers);
  };

  return (
    <Stack>
      <Stack mx="auto" pt={20}>
        <Text fontWeight="bold" textTransform="uppercase">
          Players
        </Text>
        <Stack bg="white" rounded="md" p={4} shadow="base" minW="xs" width="full">
          <FormControl>
            <FormLabel fontSize="sm" htmlFor="1">
              Name
            </FormLabel>
            <Input id="1" size="lg" onChange={onPlayerNameChange} />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" htmlFor="2">
              Name
            </FormLabel>
            <Input id="2" size="lg" onChange={onPlayerNameChange} />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" htmlFor="3">
              Name
            </FormLabel>
            <Input id="3" size="lg" onChange={onPlayerNameChange} />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" htmlFor="1">
              Name
            </FormLabel>
            <Input id="4" size="lg" onChange={onPlayerNameChange} />
          </FormControl>
          <Box pt={2}>
            <Button
              bg="gray.900"
              _hover={{}}
              color="white"
              onClick={handleSartGame}
              isDisabled={!canSubmit}
              w="full"
              size="lg"
            >
              Start the game
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

function PlayerBoard({ id: playerId, name }) {
  const { games, history, onPlaySelectedGame, currentGame } = useStore();
  return (
    <Stack>
      <Text fontWeight="bold" fontSize="sm">
        {name}
      </Text>
      <Stack bg="white" rounded="md" p={4} shadow="base">
        <SimpleGrid columns={[3, 3, 4]} spacing={4}>
          {Object.values(games).map(({ id, name }) => {
            const isPlayed = !!history?.[playerId]?.[id];
            const hasNotStarted = !currentGame;
            const isPlaying = !!currentGame?.game;
            const isDisabled = isPlaying || isPlayed || playerId !== currentGame?.player.id;
            return (
              <Box key={id}>
                <Button
                  bg={isPlayed ? "gray.900" : "gray.200"}
                  color={isPlayed ? "white" : "gray.900"}
                  onClick={() => onPlaySelectedGame(id, playerId)}
                  isDisabled={hasNotStarted ? false : isDisabled}
                  width="full"
                  cursor={isPlayed ? "not-allowed" : "pan"}
                  _hover={{}}
                >
                  {name}
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}

function Stats() {
  const { players, currentGame, onFinishCurrentGame } = useStore();

  return (
    <Stack>
      <Stack spacing={4}>
        <Stack>
          <Text fontWeight="bold" fontSize="sm">
            Current Game
          </Text>
          <Stack bg="white" rounded="md" p={4} shadow="base">
            {currentGame?.game ? (
              <Text>
                <Box as="span" fontWeight="bold">
                  {currentGame.game.name}
                </Box>{" "}
                by{" "}
                <Box as="span" fontWeight="bold">
                  {currentGame.player.name}
                </Box>
              </Text>
            ) : (
              <Text>
                Waiting for{" "}
                <Box as="span" fontWeight="bold">
                  {currentGame?.player?.name ?? `...`}
                </Box>
              </Text>
            )}
            <Box>
              <Button isDisabled={!currentGame?.game} w="full" onClick={onFinishCurrentGame}>
                Finish
              </Button>
            </Box>
          </Stack>
        </Stack>
        <GaneSciores />
        <Stack>
          <Text fontWeight="bold" fontSize="sm">
            Stats
          </Text>
          <Stack bg="white" rounded="md" p={4} shadow="base">
            {Object.values(players)
              .sort((a, b) => b.score - a.score)
              .map(({ name, score }) => {
                return (
                  <HStack justifyContent="space-between">
                    <Text>{name}:</Text>
                    <Text>{score}</Text>
                  </HStack>
                );
              })}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

function GaneSciores() {
  const { players, isScoreTableAvailable, onSubmitCurrentGame, currentGame } = useStore();
  const [playersTricks, setPlayersTricks] = React.useState<{ [key: string]: number }>({});
  const [canSubmit, { on, off }] = useBoolean(false);

  const handleSetScores = (key, value) => {
    setPlayersTricks((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const count = Object.entries(playersTricks).reduce((acc, [key, count]) => {
      acc[key] = Math.round(count * currentGame.game.each);
      return acc;
    }, {});
    onSubmitCurrentGame(count);
    setPlayersTricks({});
    off();
  };

  const tricks = React.useMemo(() => {
    let res = [];
    if (currentGame?.game) {
      res = [...Array(currentGame.game.count + 1)];
    }
    return res;
  }, [currentGame]);

  const count = React.useMemo(() => {
    return Object.values(playersTricks).reduce((acc, n) => (acc += n), 0);
  }, [playersTricks]);

  React.useEffect(() => {
    if (!currentGame?.game) return;
    if (count === currentGame.game.count) {
      on();
    } else {
      off();
    }
  }, [playersTricks, count]);

  return (
    <Stack>
      <Text fontWeight="bold" fontSize="sm">
        Game Scores
      </Text>
      <Stack bg="white" rounded="md" p={4} shadow="base">
        {Object.entries(players).map(([key, { name }]) => {
          return (
            <HStack justifyContent="space-between">
              <Text>{name}:</Text>
              <Select
                onChange={(e) => handleSetScores(key, +e.target.value)}
                isDisabled={!isScoreTableAvailable}
                w={20}
              >
                {tricks.map((_, index) => {
                  return <option value={index}>{index}</option>;
                })}
              </Select>
            </HStack>
          );
        })}
        <Box>
          <Button onClick={onSubmit} isDisabled={!isScoreTableAvailable || !canSubmit} w="full">
            Submit {count}/{currentGame?.game?.count}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}
