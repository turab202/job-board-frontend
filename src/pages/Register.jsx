import React, { useState } from "react";
import { Container, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setSnackbarMessage("Registration successful. Please login.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSnackbarMessage(err.response?.data?.message || "Something went wrong");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "400px" }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Full Name" name="name" variant="outlined" onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" name="email" variant="outlined" onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth type="password" label="Password" name="password" variant="outlined" onChange={handleChange} sx={{ mb: 2 }} />
        <Button fullWidth variant="contained" color="primary" type="submit">
          Register
        </Button>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;


