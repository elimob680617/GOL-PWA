import Layout from 'src/layouts';
import Index from 'src/sections/Chat';

const Chat = () => <Index />;

// ----------------------------------------------------------------------

Chat.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default Chat;

