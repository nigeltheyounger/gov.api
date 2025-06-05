import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  Payment as PaymentIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Payments"
            value="0"
            icon={<PaymentIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Active Services"
            value="0"
            icon={<BusinessIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Success Rate"
            value="0%"
            icon={<TrendingUpIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              No recent activity to display
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 