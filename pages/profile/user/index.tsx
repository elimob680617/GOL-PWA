import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Layout from 'src/layouts';
import Main from 'src/sections/profile/user/owner/userMain/Main';

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

export default function ProfilePage() {
  return (
    <>
      <Main />
    </>
  );
}
