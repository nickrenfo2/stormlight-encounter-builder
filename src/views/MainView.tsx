import {AppBar, Box, Container, Toolbar, Typography, useTheme} from "@mui/material";
import type {ReactNode} from "react";


interface MainViewProps {
  children: ReactNode
}
export default function MainView({ children }: MainViewProps) {
  const theme = useTheme();
  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
    }}>
      <AppBar>
        <Toolbar>
          <Typography>
            Stormlight Combat Builder
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className="appbar-spacer" sx={{
        height: '64px' // height of AppBar
      }} />
      <Container sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        paddingTop: theme.spacing(4),
      }}>
        {children}
      </Container>
    </Box>
  )
}