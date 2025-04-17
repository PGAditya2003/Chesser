import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  Button,
  useToast,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

interface Player {
  _id: string;
  name: string;
  rating: number;
}

interface Team {
  _id: string;
  name: string;
  players: Player[];
  wins: number;
  losses: number;
  draws: number;
  points: number;
  gamesPlayed: number;
}

const TournamentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const fetchTeams = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tournaments/team/${id}/teams`
      );
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [id]);

  const handleAddTeam = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tournaments/team/${id}/add-team`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTeamName }),
        }
      );

      if (!res.ok) throw new Error("Failed to add team");

      toast({
        title: "Team added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onAddClose();
      setNewTeamName("");
      fetchTeams();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error adding team",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    onDeleteOpen();
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/tournaments/team/${id}/remove-team/${teamToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete team");

      toast({
        title: "Team deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      fetchTeams();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete team",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setTeamToDelete(null);
    }
  };

  return (
    <Box minH="100vh" bg="blue.50" p={6} fontFamily="Roboto, sans-serif">
      <Heading mb={10} color="blue.700" textAlign="center">
        Tournament Standings
      </Heading>

      <Flex justify="center" gap={6} mb={6}>
        <Button colorScheme="blue" onClick={onAddOpen}>
          ➕ Add Team
        </Button>
        <Button colorScheme="teal" onClick={() => navigate(`/tournament/${id}/pairings`)}>
          🔀 View Pairings
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : teams.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.600">
          No teams found.
        </Text>
      ) : (
        <Flex justify="center">
          <Box maxW="1000px" w="full" bg="white" p={6} borderRadius="xl" boxShadow="lg">
          <Table size="md">
            <Thead bg="blue.200">
              <Tr>
                <Th color="gray.800" fontWeight="semibold">Team Name</Th>
                <Th textAlign="center" color="gray.800">Played</Th>
                <Th textAlign="center" color="gray.800">Wins</Th>
                <Th textAlign="center" color="gray.800">Draws</Th>
                <Th textAlign="center" color="gray.800">Losses</Th>
                <Th textAlign="center" color="gray.800">Points</Th>
                <Th textAlign="center" color="gray.800">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...teams]
                .sort((a, b) => b.points - a.points)
                .map((team, index) => (
                  <Tr
                    key={team._id}
                    bg={index % 2 === 0 ? "gray.50" : "white"}
                    _hover={{ bg: "blue.50", transform: "scale(1.005)", transition: "0.2s ease" }}
                  >
                    <Td color="gray.700" fontWeight="medium">{team.name}</Td>
                    <Td color="gray.700" textAlign="center">{team.gamesPlayed}</Td>
                    <Td color="green.600" textAlign="center" fontWeight="bold">{team.wins}</Td>
                    <Td color="orange.600" textAlign="center">{team.draws}</Td>
                    <Td color="red.600" textAlign="center">{team.losses}</Td>
                    <Td color="blue.700" textAlign="center" fontWeight="bold">
                      {team.points}
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => confirmDeleteTeam(team)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>

          </Box>
        </Flex>
      )}

      {/* Add Team Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="white">
          <ModalHeader color="blue.700">Add Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="blue.700">Team Name</FormLabel>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  focusBorderColor="blue.500"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddTeam}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete{" "}
            <strong>{teamToDelete?.name}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteTeam}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TournamentDetailsPage;
