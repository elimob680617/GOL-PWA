import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Button, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
//next
import NextLink from 'next/link';
// routes
import { PATH_AUTH } from 'src/routes/paths';
import Image from 'next/image';

// image
import ImageSuccess from '/public/images/ConnectionLostSignUp.png';
//...........................................................

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const HeaderStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(8),
  marginTop: theme.spacing(2),
}));
const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(4),
}));
const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '60%',
  left: '38%',
  transform: 'translate(0, -50%)',
}));

export default function ConnectionLost() {
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <HeaderStyle>
          <LogoStyle>
            <Logo sx={{ width: 94, height: 82 }} />
          </LogoStyle>
        </HeaderStyle>
        <ContentStyle>
          <Image src={ImageSuccess} alt="success" />
          <Stack alignItems="center" spacing={2} mt={3}>
            <Typography variant="h6" color="gray.900" textAlign="center">
              Connection Lost!
            </Typography>
            <Typography variant="subtitle2" color="gray.700" textAlign="center">
              There seems to be a problem with your internet connection
            </Typography>
            <NextLink href={PATH_AUTH.signIn} passHref>
              <Button size="large" variant="text">
                Try again
              </Button>
            </NextLink>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
