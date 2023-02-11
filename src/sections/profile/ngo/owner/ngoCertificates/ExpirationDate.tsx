import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Scalars } from 'src/@types/sections/serverTypes';
import DatePicker from 'src/components/DatePicker';
import { userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';

//type of ExpireDate props;
interface ExpireDateProps {
  onChange: (value: string) => void;
  expirationDate: string;
  issueDate: string;
}

function ExpirationDate(props: ExpireDateProps) {
  const { onChange, expirationDate, issueDate } = props;
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router.back();
  }, [userCertificate, router]);

  // functions !
  // send date to Redux
  const handleChangeDatePicker = (value: Scalars['DateTime']) => {
    onChange(value);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">Expiration Date</Typography>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          value={!expirationDate ? new Date(2020, 1) : new Date(expirationDate)}
          minDate={issueDate ? new Date(issueDate) : undefined}
          views={['month', 'year']}
          onChange={(date) => handleChangeDatePicker(date)}
        />
      </Box>
    </>
  );
}

export default ExpirationDate;
