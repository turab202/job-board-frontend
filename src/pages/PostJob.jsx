import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config"; // ✅ Externalized base URL

const PostJob = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    type: "Full-time",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setSnackbar({
        open: true,
        message: "❌ You must be logged in to post jobs",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "✅ Job posted successfully!",
          severity: "success",
        });
        setJob({
          title: "",
          company: "",
          location: "",
          salary: "",
          description: "",
          type: "Full-time",
        });

        setTimeout(() => navigate("/employer-dashboard"), 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "❌ Failed to post job",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setSnackbar({
        open: true,
        message: "❌ Network error. Try again later.",
        severity: "error",
      });
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Post a Job
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="title"
            label="Job Title"
            variant="outlined"
            sx={{ mb: 2 }}
            value={job.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="company"
            label="Company Name"
            variant="outlined"
            sx={{ mb: 2 }}
            value={job.company}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="location"
            label="Location"
            variant="outlined"
            sx={{ mb: 2 }}
            value={job.location}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="salary"
            label="Salary"
            variant="outlined"
            sx={{ mb: 2 }}
            value={job.salary}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="type"
            label="Job Type"
            select
            sx={{ mb: 2 }}
            value={job.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            label="Job Description"
            variant="outlined"
            sx={{ mb: 2 }}
            value={job.description}
            onChange={handleChange}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mb: 2 }}
          >
            Post Job
          </Button>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default PostJob;
