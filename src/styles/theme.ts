import { createTheme } from '@mui/material/styles';
import { teal, orange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: teal[500],
    },
    secondary: {
      main: orange[500],
    },
  },
  typography: {
    fontFamily: ['Noto Sans JP', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

export default theme;