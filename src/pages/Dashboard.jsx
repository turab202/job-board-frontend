import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Welcome to Your Dashboard</Typography>
      <Typography variant="body1">Manage your job postings, applications, and more.</Typography>

      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2, mr: 2 }} 
        onClick={() => navigate("/jobs")}
      >
        View Jobs
      </Button>

      <Button 
        variant="contained" 
        color="secondary" 
        sx={{ mt: 2 }} 
        onClick={() => navigate("/post-job")}
      >
        Post a Job
      </Button>
    </Container>
  );
};

export default Dashboard;


