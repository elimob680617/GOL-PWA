import { Avatar, Box, Button, Stack } from '@mui/material';
// @mui
import { styled } from '@mui/material/styles';
//
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import Drawer from 'src/components/Drawer';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import DrawerMenu from 'src/sections/home/DrawerMenu';

// ----------------------------------------------------------------------

const NoWidthButtonStyle = styled(Button)(({ theme }) => ({
  padding: 0,
  minWidth: 0,
}));

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function SimpleLayout({ children }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Box sx={{ height: '100vh' }}>
        {/* <Header isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />  */}
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

          <Link passHref href="/home">
            <NoWidthButtonStyle>
              {/* <Image src="/icons/Logo.svg" width={48} height={40} alt="logo" /> */}
              <Logo />
            </NoWidthButtonStyle>
          </Link>
          <Image src="/icons/dollar coin/24/Outline.svg" width={32} height={32} alt="money" />
        </Stack>
        {children}
      </Box>
      <Drawer open={openDrawer} onDismiss={() => setOpenDrawer(false)}>
        <DrawerMenu onClose={() => setOpenDrawer(false)} />
      </Drawer>
    </>
  );
}
