import { Skeleton, Stack } from '@mui/material';
import { FC } from 'react';
import { PeopleItemStyle } from '../people/PeopleItem';

const PeopleSkelton: FC = () => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Skeleton variant="circular" width={48} height={48} />
    <Skeleton variant="rectangular" width={144} height={20} />
  </Stack>
);

export default PeopleSkelton;
