import { Avatar, Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Drawer from 'src/components/Drawer';
import Layout from 'src/layouts';
import { PATH_APP } from 'src/routes/paths';
import DrawerMenu from 'src/sections/home/DrawerMenu';

import Image from 'next/image';
import useAuth from 'src/hooks/useAuth';

import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';
import WelcomeDialog from 'src/sections/auth/sign-up/questions/common/WelcomeDialog';
import HomePosts from 'src/sections/home/HomePosts';
import Logo from 'src/components/Logo';

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="onlyAuthGuard">{page}</Layout>;
};

const NoWidthButtonStyle = styled(Button)(({ theme }) => ({
  padding: 0,
  minWidth: 0,
}));

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Box sx={{ height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" px={2} pt={1}>
          <Stack direction="row" alignItems="center">
            <NoWidthButtonStyle onClick={() => setOpenDrawer(true)}>
              <Image width={24} height={24} alt="menu" src="/icons/menu/Outline.svg" />
            </NoWidthButtonStyle>
            <NoWidthButtonStyle
              onClick={() =>
                router.push(user?.userType === UserTypeEnum.Normal ? PATH_APP.user.profile : PATH_APP.profile.ngo.root)
              }
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={user?.avatarUrl || ''}
                variant={user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
              />
            </NoWidthButtonStyle>
          </Stack>

          <NoWidthButtonStyle onClick={() => router.push(PATH_APP.root)}>
            <Logo />
          </NoWidthButtonStyle>
          <Image src="/icons/dollar coin/24/Outline.svg" width={32} height={32} alt="money" />
        </Stack>

        <HomePosts />

        <MainBottomNavigationBar />
      </Box>
      <Drawer open={openDrawer} onDismiss={() => setOpenDrawer(false)}>
        <DrawerMenu onClose={() => setOpenDrawer(false)} />
      </Drawer>
      {router.query.showQuestion === 'true' && !user?.completeQar && <WelcomeDialog openWelcome={true} />}
    </>
  );
}
