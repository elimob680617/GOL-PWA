import { Avatar, Box, Button, Divider, Icon, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import ProfileEditIcon from 'public/icons/chat/ProfileEdit.svg';
import Image from 'next/image';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { styled } from '@mui/material/styles';
import { useSelector } from 'src/redux/store';
import muteIcone from 'public/icons/chat/Mute.svg';
import searchIcone from 'public/icons/chat/Research.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MoreIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'inherit !important',
}));

const MuteIcon = (
  <Icon>
    <img alt="" src="/icons/chat/Mute.png" />
  </Icon>
);
const UserProfile = () => {
  const {
    query: { id },
    back,
  } = useRouter();

  const { onChatUser } = useSelector((state) => state.selectedUSer);

  return (
    <Box display={'flex'} justifyContent="center" alignItems={'center'} flexWrap="wrap">
      {/* <Typography variant="button" sx={{ width: '100%', textAlign: 'right', p: 2 }}>
        <Image src={ProfileEditIcon} alt="ProfileEditIcon" /> Edit
      </Typography> */}
      <Typography variant="button" sx={{ width: '100%', textAlign: 'left', p: 2 }}>
        <MoreIcon onClick={() => back()}>
          <ArrowBackIcon />
        </MoreIcon>
      </Typography>
      <Avatar sx={{ width: 200, height: 200 }} src={onChatUser?.avatarUrl} />
      <Typography sx={{ width: '100%', textAlign: 'center', p: 0.5 }} variant="subtitle1">
        {onChatUser?.fullName}
      </Typography>
      <Typography sx={{ width: '100%', textAlign: 'center', p: 0.5 }} variant="caption" color="text.secondary">
        {onChatUser?.userName}
      </Typography>
      <Typography sx={{ width: '100%', textAlign: 'center', p: 2 }} variant="caption" color="text.secondary">
        {onChatUser?.lastSeenDateTime ? `${onChatUser?.lastSeenDateTime}` : 'last seen recently'}
      </Typography>
      <Divider sx={{ width: '100%' }} />
      <Box display={'flex'} justifyContent="space-around" alignItems={'center'} sx={{ width: '100%' }}>
        <Button variant="contained" sx={{ m: 2, width: '7.75rem', height: '2.5rem' }} startIcon={MuteIcon}>
          Mute
        </Button>
        <Button
          variant="outlined"
          sx={{
            m: 2,
            color: (theme) => theme.palette.text.primary,
            borderColor: (theme) => theme.palette.text.primary,
            width: '7.75rem',
            height: '2.5rem',
          }}
        >
          <Image src={searchIcone} alt="searchIcone" />
          Search
        </Button>
        <MoreIcon>
          <MoreVertOutlinedIcon />
        </MoreIcon>
      </Box>
      <Divider sx={{ width: '100%' }} />
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'left', p: 2 }}>
          Bio
        </Typography>
        <Typography sx={{ width: '100%', textAlign: 'left', p: 2, pt: 0 }}>
          Lorem ipsum dolor sit amet. Est dolor totam non assumenda corporis ut illum modi quo mollitia voluptas cum
          doloribus nisi qui quibusdam
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfile;
