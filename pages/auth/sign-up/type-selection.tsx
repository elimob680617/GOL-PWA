// next
import NextLink from 'next/link';
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
import { UserTypeSelection } from 'src/sections/auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
// icons
import ArrowLeft from '/public/icons/account/ArrowLeft.svg';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.neutral,
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
  backgroundColor: theme.palette.background.paper,
  margin: 'auto',
  padding: theme.spacing(3, 4),
}));

const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: theme.palette.grey[200],
  borderRadius: theme.spacing(1),
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
export default function TypeSelection() {
  const router = useRouter();

  const a = useSession();
  return (
    <GuestGuard>
      <RootStyle>
        <Container maxWidth="sm">
          <HeaderStyle>
            <ImageStyle src={ArrowLeft} alt="back" onClick={() => router.push(PATH_AUTH.signIn)} />
            <LogoStyle>
              <Logo sx={{ width: 94, height: 82 }} />
            </LogoStyle>
          </HeaderStyle>
          <ContentStyle>
            <Stack alignItems="center" spacing={2}>
              <Typography variant="h4" color="text.primary">
                Sign Up
              </Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Love is the fragrance of god. If you can smell the fragrance, come in to the Garden Of Love
              </Typography>
            </Stack>

            <UserTypeSelection />
          </ContentStyle>
          <JoinSectionStyle direction="row" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <NextLink href={PATH_AUTH.signIn} passHref>
              <Link variant="body2" color="primary.main" sx={{ textDecoration: 'none' }}>
                Sign in
              </Link>
            </NextLink>
          </JoinSectionStyle>
        </Container>
      </RootStyle>
    </GuestGuard>
  );
}
