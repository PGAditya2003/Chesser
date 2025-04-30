import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, Heading, Flex, Select } from "@chakra-ui/react";
import { apiRequest } from './../api'; // Import the API utility

const TeamTournamentForm = () => {
  const [formData, setFormData] = useState({
    tournamentName: "",
    teamSize: "",
    location: "",
    date: "",
    format: "Swiss", // Default format
  });

  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await apiRequest("/api/tournaments/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          teamSize: Number(formData.teamSize),
        }),
      });

      if (response) {
        toast({
          title: "Team tournament created!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          tournamentName: "",
          teamSize: "",
          location: "",
          date: "",
          format: "Swiss",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error creating tournament",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, blue.500 50%, white 50%)">
      <Flex minH="100vh" align="center" justify="center" fontFamily="Roboto, sans-serif" px={4}>
        <Box p={8} bg="white" borderRadius="2xl" boxShadow="2xl" maxW="600px" w="full">
          <Heading textAlign="center" mb={6} fontSize="2xl" color="blue.700">
            Create Team Tournament
          </Heading>
          <VStack spacing={6}>
            {/* Form controls */}
            <FormControl isRequired>
              <FormLabel color="blue.700">Tournament Name</FormLabel>
              <Input name="tournamentName" value={formData.tournamentName} onChange={handleChange} placeholder="Summer Showdown" focusBorderColor="blue.500" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="blue.700">Team Size</FormLabel>
              <Input name="teamSize" type="number" value={formData.teamSize} onChange={handleChange} placeholder="e.g., 4" focusBorderColor="blue.500" />
            </FormControl>
            {/* Additional form controls */}
            <Button bg="blue.500" color="white" _hover={{ bg: "blue.600" }} w="full" size="lg" borderRadius="xl" onClick={handleSubmit}>
              Submit
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default TeamTournamentForm;
