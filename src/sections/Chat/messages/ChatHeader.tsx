import { useState } from 'react';
import { Avatar, Button, IconButton, Stack, Typography, useTheme } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'src/redux/store';
import { onEnable, onDisable } from 'src/redux/slices/chat/selectMsgReducer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DeleteModal from './DeleteModal';
import { useRouter } from 'next/router';
import { getDate } from 'date-fns';

const MoreIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'inherit !important',
}));

const ChatHeader = () => {
  const { isSelect } = useSelector((state) => state.selectMsg);
  const { onChatUser } = useSelector((state) => state.selectedUSer);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('username@gmail.com');
  const {push} = useRouter()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };
  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', padding: theme.spacing(2) }}>
        <Stack direction="row" spacing={3}>
          <MoreIcon onClick={() => push('/chat')}>
            <ArrowBackIcon />
          </MoreIcon>
          <Avatar sx={{ height: 48, width: 48 }} aria-label="avatar" src={onChatUser.avatarUrl} alt="user" />
          <Stack>
            <Typography gutterBottom variant="subtitle2" component="div" sx={{ margin: theme.spacing(0) }}>
              {onChatUser.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">

              {`${onChatUser.lastMessageDateTime.slice(0,10)}  |  ${onChatUser.lastMessageDateTime.slice(11,16)}`}
              {console.log(onChatUser.lastMessageDateTime)}
            </Typography>
          </Stack>
        </Stack>
        <MoreIcon onClick={() => push(`/chat/profile/${onChatUser?.id}`)}>
          <MoreVertOutlinedIcon />
        </MoreIcon>
        {/* {isSelect ? (
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Typography color="text.primary" variant="subtitle1">
              Selected
            </Typography>
            <Button variant="outlined" startIcon={<DeleteForeverRoundedIcon />} onClick={handleClickOpen}>
              <Typography variant="overline">Delete</Typography>
            </Button>
            <MoreIcon onClick={() => dispatch(onDisable())}>
              <ClearRoundedIcon />
            </MoreIcon>
          </Stack>
        ) : (
          <MoreIcon onClick={() => dispatch(onEnable())}>
            <MoreVertOutlinedIcon />
          </MoreIcon>
        )} */}
      </Stack>
      <DeleteModal selectedValue={selectedValue} open={open} onClose={handleClose} />
    </>
  );
};

export default ChatHeader;
