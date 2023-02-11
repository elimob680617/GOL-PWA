import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import Logo from 'src/components/Logo';

interface TitleAndProgressProps {
  step?: number;
  userType?: UserTypeEnum;
}

const TitleAndProgress: FC<TitleAndProgressProps> = (props) => {
  const { step, userType } = props;

  return (
    <>
      <Box mb={3.8} p={0}>
        <Logo sx={{ width: 67, height: 67 }} />
      </Box>
      <Stack spacing={2} mb={4} alignItems="center">
        <Typography variant="h5" color="text.primary" textAlign={'center'}>
          Welcome to Garden of love
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Let us ask you a few questions!
        </Typography>
        <Box sx={{ width: 144 }}>
          <LinearProgress
            variant="determinate"
            value={userType === UserTypeEnum.Normal ? (step as number) * (100 / 5) : (step as number) * (100 / 4)}
          />
        </Box>
      </Stack>
    </>
  );
};
export default TitleAndProgress;
