import {
    Box,
    Button,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Flex
  } from "@chakra-ui/react";
  import { motion } from "framer-motion";
  import React from "react";
  import { useNavigate } from "react-router-dom"; // ✅ import navigate
  import "@fontsource/roboto"; // Import Roboto font
  
  const MotionButton = motion(Button); // Motion-enabled button
  
  const HomePage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate(); // ✅ initialize navigator
  
    return (
      <Box minH="100vh" minW="full" position="relative" fontFamily="Roboto, sans-serif">
        {/* Top Half - Blue */}
        <Box bg="blue.500" h="50vh" display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="4xl" fontWeight="bold" color="white" textShadow="0 1px 2px rgba(0,0,0,0.2)">
            Chess Tournament Platform
          </Text>
        </Box>
  
        {/* Bottom Half - White */}
        <Box bg="white" h="50vh" display="flex" alignItems="center" justifyContent="center" />
  
        {/* Button Wrapper */}
              <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <Flex direction="column" align="center" gap={4}>
          {/* Host Button */}
          <MotionButton
            h="80px"
            px="48px"
            fontSize="22px"
            fontWeight="bold"
            bg="white"
            color="blue.600"
            borderRadius="xl"
            boxShadow="2xl"
            _hover={{ bg: "blue.100" }}
            whileHover={{ scale: 1.05, boxShadow: "2xl" }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
          >
            HOST A TOURNAMENT
          </MotionButton>

          {/* View Tournaments Button */}
          <MotionButton
            h="60px"
            px="36px"
            fontSize="18px"
            fontWeight="medium"
            bg="blue.600"
            color="white"
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ bg: "blue.700" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tournaments")}
          >
            View Ongoing Tournaments
          </MotionButton>
        </Flex>
</Box>

        {/* Modal for Selection */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent maxW="750px" borderRadius="lg" overflow="hidden" p={8} bg="white" fontFamily="Roboto, sans-serif">
            <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" color="blue.700">
              Select Tournament Type
            </ModalHeader>
            <ModalBody>
              <Flex direction={["column", "row"]} gap={6} justify="center">
                {/* Team Event Button */}
                <Button
                  aria-label="Select Team Event"
                  flex={1}
                  h="180px"
                  w="100%"
                  fontSize="28px"
                  fontWeight="bold"
                  color="white"
                  bg="blue.500"
                  px={6}
                  _hover={{ bg: "blue.600", boxShadow: "xl" }}
                  borderRadius="lg"
                  boxShadow="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={() => {
                    navigate("/host/team");
                    onClose();
                  }}
                >
                  🏆 Team Event
                </Button>
  
                {/* Individual Tournament Button */}
                <Button
                  aria-label="Select Individual Tournament"
                  flex={1}
                  h="180px"
                  w="100%"
                  fontSize="28px"
                  fontWeight="bold"
                  color="blue.700"
                  bg="blue.200"
                  px={6}
                  _hover={{ bg: "blue.300", boxShadow: "xl" }}
                  borderRadius="lg"
                  boxShadow="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={() => {
                    navigate("/host/individual");
                    onClose();
                  }}
                >
                  🎯 Individuals
                </Button>
              </Flex>
            </ModalBody>
            <ModalFooter justifyContent="center">
              <Button
                variant="ghost"
                onClick={onClose}
                fontSize="18px"
                color="blue.600"
                _hover={{ bg: "blue.50" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        
      </Box>
    );
  };
  
  export default HomePage;
  