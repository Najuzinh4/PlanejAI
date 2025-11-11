import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7B42F6' },
    secondary: { main: '#00B7E6' },
  },
  shape: { borderRadius: 10 },
});

export default theme;
