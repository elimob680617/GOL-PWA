import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { VFC } from 'react';
import DatePicker from 'src/components/DatePicker';

interface UniUniversityDateDialogProps {
  isEndDate?: boolean;
  startDate?: Date;
  endDate?: Date;
  onChange: (value: Date) => void;
}

const UniDate: VFC<UniUniversityDateDialogProps> = (props) => {
  const { isEndDate = false, startDate, onChange, endDate } = props;

  const handleChange = (value: Date) => {
    onChange(value);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            {!isEndDate ? 'Start Date' : 'End Date'}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Box>
        <DatePicker
          value={isEndDate ? (endDate ? new Date(endDate) : new Date()) : startDate ? new Date(startDate) : undefined}
          minDate={isEndDate && startDate ? new Date(startDate) : undefined}
          maxDate={!isEndDate && endDate ? new Date(endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Stack>
  );
};
export default UniDate;
