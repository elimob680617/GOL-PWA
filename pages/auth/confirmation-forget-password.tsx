// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Typography, Link } from '@mui/material';
// routes
import { PATH_AUTH } from 'src/routes/paths';
// guards
import GuestGuard from 'src/guards/GuestGuard';
// components
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
// sections
import { useSelector } from 'src/redux/store';
import { basicInfoSelector, signUpUserTypeSelector } from 'src/redux/slices/auth';
import { VerifyRegistration } from 'src/sections/auth';
import ConfirmationForgetPassword from 'src/sections/auth/forget-password/ConfirmationForgetPassword';
// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(3, 0),
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
  },
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
  maxWidth: 416,
  margin: 'auto',
  padding: theme.spacing(4),
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

export default function Verification() {
  const router = useRouter();

  // const userType = useSelector(signUpUserTypeSelector);

  function secureUsername(username: string) {
    return username;
  }

  // send Code first mounting the component

  return (
    <GuestGuard>
      <Page title="Sign In">
        <RootStyle>
          <Container maxWidth="sm">
            <HeaderStyle>
              <ImageStyle src={ArrowLeft} alt="back" onClick={() => router.back()} />
              <LogoStyle>
                <Logo sx={{ width: 94, height: 82 }} />
              </LogoStyle>
            </HeaderStyle>
            <ContentStyle>
              <Stack alignItems="center">
                <Typography variant="h4" color="text.primary">
                  Is it Really you?
                </Typography>
              </Stack>
              <ConfirmationForgetPassword />
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
