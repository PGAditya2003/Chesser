import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Spinner,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Tournament {
  _id: string;
  tournamentName: string;
  teamSize: number;
  location: string;
  date: string;
}

const TeamTournamentsList = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tournaments/team");
        const data = await res.json();
        setTournaments(data);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <Box minH="100vh" bg="blue.50" p={6} fontFamily="Roboto, sans-serif">
      <Heading mb={6} color="blue.700" textAlign="center">
        Ongoing Team Tournaments
      </Heading>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : tournaments.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.600">
          No tournaments found.
        </Text>
      ) : (
        <Stack spacing={5}>
          {tournaments.map((tournament) => (
            <Box
              key={tournament._id}
              p={6}
              bg="white"
              color={"black"}
              borderRadius="xl"
              boxShadow="lg"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              onClick={() => navigate(`/tournament/${tournament._id}`)}
            >
              <Heading size="md" color="blue.600" mb={2}>
                {tournament.tournamentName}
              </Heading>
              <Text>
                <strong>Team Size:</strong> {tournament.teamSize}
              </Text>
              <Text>
                <strong>Location:</strong> {tournament.location || "TBD"}
              </Text>
              <Text>
                <strong>Date:</strong>{" "}
                {tournament.date
                  ? new Date(tournament.date).toLocaleDateString()
                  : "TBD"}
              </Text>
              <Badge mt={2} colorScheme="blue">
                Ongoing
              </Badge>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TeamTournamentsList;
