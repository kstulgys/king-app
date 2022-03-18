import { Stack, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from "@chakra-ui/react";

export default function New() {
  return (
    <Stack p={20}>
      <Stack isInline>
        <Stack bg="gray.100" w={40}>
          <Text>Players</Text>
          <Text>Contracts</Text>
        </Stack>
        <Stack bg="pink.100" w="full">
          <Stack isInline>
            <Text>Karolis</Text>
            <Text>Vladas</Text>
            <Text>Edita</Text>
            <Text>Kamile</Text>
          </Stack>
        </Stack>
      </Stack>
      {/* <Table variant="simple">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th>Players</Th>
            <Th>Karolis</Th>
            <Th>Edita</Th>
            <Th>Kamile</Th>
            <Th>Vladas</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Karolis</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
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
