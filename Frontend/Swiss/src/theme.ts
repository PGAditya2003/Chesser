// theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light", // Set initial color mode to light
    useSystemColorMode: false, // Optional: whether to follow system color mode settings
  },
  colors: {
    // Define custom colors for light and dark modes
    light: {
      background: "#f9f9f9",
      text: "#333",
    },
    dark: {
      background: "#1A202C", // Dark background
      text: "#E2E8F0", // Light text
    },
  },
  components: {
    // Input component customization
    Input: {
      baseStyle: {
        field: {
          color: "gray.800", // Light text color
          _placeholder: {
            color: "gray.400", // Placeholder color
          },
        },
      },
    },
    // Button component customization (example)
    Button: {
      baseStyle: {
        colorScheme: "teal",
      },
    },
  },
});

export default theme;
