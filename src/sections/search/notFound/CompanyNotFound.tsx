import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import Image from 'next/image';

const CompanyNotFound: FC = () => (
    <Stack alignItems="center" spacing={3}>
      <Image src="/images/notfound/companyNotFound.svg" width={100} height={100} alt="ngo-not-found" />
      <Typography variant="body2" color="text.secondary">
        No Data Found
      </Typography>
    </Stack>
  );

export default CompanyNotFound;
