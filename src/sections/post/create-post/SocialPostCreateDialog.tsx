import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import CreatePostMainFotter from './CreatePostMainFootter';
import CreatePostMainHeader from './CreatePostMainHeader';

const UserFullNameStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  lineHeight: '22.5px',
  fontSize: '18px',
  color: theme.palette.grey[900],
}));

const ViewrTextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 14,
  lineHeight: '17.5px',
  color: theme.palette.grey[900],
}));

const ViewerButtonStyle = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 32,
}));

const SocialPostCreateDialog: FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Dialog maxWidth="lg" fullWidth open={true} aria-labelledby="responsive-dialog-title">
      <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
        <CreatePostMainHeader />
      </DialogTitle>
      <DialogContent sx={{ height: 536, marginTop: 2 }}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar sx={{ width: 48, height: 48 }} />
          <Stack spacing={1}>
            <UserFullNameStyle variant="h6">Ardalan Rezaie</UserFullNameStyle>
            <ViewerButtonStyle
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <Image src="/icons/location/global.svg" width={20} height={20} alt="post-viewers" />
              <ViewrTextStyle variant="body2">Public</ViewrTextStyle>
              <Image src="/icons/arrow/arrow-down.svg" width={20} height={20} alt="post-viewers" />
            </ViewerButtonStyle>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Public</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '0!important' }}>
        <CreatePostMainFotter />
      </DialogActions>
    </Dialog>
  );
};

export default SocialPostCreateDialog;
