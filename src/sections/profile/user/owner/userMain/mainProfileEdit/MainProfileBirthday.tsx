import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DatePicker from 'src/components/DatePicker';
import { userMainInfoSelector } from 'src/redux/slices/profile/userMainInfo-slice';
import { useDispatch, useSelector } from 'src/redux/store';

interface BirthDayProps {
  onChange: (value: Date) => void;
  birthDay: Date;
}

function MainProfileBirthday(props: BirthDayProps) {
  const { onChange, birthDay } = props;

  const handleChange = (date: Date) => {
    onChange(date);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">Birthday</Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 3 }}>
        <DatePicker
          maxDate={new Date(new Date().getFullYear() - 13, 1, 1)}
          minDate={new Date(new Date().getFullYear() - 89, 1)}
          value={birthDay ? new Date(birthDay) : new Date(new Date().getFullYear() - 15, 1, 1)}
          onChange={handleChange}
        />
      </Box>
    </>
  );
}

export default MainProfileBirthday;
