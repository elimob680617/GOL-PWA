import { styled } from '@mui/material/styles';
// @mui
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import { Circle } from '@mui/icons-material';
import { Global, Location } from 'iconsax-react';
import Image from 'next/image';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import Link from 'next/link';

const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  fontSize: '8px',
  margin: '0 0.5rem',
  display: 'flex',
  alignItems: 'center',
}));
interface PostDetailsNgoInfoTypes {
  fullName: string;
  avatar: string;
  location: string;
  createdDateTime: string;
  userType: UserTypeEnum;
  ownerUserId: string;
  isMine: boolean;
}
function PostDetailsNgoInfo(props: PostDetailsNgoInfoTypes) {
  const { fullName, avatar, location, createdDateTime, userType, ownerUserId, isMine } = props;
  const theme = useTheme();
  return (
    <>
      <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center' }}>
        <Link
          passHref
          href={`/profile/${userType === UserTypeEnum.Ngo ? 'ngo' : 'user'}${isMine ? '' : `/view/${ownerUserId}`} `}
        >
          <Avatar
            alt="Avatar"
            src={avatar || undefined}
            sx={{
              width: 48,
              height: 48,
              border: `1px solid ${theme.palette.grey[100]}`,
            }}
            variant={userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
          />
        </Link>
        <Stack spacing={1}>
          <Stack alignItems="center" direction="row" color={theme.palette.text.secondary}>
            <Link
              passHref
              href={`/profile/${userType === UserTypeEnum.Ngo ? 'ngo' : 'user'}${
                isMine ? '' : `/view/${ownerUserId}`
              } `}
            >
              <Typography variant="subtitle1" color={theme.palette.text.primary}>
                {fullName}
              </Typography>
            </Link>
            {location ? (
              <Stack alignItems="center" direction="row" color={theme.palette.text.secondary}>
                <PostTitleDot>
                  <Circle fontSize="inherit" />
                </PostTitleDot>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image src="/icons/location/24/Outline.svg" width={18} height={18} />
                  <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 0.5 }}>
                    {location}
                  </Typography>
                </Box>
              </Stack>
            ) : null}
          </Stack>
          <Stack alignItems="center" direction="row" color={theme.palette.text.secondary}>
            <Typography variant="caption">{createdDateTime}</Typography>
            <PostTitleDot>
              <Circle fontSize="inherit" />
            </PostTitleDot>
            <Image src="/icons/Earth/24/Outline.svg" width={16} height={16} />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default PostDetailsNgoInfo;
