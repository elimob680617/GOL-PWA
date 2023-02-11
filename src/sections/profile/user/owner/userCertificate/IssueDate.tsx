import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Scalars } from 'src/@types/sections/serverTypes';
import DatePicker from 'src/components/DatePicker';
import { userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';

// type of issueDate props;
interface IssueDateProps {
  onChange: (value: Scalars['DateTime']) => void;
  issueDate: string;
  expirationDate: string;
}

// functions !
function IssueDate(props: IssueDateProps) {
  const { onChange, issueDate, expirationDate } = props;
  const userCertificate = useSelector(userCertificateSelector);
  const router = useRouter();
  const dispatch = useDispatch();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router.back();
  }, [userCertificate, router]);

  const handleChangeDatePicker = (value: Scalars['DateTime']) => {
    onChange(value);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">Issue Date</Typography>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          maxDate={expirationDate ? new Date(expirationDate) : undefined}
          value={!issueDate ? undefined : new Date(issueDate)}
          views={['month', 'year']}
          onChange={(date) => handleChangeDatePicker(date)}
        />
      </Box>
    </>
  );
}

export default IssueDate;
