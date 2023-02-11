import { Grid, styled, Container, Button } from '@mui/material';
import ConnectionsList from 'src/sections/Chat/contacts/ConnectionsList';
import { useRouter } from 'next/router';
import ChatBox from './messages/ChatBox';
import NoChatBox from './messages/NoChatBox';

const RootStyle = styled('div')(() => ({
  height: '100%',
}));


const Index = () => {
  const {
    query: { id },
  } = useRouter();

  return (
    <Container
      maxWidth="lg"
      sx={(theme) => ({
        [theme.breakpoints.up('sm')]: {
          px: 0,
          height: '100%',
        },
      })}
    >
      <RootStyle>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {id ? <ChatBox /> : <NoChatBox />}
          </Grid>
        </Grid>
      </RootStyle>
    </Container>
  );
};

export default Index;
