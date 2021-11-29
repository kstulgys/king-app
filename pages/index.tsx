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
} from "@chakra-ui/react";

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
    <Stack width="full" justifyContent="flex-start">
      <Stack isInline border="1px solid" p={2} rounded="md">
        <Stack borderRight="1px solid" pr={2}>
          <Text m={0}>Player</Text>
          <Text m={0}>Karolis</Text>
        </Stack>
        <Stack>
          <Text m={0} textAlign="center">
            Tricks+
          </Text>
          <Text m={0} textAlign="center">
            ✅
          </Text>
        </Stack>
        <Stack>
          <Text m={0} textAlign="center">
            Tricks++
          </Text>
          <Text m={0} textAlign="center">
            ✅
          </Text>
        </Stack>
        <Stack>
          <Text m={0} textAlign="center">
            Tricks-
          </Text>
          <Text m={0} textAlign="center">
            ✅
          </Text>
        </Stack>
      </Stack>

      {/* <Table variant="simple">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td isNumeric>30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td>metres (m)</Td>
            <Td isNumeric>0.91444</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot>
      </Table> */}
    </Stack>
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
