import Layout from 'src/layouts';
import UserProfile from 'src/sections/Chat/messages/UserProfile';

const Profile = () => <UserProfile />;

// ----------------------------------------------------------------------

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default Profile;

