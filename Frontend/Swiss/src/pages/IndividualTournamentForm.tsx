import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Flex,
} from "@chakra-ui/react";

const IndividualTournamentForm = () => {
  const [formData, setFormData] = useState({
    tournamentName: "",
    location: "",
    date: "",
  });

  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const API_BASE_URL = import.meta.env.VITE_API_URL;

const handleSubmit = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/tournaments/individual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast({
        title: "Individual tournament created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ tournamentName: "", location: "", date: "" });
    } else {
      toast({
        title: "Error creating tournament",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    console.error(err);
    toast({
      title: "Server error",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};


  return (
    <Box minH="100vh" bgGradient="linear(to-b, blue.500 50%, white 50%)">
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        fontFamily="Roboto, sans-serif"
        px={4}
      >
        <Box
          p={8}
          bg="white"
          borderRadius="2xl"
          boxShadow="2xl"
          maxW="600px"
          w="full"
        >
          <Heading textAlign="center" mb={6} fontSize="2xl" color="blue.700">
            Create Individual Tournament
          </Heading>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel color="blue.700">Tournament Name</FormLabel>
              <Input
                name="tournamentName"
                value={formData.tournamentName}
                onChange={handleChange}
                placeholder="Blitz Masters"
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="blue.700">Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="London"
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="blue.700">Date</FormLabel>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                focusBorderColor="blue.500"
              />
            </FormControl>
            <Button
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              w="full"
              size="lg"
              borderRadius="xl"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default IndividualTournamentForm;
