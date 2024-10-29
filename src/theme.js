import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0e1322", // Your custom primary color
      light: "#7c8fc9", // Lighter shade
      dark: "#151c32", // Darker shade
    },
    secondary: {
      main: "#f50057", // Your custom secondary color
    },
  },
});

export default theme;
