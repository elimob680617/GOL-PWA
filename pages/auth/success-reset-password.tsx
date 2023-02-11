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
import ImageSuccess from '/public/images/SuccessForgetPassword.png';
//...........................................................

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
  display: 'flex',
}));

const HeaderStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(6),
  marginTop: theme.spacing(2),
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  margin: 'auto',
  padding: theme.spacing(2),
}));
const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '60%',
  left: '38%',
  transform: 'translate(0, -50%)',
}));

export default function SuccessResetPassword() {
  return (
    <Page title={'Forget Password'}>
      <RootStyle>
        <Container>
          <HeaderStyle>
            <LogoStyle>
              <Logo sx={{ width: 94, height: 82 }} />
            </LogoStyle>
          </HeaderStyle>
          <ContentStyle>
            <Image src={ImageSuccess} alt="success" />
            <Stack alignItems="center" spacing={3}>
              <Typography variant="subtitle2" color="gray.700">
                Your Password has been reset successfully
              </Typography>
              <NextLink href={PATH_AUTH.signIn} passHref>
                <Button size="large" variant="contained" sx={{ mt: 5 }}>
                  Log into your account
                </Button>
              </NextLink>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
