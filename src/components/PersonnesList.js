import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";

function PersonnesList() {
  const [personnes, setPersonnes] = useState([]);
  const [filteredPersonnes, setFilteredPersonnes] = useState([]);
  const [searchEntreprise, setSearchEntreprise] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [showEmplois, setShowEmplois] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/personnes")
      .then((response) => {
        setPersonnes(response.data);
        setFilteredPersonnes(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des personnes :", error);
      });
  }, []);

  const handleSearch = () => {
    const filtered = personnes.filter((personne) =>
      personne.emplois.some((emploi) => {
        const isInEntreprise = emploi.entreprise
          .toLowerCase()
          .includes(searchEntreprise.toLowerCase());
        const isInDateRange =
          (!dateDebut || new Date(emploi.dateDebut) >= new Date(dateDebut)) &&
          (!dateFin || new Date(emploi.dateFin) <= new Date(dateFin));
        return isInEntreprise && isInDateRange;
      })
    );
    setFilteredPersonnes(filtered);
  };

  const resetFilters = () => {
    setSearchEntreprise("");
    setDateDebut("");
    setDateFin("");
    setFilteredPersonnes(personnes);
  };

  const navigateToAddPersonne = () => {
    navigate("/add-personne");
  };

  // Delete a person
  const handleDeletePersonne = (id) => {
    axiosInstance
      .delete(`/personnes/${id}`)
      .then(() => {
        setPersonnes(personnes.filter((personne) => personne.id !== id));
        setFilteredPersonnes(
          filteredPersonnes.filter((personne) => personne.id !== id)
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de la personne :", error);
      });
  };

  // Delete a job from a person
  const handleDeleteEmploi = (personneId, emploiId) => {
    axiosInstance
      .delete(`/personnes/${personneId}/emplois/${emploiId}`)
      .then(() => {
        const updatedPersonnes = personnes.map((personne) => {
          if (personne.id === personneId) {
            personne.emplois = personne.emplois.filter(
              (emploi) => emploi.id !== emploiId
            );
          }
          return personne;
        });
        setPersonnes(updatedPersonnes);
        setFilteredPersonnes(updatedPersonnes);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'emploi :", error);
      });
  };

  // Toggle emploi visibility
  const toggleEmploisVisibility = (personneId) => {
    setShowEmplois((prevState) =>
      prevState === personneId ? null : personneId
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Liste des Personnes
      </Typography>
      {/* section de recherche par entreprise et par plage */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Rechercher par entreprise"
            variant="outlined"
            value={searchEntreprise}
            onChange={(e) => setSearchEntreprise(e.target.value)}
            size="small" // Make the input smaller
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch} size="small" title="search">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Date de début"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Date de fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <IconButton
            onClick={resetFilters}
            size="small"
            color="secondary"
            aria-label="reset filters"
            title="Reset the search form"
          >
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Grid>
      {/* Ajouter une personne Button */}
      <Box
        display="flex"
        alignItems="center"
        border={1}
        borderColor="grey.400"
        padding="8px"
        borderRadius="8px"
        style={{ marginBottom: "20px", width: "fit-content" }}
      >
        <IconButton
          onClick={navigateToAddPersonne}
          color="success"
          size="small"
          aria-label="Ajouter une personne"
        >
          <AddIcon />
          <Typography variant="body2" style={{ marginLeft: "8px" }}>
            Ajouter une personne
          </Typography>
        </IconButton>
      </Box>
      {/* Section d'affichage des personne */}
      {filteredPersonnes.length > 0 ? (
        filteredPersonnes.map((personne) => (
          <Paper
            key={personne.id}
            style={{
              marginBottom: "20px",
              padding: "15px",
              position: "relative",
              border: "1 solid grey",
              borderRadius:"6px"
            }}
          >
            <Typography variant="h6" gutterBottom>
              {personne.nom} {personne.prenom}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Date de naissance : {personne.dateNaissance}
            </Typography>
            <IconButton
              color="error"
              onClick={() => handleDeletePersonne(personne.id)}
              style={{ position: "absolute", top: "20px", right: "20px" }}
            >
              <DeleteIcon />
            </IconButton>

            <Typography
              variant="h6"
              style={{ marginTop: "10px", cursor: "pointer" }}
              onClick={() => toggleEmploisVisibility(personne.id)} // Toggle emplois visibility
            >
              Emplois
            </Typography>
            {showEmplois === personne.id && (
              <TableContainer component={Paper} style={{ marginTop: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Entreprise</TableCell>
                      <TableCell>Poste</TableCell>
                      <TableCell>Date de début</TableCell>
                      <TableCell>Date de fin</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {personne.emplois.map((emploi) => (
                      <TableRow key={emploi.id}>
                        <TableCell>{emploi.entreprise}</TableCell>
                        <TableCell>{emploi.poste}</TableCell>
                        <TableCell>{emploi.dateDebut}</TableCell>
                        <TableCell>{emploi.dateFin}</TableCell>
                        <TableCell>
                          <Tooltip title="Supprimer cet emploi">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDeleteEmploi(personne.id, emploi.id)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        ))
      ) : (
        <Typography variant="h6" color="textSecondary">
          Aucune personne trouvée.
        </Typography>
      )}
    </Box>
  );
}

export default PersonnesList;
