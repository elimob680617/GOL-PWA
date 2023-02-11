import { Box, Divider, Stack, Typography } from '@mui/material';
import DatePicker from 'src/components/DatePicker';

interface SchoolYearProps {
  onChange: (value: number) => void;
  value?: number;
}

export default function SchoolYear(props: SchoolYearProps) {
  const { onChange, value } = props;
  const handleChange = (value: Date) => {
    onChange(value.getFullYear());
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            Class Year
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Box>
        <DatePicker
          value={!!value ? new Date(value, 1) : new Date(2022, 1)}
          views={['year']}
          minDate={new Date(1970, 1)}
          onChange={(date) => handleChange(date)}
        />
      </Box>
    </Stack>
  );
}
