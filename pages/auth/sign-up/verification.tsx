// next
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(2, 0),
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
  margin: 'auto',
  padding: theme.spacing(3.4),
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

  const userType = useSelector(signUpUserTypeSelector);

  if (!userType) {
    router.push(PATH_AUTH.signUp.typeSelection);
    return null;
  }

  function secureUsername(username: string) {
    return username;
  }

  // send Code first mounting the component

  return (
    <GuestGuard>
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
              <Typography variant="h4" color="text.primary">
                Is it Really you?
              </Typography>
            </Stack>
            <Box mt={2} />
            <VerifyRegistration />
          </ContentStyle>
        </Container>
      </RootStyle>
    </GuestGuard>
  );
}
