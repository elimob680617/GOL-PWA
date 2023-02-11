import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { createRef, FC } from 'react';
import { FilterByEnum } from 'src/@types/sections/serverTypes';
import useIsOverflow from 'src/hooks/useIsOverflow';
import AvatarChecker from 'src/sections/connections/listContent/AvatarChecker';
import Image from 'next/image';

const RowRecently: FC<{ varient: FilterByEnum; avatar: string; name: string }> = ({ varient, avatar, name }) => {
  const fullnameRef = createRef<any>();
  const fullnameIsOverflow = useIsOverflow(fullnameRef);

  return (
    <Stack direction="row" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={2}>
        <AvatarChecker avatarUrl={avatar} fullName={name} userType={varient} />
        <Tooltip title={fullnameIsOverflow ? name : ''} enterTouchDelay={0}>
          <Typography ref={fullnameRef} sx={{ width: '100%' }} variant="subtitle1" color="surface.onSurface" noWrap>
            {name}
          </Typography>
        </Tooltip>
      </Stack>
      <IconButton>
        <Image src="/icons/close.svg" width={16} height={16} alt="remove" />
      </IconButton>
    </Stack>
  );
};

export default RowRecently;
