import { Grid, styled, Container, Stack, Typography, Button, Box } from '@mui/material';
import ConnectionsList from 'src/sections/Chat/contacts/ConnectionsList';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PATH_APP } from 'src/routes/paths';
import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const NoWidthButtonStyle = styled(Button)(({ theme }) => ({
  padding: 0,
  minWidth: 0,
}));

const Connections = () => {
  const { push } = useRouter();
  return (
    <Container
      maxWidth="lg"
      sx={(theme) => ({
        [theme.breakpoints.up('sm')]: {
          px: 0,
        },
      })}
    >
      <RootStyle>
        <ConnectionsList />
        <Box sx={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
          <MainBottomNavigationBar />
        </Box>
      </RootStyle>
    </Container>
  );
};

export default Connections;
