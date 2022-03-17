import { Stack, Text, Box, Button, SimpleGrid, HStack, Select } from "@chakra-ui/react";
import { useStore } from "../hooks/useStore";

export default function App() {
  const { players } = useStore();
  const playerList = Object.values(players);
  return (
    <Box bg="gray.100" minH="100vh" height="full">
      <Stack isInline p={4} spacing={6}>
        <Stack width="70%" spacing={10}>
          {playerList.map((p) => (
            <PlayerBoard key={p.id} {...p} />
          ))}
        </Stack>
        <Stack width="30%">
          <Stats />
        </Stack>
      </Stack>
    </Box>
  );
}

function PlayerBoard({ id: playerId, name }) {
  const { games, history, onPlaySelectedGame } = useStore();
  return (
    <Stack>
      <Text fontWeight="bold" fontSize="sm">
        {name}
      </Text>
      <Stack bg="white" rounded="md" p={6}>
        <SimpleGrid columns={4} spacing={4}>
          {Object.values(games).map(({ id, name }) => {
            const isPlayed = !!history?.[playerId]?.[id];

            return (
              <Box key={id}>
                <Button
                  bg={isPlayed ? "gray.900" : "gray.200"}
                  color={isPlayed ? "white" : "gray.900"}
                  onClick={() => onPlaySelectedGame(id, playerId)}
                  isDisabled={isPlayed}
                  _disabled={{}}
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
  const {
    players,
    currentGame: { player, game },
    onFinishCurrentGame,
    isScoreTableAvailable,
  } = useStore();

  return (
    <Stack>
      <Stack spacing={4}>
        <Stack>
          <Text fontWeight="bold" fontSize="sm">
            Current Game
          </Text>
          <Stack bg="white" rounded="md" p={6}>
            <Text>
              {game.name} by {player.name}
            </Text>
            <Box>
              <Button w="full" onClick={onFinishCurrentGame}>
                Finish
              </Button>
            </Box>
          </Stack>
        </Stack>
        <Stack>
          <Text fontWeight="bold" fontSize="sm">
            Game Scores
          </Text>
          <Stack bg="white" rounded="md" p={6}>
            {Object.values(players).map(({ name }) => {
              return (
                <HStack justifyContent="space-between">
                  <Text>{name}:</Text>
                  <Select isDisabled={!isScoreTableAvailable} w={20}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Select>
                </HStack>
              );
            })}
            <Box>
              <Button isDisabled={!isScoreTableAvailable} w="full">
                Submit
              </Button>
            </Box>
          </Stack>
        </Stack>
        <Stack>
          <Text fontWeight="bold" fontSize="sm">
            Stats
          </Text>
          <Stack bg="white" rounded="md" p={6}>
            {Object.values(players).map(({ name, score }) => {
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
