import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import React from 'react';
import DatePicker from 'src/components/DatePicker';

interface SelectDateType {
  establishmentDate?: Date;
  onChange: (value: Date) => void;
}

const EstablishedDate = (props: SelectDateType) => {
  const router = useRouter();
  const { onChange, establishmentDate } = props;

  const handleChange = (value: Date) => {
    onChange(value);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Date of Establishment
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Box px={3}>
        <DatePicker
          value={establishmentDate ? new Date(establishmentDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </Stack>
  );
};
export default EstablishedDate;
