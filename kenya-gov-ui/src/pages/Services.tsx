import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
}

interface ApiResponse {
  success: boolean;
  data: Service[];
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/services', {
          headers: {
            'x-api-key': 'test_api_key_123',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const result: ApiResponse = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setServices(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Services
      </Typography>
      <Grid container spacing={3}>
        {services.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">
                No services available at the moment
              </Typography>
            </Paper>
          </Grid>
        ) : (
          services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {service.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {service.category}
                  </Typography>
                  <Typography variant="body2">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    disabled={service.status === 'inactive'}
                  >
                    {service.status === 'active' ? 'Use Service' : 'Service Unavailable'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
} 