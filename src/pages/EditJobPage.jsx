import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { API_BASE_URL } from '../api/config';

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    type: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enhanced fetch with retry logic
  const fetchWithRetry = async (url, options, retries = 3) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries <= 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!networkStatus) {
          throw new Error('You are offline. Please connect to the internet.');
        }

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token missing');

        const data = await fetchWithRetry(`${API_BASE_URL}/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError(error.message);
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, networkStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!job.title || !job.company || !job.location || !job.description || !job.salary || !job.type) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!networkStatus) {
        throw new Error('You are offline. Changes will be saved when you reconnect.');
      }

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const updatedJob = await fetchWithRetry(`${API_BASE_URL}/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(job)
      });

      setSnackbar({
        open: true,
        message: 'Job updated successfully!',
        severity: 'success'
      });
      
      setTimeout(() => navigate('/employer-dashboard'), 1500);
      
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Job: {job.title}
      </Typography>
      
      {!networkStatus && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are currently offline. Some features may be limited.
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Job Title"
            name="title"
            value={job.title}
            onChange={handleChange}
            required
            disabled={!networkStatus}
          />
          
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={job.company}
            onChange={handleChange}
            required
            disabled={!networkStatus}
          />
          
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={job.location}
            onChange={handleChange}
            required
            disabled={!networkStatus}
          />
          
          <TextField
            fullWidth
            label="Salary"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            required
            disabled={!networkStatus}
          />
          
          <TextField
            fullWidth
            label="Job Type"
            name="type"
            value={job.type}
            onChange={handleChange}
            required
            disabled={!networkStatus}
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={job.description}
            onChange={handleChange}
            required
            disabled={!networkStatus}
          />
          
          <Stack direction="row" spacing={2}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
              disabled={isSubmitting || !networkStatus}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
            
            <Button 
              variant="outlined" 
              color="error"
              size="large"
              onClick={() => navigate('/employer-dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditJobPage;