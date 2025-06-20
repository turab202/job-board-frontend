import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { API_BASE_URL } from "../api/config"; // ✅ import your base URL

const JobApplication = () => {
  const { id: jobId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coverLetter: "",
  });
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    return setSnackbar({
      open: true,
      message: "❌ You must be logged in to apply.",
      severity: "warning",
    });
  }

  if (!resume) {
    return setSnackbar({
      open: true,
      message: "❌ Please upload your resume.",
      severity: "warning",
    });
  }

  const data = new FormData();
  data.append("name", formData.name);
  data.append("email", formData.email);
  data.append("coverLetter", formData.coverLetter);
  data.append("resume", resume);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/job-applications/${jobId}/apply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return setSnackbar({
        open: true,
        message: result.message || "❌ Failed to apply.",
        severity: "error",
      });
    }

    // ✅ Success
    setSnackbar({
      open: true,
      message: "✅ Application submitted successfully!",
      severity: "success",
    });
    setFormData({ name: "", email: "", coverLetter: "" });
    setResume(null);

    // Redirect after short delay
    setTimeout(() => {
      navigate("/candidate-dashboard"); // or "/applied-jobs" if you have it
    }, 1500);
  } catch (error) {
    console.error("❌ Application error:", error);
    setSnackbar({
      open: true,
      message: "❌ Server error or network issue.",
      severity: "error",
    });
  }
};
  return (
    <Container sx={{ mt: 4, maxWidth: "600px" }}>
      <Typography variant="h4" gutterBottom>
        Apply for Job
      </Typography>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Cover Letter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          style={{ marginBottom: "1rem" }}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Application
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobApplication;
