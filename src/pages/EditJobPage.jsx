import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack
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
    requirements: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(job)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update job');
    }

    const updatedJob = await response.json();
    console.log('Job updated successfully:', updatedJob);
    navigate('/employer-dashboard');
    
  } catch (error) {
    console.error('Update error:', error);
    // Add error display to your UI
    alert(`Error updating job: ${error.message}`);
  }
};

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Job: {job.title}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Job Title"
            name="title"
            value={job.title}
            onChange={handleChange}
            required
          />
          
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={job.company}
            onChange={handleChange}
            required
          />
          
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={job.location}
            onChange={handleChange}
            required
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
          />
          
          <Stack direction="row" spacing={2}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
            >
              Save Changes
            </Button>
            
            <Button 
              variant="outlined" 
              color="error"
              size="large"
              onClick={() => navigate('/employer-dashboard')}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditJobPage;