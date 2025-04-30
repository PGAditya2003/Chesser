import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Spinner,
  Flex,
  Text,
  VStack,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

interface Team {
  _id: string;
  name: string;
}

interface Pairing {
  teamA: Team;
  teamB: Team;
  result?: string; // e.g., "1-0", "0.5-0.5", etc.
}

interface Round {
  roundNumber: number;
  pairings: Pairing[];
}

const TournamentPairingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPairings = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tournaments/team/${id}/pairings`
      );
      if (!res.ok) throw new Error("Failed to fetch pairings");

      const data = await res.json();
      setRounds(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error fetching pairings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPairings();
  }, [id]);

  const submitResult = async (
    roundNumber: number,
    teamAId: string,
    teamBId: string,
    result: string
  ) => {
    console.log("Submitting result:", {
      roundNumber,
      teamAId,
      teamBId,
      result,
    });
  
    if (!teamAId || !teamBId || !result) {
      toast({
        title: "Invalid data to submit result",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const res = await fetch(
        `http://localhost:5000/api/tournaments/team/${id}/pairings/result`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roundNumber, teamAId, teamBId, result }),
        }
      );
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit result");
      }
  
      toast({
        title: "Result submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      navigate(`/tournament/${id}`);
      fetchPairings();
    } catch (err: any) {
      console.error(err);
      toast({
        title: err.message || "Failed to submit result",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box minH="100vh" bg="blue.50" p={6} fontFamily="Roboto, sans-serif">
      <Heading mb={8} color="blue.700" textAlign="center">
        Tournament Pairings
      </Heading>

      <Flex justify="center" mb={6}>
        <Button colorScheme="blue" onClick={() => navigate(`/tournament/${id}`)}>
          ⬅ Back to Tournament
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : rounds.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.600">
          No pairings available.
        </Text>
      ) : (
        <Flex justify="center">
          <VStack spacing={8} align="stretch" maxW="700px" w="full">
            {rounds.map((round) => (
              <Box
                key={round.roundNumber}
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
              >
                <Heading size="md" mb={4} color="blue.700">
                  Round {round.roundNumber}
                </Heading>
                <VStack spacing={3} align="stretch">
                  {round.pairings.map((pairing, idx) => (
                    <Box
                    key={idx}
                    bg="blue.50"
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="blue.100"
                  >
                    <Text color="black" fontSize="md" mb={2}>
                      {pairing.teamA.name} 🆚 {pairing.teamB.name !== "None" ? pairing.teamB.name : "— Bye"}
                      {pairing.result && (
                        <Text as="span" fontWeight="bold" color="teal.600">
                          {" "}— Result: {pairing.result}
                        </Text>
                      )}
                    </Text>
                  
                    {!pairing.result && pairing.teamB.name !== "None" && (
                      <Flex gap={2} wrap="wrap">
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() =>
                            submitResult(round.roundNumber, pairing.teamA._id, pairing.teamB._id, "1-0")
                          }
                        >
                          {pairing.teamA.name} Wins
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() =>
                            submitResult(round.roundNumber, pairing.teamA._id, pairing.teamB._id, "0-1")
                          }
                        >
                          {pairing.teamB.name} Wins
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="orange"
                          onClick={() =>
                            submitResult(round.roundNumber, pairing.teamA._id, pairing.teamB._id, "0.5-0.5")
                          }
                        >
                          Draw
                        </Button>
                      </Flex>
                    )}
                  </Box>
                  
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </Flex>
      )}
    </Box>
  );
};

export default TournamentPairingsPage;
