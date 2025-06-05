import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';

const currencies = [
  { value: 'KES', label: 'Kenyan Shilling (KES)' },
  { value: 'USD', label: 'US Dollar (USD)' },
];

export default function Payments() {
  const [formData, setFormData] = useState({
    serviceId: '',
    amount: '',
    currency: 'KES',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: '',
    referenceNumber: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:3000/api/v1/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test_api_key_123',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      setSuccess('Payment initiated successfully!');
      setFormData({
        serviceId: '',
        amount: '',
        currency: 'KES',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        description: '',
        referenceNumber: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Initiate Payment
      </Typography>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Service ID"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Customer Email"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Customer Phone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Reference Number"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Initiate Payment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
} 