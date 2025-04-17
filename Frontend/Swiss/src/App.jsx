import { useState } from 'react'
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import IndividualTournamentForm from './pages/IndividualTournamentForm';
import TeamTournamentForm from './pages/TeamTournamentForm';
import TeamTournamentsList from './pages/TeamTournamentsList'; 
import TournamentDetailsPage from './pages/TournamentDetailsPage';
import AddTeamPage from "./pages/AddTeamPage";
import TournamentPairingsPage from './pages/TournamentPairingsPage';


function App() {
  const [count, setCount] = useState(0)

  return (
		<Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/host/individual' element={<IndividualTournamentForm />} />
        <Route path='/host/team' element={<TeamTournamentForm />} />
        <Route path="/tournament/:id" element={<TournamentDetailsPage />} />
        <Route path='/tournaments' element={<TeamTournamentsList />} />
        <Route path="/tournament/:id/pairings" element={<TournamentPairingsPage />} />

        <Route path="/tournament/:id/add-team" element={<AddTeamPage />} />

        {/* <Route path='/Players' element={<PlayersPage />} /> */}
      </Routes>
   </Box>
  )
}

export default App
