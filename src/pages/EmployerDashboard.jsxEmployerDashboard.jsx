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
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchJobs = async () => {
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

    const fetchApplications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/job-applications/employer/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchJobs();
    fetchApplications();
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
      <Typography variant="h4" gutterBottom>
        Employer Dashboard
      </Typography>

      <Button
        component={Link}
        to="/post-job"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Post New Job
      </Button>

      {/* Jobs Section */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Your Jobs
      </Typography>

      <Box sx={{ overflowX: "auto", mt: 2 }}>
        <Table sx={{ minWidth: 300, tableLayout: "auto", wordWrap: "break-word" }}>

          <TableHead>
            <TableRow>
              <TableCell >Title</TableCell>
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
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="stretch" sx={{ width: "100%" }} >
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

      {/* Applications Section */}
      <Typography variant="h5" sx={{ mt: 6 }}>
        Job Applications
      </Typography>

      <Box sx={{ overflowX: "auto", mt: 2 }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Resume</TableCell>
              <TableCell>Cover Letter</TableCell>
              <TableCell>Applied Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(JOBS) && job.length > 0 ? (
              applications.map((job) => (
                <TableRow key={app._id}>
                  <TableCell>{app.jobId?.title}</TableCell>
                  <TableCell>{app.applicantName}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>
                    <MuiLink
                      href={`https://job-board-backend-2-5014.onrender.com/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </MuiLink>
                  </TableCell>
                  <TableCell>{app.coverLetter || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} >
                  No applications yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default EmployerDashboard;
