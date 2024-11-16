import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axiosInstance from "../axiosConfig";

function AddEmploi() {
  const [personnes, setPersonnes] = useState([]);
  const [personId, setPersonId] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [poste, setPoste] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch list of people to select from
  useEffect(() => {
    axiosInstance.get("/personnes").then((response) => {
      setPersonnes(response.data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { entreprise, poste, dateDebut, dateFin };

    axiosInstance
      .post(`/personnes/${personId}/emplois`, data)
      .then(() => {
        alert("Emploi ajouté avec succès !");
        // Reset the form
        setPersonId("");
        setEntreprise("");
        setPoste("");
        setDateDebut("");
        setDateFin("");
        setErrors({});
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrors(error.response.data); // Set validation errors from the backend
        } else {
          console.error("Erreur lors de l'ajout de l'emploi :", error);
        }
      });
  };

  return (
    <div>
      <h2>Ajouter un Emploi</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <FormControl fullWidth>
          <InputLabel id="personne-select-label">Personne</InputLabel>
          <Select
            labelId="personne-select-label"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            error={Boolean(errors.personneId)}
          >
            {personnes.map((personne) => (
              <MenuItem key={personne.id} value={personne.id}>
                {personne.nom}
              </MenuItem>
            ))}
          </Select>
          {errors.personneId && <p style={{ color: "red" }}>{errors.personneId}</p>}
        </FormControl>

        <TextField
          label="Entreprise"
          variant="outlined"
          value={entreprise}
          onChange={(e) => setEntreprise(e.target.value)}
          error={Boolean(errors.entreprise)}
          helperText={errors.entreprise}
        />

        <TextField
          label="Poste"
          variant="outlined"
          value={poste}
          onChange={(e) => setPoste(e.target.value)}
          error={Boolean(errors.poste)}
          helperText={errors.poste}
        />

        <TextField
          label="Date de début"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          error={Boolean(errors.dateDebut)}
          helperText={errors.dateDebut}
        />

        <TextField
          label="Date de fin"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          error={Boolean(errors.dateFin)}
          helperText={errors.dateFin}
        />

        <Button type="submit" variant="contained" color="primary">
          Ajouter Emploi
        </Button>
      </form>

      {Object.keys(errors).length > 0 && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h4>Erreurs de validation :</h4>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddEmploi;
