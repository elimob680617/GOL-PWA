// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';

// @mui
import { Box, Card, Container, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { PATH_AUTH } from 'src/routes/paths';
// guards
import GuestGuard from 'src/guards/GuestGuard';
// components
import Logo from 'src/components/Logo';
// sections
import { SignInForm } from 'src/sections/auth';
// icons
//redux
import { signUpBy, signUpBySelector } from 'src/redux/slices/auth';
import { useDispatch, useSelector } from 'src/redux/store';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(2, 0),
  height: '100vh',
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
  padding: theme.spacing(3.4),
}));

const JoinSectionStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: theme.palette.grey[100],
  // borderTopLeftRadius: 8,
  // borderTopRightRadius: 8,
}));
const LoginSectionStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1),
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: theme.palette.grey[100],
  // borderBottomLeftRadius: 8,
  // borderBottomRightRadius: 8,
}));
const LogoStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '60%',
  left: '38%',
  transform: 'translate(0, -50%)',
}));
// const ImageStyle = styled(Image)(({ theme }) => ({
//   cursor: 'pointer',
// }));
// ----------------------------------------------------------------------
export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userSignUpBy = useSelector(signUpBySelector);

  const handleSignUpBy = () => {
    dispatch(signUpBy({ signUpBy: userSignUpBy === 'email' ? 'phoneNumber' : 'email' }));
  };

  return (
    <GuestGuard>
      <RootStyle>
        <Container maxWidth="sm">
          <HeaderStyle>
            <LogoStyle>
              <Logo sx={{ width: 94, height: 82 }} />
            </LogoStyle>
          </HeaderStyle>
          <ContentStyle>
            <Stack alignItems="center" spacing={2}>
              <Typography variant="h4" color="text.primary">
                Sign In
              </Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Love is the fragrance of god. If you can smell the fragrance, come in to the Garden Of Love
              </Typography>
            </Stack>
            <SignInForm />
            {/* {userSignUpBy === 'email' ? (
                <Stack direction="row" alignItems="center" mt={3} mb={3}>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography sx={{ px: 2 }} variant="subtitle2" color="gray.900">
                    Or
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Stack>
              ) : (
                ''
              )}

              {userSignUpBy === 'phoneNumber' ? '' : <SocialSingInButtons />} */}
          </ContentStyle>
          <JoinSectionStyle direction="row" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              New to Gardenoflove?
            </Typography>
            <NextLink href={PATH_AUTH.signUp.basicInfo} passHref>
              <Link variant="body2" color="primary.main" sx={{ textDecoration: 'none !important' }}>
                Join Now
              </Link>
            </NextLink>
          </JoinSectionStyle>
          <LoginSectionStyle direction="row" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Using {userSignUpBy === 'email' ? 'phone number' : 'email address'}?
            </Typography>
            <Typography onClick={handleSignUpBy} variant="body2" color="primary.main" sx={{ cursor: 'pointer' }}>
              Sign in by {userSignUpBy === 'email' ? 'Phone Number' : 'Email Address'}
            </Typography>
          </LoginSectionStyle>
        </Container>
      </RootStyle>
    </GuestGuard>
  );
}
