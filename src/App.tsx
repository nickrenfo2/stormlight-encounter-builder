import { useState } from 'react'
import './App.css'
import {Box, Container, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import MainView from "./views/MainView.tsx";
import CombatEncounterBuilder from "./views/CombatEncounterBuilder.tsx";


const theme = createTheme({palette: {mode: 'dark'}});

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <MainView>
            <CombatEncounterBuilder />
          </MainView>
        </Box>
      </ThemeProvider>
    </>
  )
}

export default App
