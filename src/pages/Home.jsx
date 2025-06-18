import React from "react";
import { styled } from "@mui/material/styles";
import { Container, Typography, Button, TextField } from "@mui/material";
import { motion } from "framer-motion";

const HomeContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
  background: "#f5f5f5",
});

const SearchBar = styled("div")({
  display: "flex",
  marginTop: "20px",
});

const Home = () => {
  return (
    <HomeContainer>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h3" color="primary">
          Find Your Dream Job
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Browse thousands of jobs and start your career today!
        </Typography>
        <SearchBar>
          <TextField label="Search Jobs..." variant="outlined" />
          <Button variant="contained" color="primary" sx={{ ml: 2 }}>
            Search
          </Button>
        </SearchBar>
      </motion.div>
    </HomeContainer>
  );
};

export default Home;
