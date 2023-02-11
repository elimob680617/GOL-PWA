import { Box } from '@mui/material';
import Reports from 'src/sections/campaignLanding/Reports';

function reports() {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.background.neutral,
        minHeight: '100%',
        height: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Reports />
    </Box>
  );
}

export default reports;
