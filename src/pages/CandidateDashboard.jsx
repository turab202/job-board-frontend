import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config"; // ✅ import your base URL

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/candidate/applied-jobs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch applications.");
        }
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setApplications([]);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Candidate Dashboard
      </Typography>
      <Typography variant="h5" sx={{ mt: 3 }}>
        Your Applications
      </Typography>

      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ mt: 3, minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Date Applied</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.filter((app) => app.jobId).length > 0 ? (
              applications
                .filter((app) => app.jobId)
                .map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.jobId.title}</TableCell>
                    <TableCell>{app.jobId.company}</TableCell>
                    <TableCell>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{app.status || "Pending"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/jobs/${app.jobId._id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No valid applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default CandidateDashboard;
