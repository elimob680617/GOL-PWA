import React, { useState } from 'react';
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
import ImageSuccess from '/public/images/SuccessSignUp.png';
import { useSelector } from 'react-redux';
import { basicInfoSelector } from 'src/redux/slices/auth';
import useAuth from 'src/hooks/useAuth';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
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
  marginBottom: theme.spacing(6),
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

export default function SuccessSignUp() {
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const { username, password } = useSelector(basicInfoSelector);

  const handleLogin = async () => {
    setLoading(true);
    await login(username, password);

    router.push(`/home/?showQuestion=true`);
  };
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
          <Stack alignItems="center" spacing={3}>
            <Typography variant="subtitle2" color="gray.700" textAlign="center">
              Your account has been created successfully.
            </Typography>
            <LoadingButton loading={loading} size="large" variant="contained" onClick={handleLogin}>
              <Typography variant="button" color="Background.paper.">
                {' '}
                Start exploring
              </Typography>
            </LoadingButton>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
