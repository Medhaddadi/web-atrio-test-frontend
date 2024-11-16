import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axiosInstance from "../axiosConfig";

function AddPersonne() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { nom, prenom, dateNaissance };

    axiosInstance
      .post("/personnes", data)
      .then(() => {
        alert("Personne ajoutée avec succès !");
        // Réinitialisation du formulaire
        setNom("");
        setPrenom("");
        setDateNaissance("");
        setErrors({});
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrors(error.response.data); // Enregistrer les erreurs de validation du backend
        } else {
          console.error("Erreur lors de l'ajout de la personne :", error);
        }
      });
  };

  return (
    <div>
      <h2>Ajouter une Personne</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <TextField
          label="Nom"
          variant="outlined"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          error={Boolean(errors.nom)}
          helperText={errors.nom}
        />

        <TextField
          label="Prénom"
          variant="outlined"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          error={Boolean(errors.prenom)}
          helperText={errors.prenom}
        />

        <TextField
          label="Date de Naissance"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateNaissance}
          onChange={(e) => setDateNaissance(e.target.value)}
          error={Boolean(errors.dateNaissance)}
          helperText={errors.dateNaissance}
        />

        <Button type="submit" variant="contained" color="primary">
          Ajouter Personne
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

export default AddPersonne;
