import { Stack, Typography, useTheme } from '@mui/material';

export default function HelpFooter() {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ pl: 5, py: 3, gap: 8, bgcolor: 'background.neutral' }}
    >
      <Stack spacing={3}>
        <Typography variant="subtitle2" color="text.primary">
          Garden of love
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Languages
        </Typography>
        <Typography variant="caption" color="text.secondary">
          About
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Privacy Policy
        </Typography>
        <Typography variant="caption" color="text.secondary">
          legal
        </Typography>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="subtitle2" color="text.primary">
          Company
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Terms of Service
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Cookies
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Whitepaper
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Contact GOL
        </Typography>
      </Stack>
    </Stack>
  );
}
