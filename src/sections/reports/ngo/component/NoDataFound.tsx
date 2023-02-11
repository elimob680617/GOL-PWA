import { Stack } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import NoDataFoundIcon from 'public/images/NoExperienceadded.png';
function NoDataFound() {
  return (
    <Stack alignItems="center" justifyContent="start" sx={{ my: 6 }}>
      <Image src={NoDataFoundIcon} alt="NoDataFound" width={200} />
    </Stack>
  );
}

export default NoDataFound;
