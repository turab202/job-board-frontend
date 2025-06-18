import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/config"; // Use config file

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/employer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/api/jobs/delete/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(jobs.filter((job) => job._id !== jobId));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Employer Dashboard</Typography>

      <Button
        component={Link}
        to="/post-job"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Post New Job
      </Button>

      <Typography variant="h5" sx={{ mt: 3 }}>
        Your Jobs
      </Typography>

      {/* Responsive Table */}
      <Box sx={{ overflowX: "auto", mt: 2 }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {/* Use Stack for responsive button layout */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <Button
                      component={Link}
                      to={`/edit-job/${job._id}`}
                      variant="contained"
                      color="warning"
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(job._id)}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default EmployerDashboard;
