import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'src/redux/store';
import { useRouter } from 'next/router';

const RootStyle = styled(Stack)(({ theme }) => ({
  paddingTop: 1,
  backgroundColor: theme.palette.surface.main,
}));

function PostCard({children}) {

  return (
    <RootStyle sx={{ paddingTop: 2, backgroundColor:(theme)=> theme.palette.surface.main }}>
      {children}
    </RootStyle>
  );
}

export default PostCard;
