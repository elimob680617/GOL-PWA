import { Stack, Typography, Divider, Avatar, useTheme, Box, styled } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.neutral,
}));

interface DrawerMenuProps {
  onClose: () => void;
}

function DrawerMenu(props: DrawerMenuProps) {
  const { onClose } = props;
  const { user } = useAuth();
  const theme = useTheme();

  const { push } = useRouter();
  const router = useRouter();
  return (
    <>
      <Box sx={{ backgroundColor: theme.palette.background.neutral }}>
        <RootStyle
          onClick={() => {
            onClose();
            push(user?.userType === UserTypeEnum.Normal ? PATH_APP.user.profile : PATH_APP.profile.ngo.root);
          }}
          spacing={1}
          direction={'row'}
          alignItems="center"
        >
          <Avatar
            sx={{ width: 48, height: 48 }}
            src={user?.avatarUrl || ''}
            variant={user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
          />
          <Typography variant="subtitle1">
            {user?.userType === UserTypeEnum.Normal ? `${user?.firstName} ${user?.lastName}` : user?.fullName}
          </Typography>
          <Stack
            alignItems={'center'}
            justifyContent="center"
            sx={{ backgroundColor: theme.palette.secondary.main, px: 0.76, py: 0.5, borderRadius: 1 }}
          >
            <Typography variant="caption" color={theme.palette.background.paper}>
              BGD
            </Typography>
          </Stack>
        </RootStyle>
        <Stack
          spacing={2}
          sx={{ p: 2, backgroundColor: theme.palette.background.paper, borderRadius: '16px 16px 0 0' }}
        >
          <Link passHref href="/campaigns">
            <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
              <Image src="/icons/Campaign/24/Outline.svg" width={24} height={24} alt="campaign" />
              <Typography variant="subtitle2" color={theme.palette.text.primary}>
                Campaigns
              </Typography>
            </Stack>
          </Link>
          <Link passHref href="/connections/follower">
            <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
              <Image src="/icons/Groups/24/Outline.svg" width={24} height={24} alt="campaign" />
              <Typography variant="subtitle2" color={theme.palette.text.primary}>
                Connections
              </Typography>
            </Stack>
          </Link>
          {/* <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <Image src="/icons/Groups/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              Groups
            </Typography>
          </Stack> */}
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <Image src="/icons/Page Collection/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              Pages
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <Image src="/icons/NFT/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              NFT
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <Image src="/icons/Save1/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              Saved
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <Image src="/icons/Premium/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              Premium
            </Typography>
          </Stack>
          <Divider />
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <Image src="/icons/Help/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography
              variant="subtitle2"
              color={theme.palette.text.primary}
              onClick={() => router.push('/help/help-center')}
            >
              Help Center
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{ py: 1 }} alignItems="center">
            <Image src="/icons/Setting/24/Outline.svg" width={24} height={24} alt="campaign" />
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              Settings
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

export default DrawerMenu;
