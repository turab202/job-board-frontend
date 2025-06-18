// src/components/JobList.jsx
import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Grid, Card, CardContent, Button } from "@mui/material";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setJobs)
      .catch((err) => console.error("❌ Failed to load jobs:", err));
  }, []);

  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Listings
      </Typography>

      <TextField
        label="Search Jobs..."
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid container spacing={3}>
        {filtered.length > 0 ? (
          filtered.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography color="textSecondary">{job.company}</Typography>
                  <Typography>{job.location}</Typography>
                  <Typography variant="body2" color="primary">
                    {job.type}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/jobs/${job._id}`}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary">
            No jobs found
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default JobList;








