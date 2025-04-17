import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

interface Player {
  name: string;
  rating: number | ""; // "" for empty, number for real rating
}

const AddTeamPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<Player[]>([
    { name: "", rating: "" },
    { name: "", rating: "" },
    { name: "", rating: "" },
  ]);

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const updatedPlayers = [...players];
    if (field === "rating") {
      updatedPlayers[index].rating = value === "" ? "" : parseInt(value, 10);
    } else {
      updatedPlayers[index].name = value;
    }
    
    setPlayers(updatedPlayers);
  };

  const addPlayerField = () => {
    setPlayers([...players, { name: "", rating: "" }]);
  };

  const handleSubmit = async () => {
    const filteredPlayers = players.filter(p => p.name.trim() !== "");

    if (!teamName.trim()) {
      toast({ title: "Team name is required", status: "warning", duration: 3000, isClosable: true });
      return;
    }

    if (filteredPlayers.length === 0) {
      toast({ title: "Add at least one player with a name", status: "warning", duration: 3000, isClosable: true });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/tournaments/team/${id}/add-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          players: filteredPlayers,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add team");
      }

      toast({ title: "Team added!", status: "success", duration: 3000, isClosable: true });
      navigate(`/tournament/${id}`);
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error adding team", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box p={6} maxW="600px" mx="auto" bg="blue.50" minH="100vh">
      <Heading mb={6} textAlign="center" color="blue.700">
        Add Team
      </Heading>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold">Team Name</FormLabel>
        <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter team name" />
      </FormControl>

      <Heading size="sm" mb={2} mt={6} color="blue.600">
        Players
      </Heading>

      <VStack spacing={4} align="stretch">
        {players.map((player, index) => (
          <HStack key={index}>
            <Input
              placeholder="Name"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
              color="black"
            />
            <Input
              placeholder="Rating"
              type="number"
              value={player.rating}
              onChange={(e) => handlePlayerChange(index, "rating", e.target.value)}
              color="black"
            />
          </HStack>
        ))}
      </VStack>

      <Button mt={4} onClick={addPlayerField} colorScheme="gray">
        ➕ Add Player
      </Button>

      <Button mt={6} colorScheme="blue" width="100%" onClick={handleSubmit}>
        ✅ Submit Team
      </Button>
    </Box>
  );
};

export default AddTeamPage;
