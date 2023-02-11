import { useState } from 'react';
// next
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Box, Stack, Button, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from 'src/routes/paths';

// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';

// sections
import { ResetPasswordForm } from 'src/sections/auth';
// assets
import { SentIcon } from 'src/assets';
// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  display: 'flex',
}));
const HeaderStyle = styled('header')(({ theme }) => ({
  lineHeight: 0,
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center !important',
  justifyContent: 'start',
  marginBottom: theme.spacing(6),
  paddingTop: theme.spacing(6),
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 360,
  margin: 'auto',
  padding: theme.spacing(3),
}));
const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '90%',
  left: '39%',
  transform: 'translate(0, -50%)',
}));
const ImageStyle = styled(Image)(({ theme }) => ({
  cursor: 'pointer',
}));
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ResetPassword() {
  // const [email, setEmail] = useState('');
  // const [sent, setSent] = useState(false);
  const router = useRouter();

  return (
    <RootStyle>
      <Container>
        <HeaderStyle>
          <ImageStyle src={ArrowLeft} alt="back" onClick={() => router.back()} />
          <LogoStyle>
            <Logo sx={{ width: 94, height: 82 }} />
          </LogoStyle>
        </HeaderStyle>
        <ContentStyle>
          <Stack alignItems="center">
            {/* {!sent ? (
                <> */}
            <Stack spacing={1} alignItems="center" mb={3}>
              <Typography variant="h4" paragraph color="text.primary" sx={{ margin: 0 }}>
                Reset password
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Choose new password.
              </Typography>
            </Stack>

            <ResetPasswordForm
            // onSent={() => setSent(true)}
            // onGetEmail={(value) => setEmail(value)}
            />
            {/* </>
              ) : (
                <Stack textAlign="center">
                  <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />
                  <Typography variant="h3" gutterBottom>
                    Request sent successfully
                  </Typography>
                  <Typography>
                    We have sent a confirmation email to &nbsp;
                    <strong>{email}</strong>
                    <br />
                    Please check your email.
                  </Typography>
                </Stack>
              )} */}
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
