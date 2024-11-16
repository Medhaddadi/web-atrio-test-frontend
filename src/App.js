import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Typography } from "@mui/material";

import PersonnesList from "./components/PersonnesList";
import AddEmploi from "./components/AddEmploi";
import AddPersonne from "./components/AddPersonne";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestion des Personnes
          </Typography>
          <Button color="inherit" component={Link} to="/personnes">
            Liste des Personnes
          </Button>
          <Button color="inherit" component={Link} to="/add-emploi">
            Ajouter Emploi
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/personnes" element={<PersonnesList />} />
          <Route path="/add-emploi" element={<AddEmploi />} />
          <Route path="/add-personne" element={<AddPersonne />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
