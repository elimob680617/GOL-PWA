import { Stack } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import NoDataFoundIcon from 'public/images/NoExperienceadded.png';
function NoDataFound() {
  return (
    <Stack width="100%" alignItems="center" justifyContent="center" mt="25%" mb="25%">
      <Image src={NoDataFoundIcon} alt="NoDataFound" width={200} />
    </Stack>
  );
}

export default NoDataFound;
