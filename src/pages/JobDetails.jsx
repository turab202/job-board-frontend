import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // ✅ make sure both useParams and Link are imported
import { Container, Typography, Card, CardContent, Button } from "@mui/material";
import { API_BASE_URL } from "../config"; // ✅ import your base URL
const JobDetails = () => {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/jobs/${id}`) // ✅ full URL for consistency
      .then((res) => {
        if (!res.ok) {
          throw new Error("Job not found");
        }
        return res.json();
      })
      .then(setJob)
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching job:", err);
      });
  }, [id]);

  if (error) {
    return <Typography variant="h6">{error}</Typography>;
  }

  if (!job) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">{job.title}</Typography>
          <Typography color="textSecondary">{job.company}</Typography>
          <Typography>{job.location}</Typography>
          <Typography sx={{ mt: 2 }}>{job.description}</Typography>

          {/* ✅ This button navigates to the application page */}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            component={Link}
            to={`/jobs/${job._id}/apply`}
          >
            Apply Now
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetails;








