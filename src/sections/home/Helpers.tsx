import { Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

const TextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '15px',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  marginRight:theme.spacing(2),
}));

const Helpers: FC = () => (
  <Stack flexWrap="wrap" direction="row">
    <TextStyle variant="caption">Languages</TextStyle>
    <TextStyle variant="caption">About</TextStyle>
    <TextStyle variant="caption">Help Center</TextStyle>
    <TextStyle variant="caption">Privacy Policy</TextStyle>
    <TextStyle variant="caption">legal</TextStyle>
    <TextStyle variant="caption">Terms of Service</TextStyle>
    <TextStyle variant="caption">Cookies</TextStyle>
    <TextStyle variant="caption">Whitepaper</TextStyle>
    <TextStyle variant="caption">Contact GOL</TextStyle>
  </Stack>
);

export default Helpers;
