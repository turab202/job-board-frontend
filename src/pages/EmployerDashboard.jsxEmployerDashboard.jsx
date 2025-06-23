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
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import CloseIcon from '@mui/icons-material/Close';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch jobs
        const [jobsResponse, appsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/jobs/employer`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/job-applications/employer/applications`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs');
        if (!appsResponse.ok) throw new Error('Failed to fetch applications');
        
        const [jobsData, appsData] = await Promise.all([
          jobsResponse.json(),
          appsResponse.json()
        ]);

        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setApplications(Array.isArray(appsData) ? appsData : []);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/jobs/delete/${jobId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to delete job');
        setJobs(jobs.filter((job) => job._id !== jobId));
      } catch (err) {
        console.error("Error deleting job:", err);
        setError(err.message);
      }
    }
  };

  const handlePreviewResume = (resumePath) => {
    if (!resumePath) {
      setError('No resume available');
      return;
    }
    
    // Clean path and handle different formats
    const cleanPath = resumePath.replace(/^.*[\\\/]/, '');
    setCurrentResume(`${API_BASE_URL}/uploads/${cleanPath}`);
    setPreviewOpen(true);
  };

  const handleDownloadResume = (resumePath) => {
    if (!resumePath) {
      setError('No resume available');
      return;
    }
    
    const cleanPath = resumePath.replace(/^.*[\\\/]/, '');
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/uploads/${cleanPath}`;
    link.download = `resume_${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employer Dashboard
      </Typography>

      <Button
        component={Link}
        to="/post-job"
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 4 }}
      >
        Post New Job
      </Button>

      {/* Jobs Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Your Jobs
      </Typography>

      <Box sx={{ overflowX: "auto", mb: 4 }}>
        <Table sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell sx={{ width: isSmallScreen ? '150px' : 'auto' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Stack direction={isSmallScreen ? "column" : "row"} spacing={1}>
                      <Button
                        component={Link}
                        to={`/edit-job/${job._id}`}
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(job._id)}
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No jobs posted yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Applications Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Job Applications
      </Typography>

      <Box sx={{ overflowX: "auto" }}>
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
            {applications.length > 0 ? (
              applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.jobId?.title || 'N/A'}</TableCell>
                  <TableCell>{app.applicantName || 'N/A'}</TableCell>
                  <TableCell>{app.email || 'N/A'}</TableCell>
                  <TableCell>
                    {app.resume ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handlePreviewResume(app.resume)}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleDownloadResume(app.resume)}
                        >
                          Download
                        </Button>
                      </Stack>
                    ) : (
                      'No resume'
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Box sx={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {app.coverLetter || "N/A"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No applications yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Resume Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Resume Preview
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: '80vh' }}>
          {currentResume && (
            <iframe 
              src={currentResume}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Resume Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default EmployerDashboard;