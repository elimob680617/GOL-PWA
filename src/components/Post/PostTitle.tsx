import { Box, Button, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Language, Circle, MoreHoriz } from '@mui/icons-material';
import { FC, ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { PATH_APP } from 'src/routes/paths';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { BottomSheet } from 'react-spring-bottom-sheet';
import Image from 'next/image';

import saveIcon from 'public/icons/save.png';
import reportIcon from 'public/icons/flag/24/Outline.svg';
import eyeIcon from 'public/icons/eye.png';
import unfollow from 'public/icons/unfollow.png';
import { useRouter } from 'next/router';

interface IPostTitle {
  avatar: ReactNode;
  username: string;
  Date: string;
  PostNo: string;
  description?: string;
  editCallback?: () => void;
  location?: string;
  userId: string;
  userType: UserTypeEnum;
  isMine: boolean;
  postId: string;
}

const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  margin: 1,
}));

const PostTitle: FC<IPostTitle> = ({
  avatar,
  username,
  Date,
  PostNo,
  description,
  editCallback,
  location,
  isMine,
  userId,
  postId,
  userType,
}: IPostTitle) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(!anchorEl);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const edit = () => {
    if (editCallback) {
      handleClose();
      editCallback();
    }
  };
  const handelReport = () => {
    const reportData={username,userId,postId}
        localStorage.setItem("reportData",JSON.stringify(reportData));

    // localStorage.setItem('userId', userId);
    // localStorage.setItem('username', username);
    // localStorage.setItem('postId', postId);
    router.push('post/report/post-report');
  };
  const SelectedLocationStyle = styled(Typography)(({ theme }) => ({
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '17.5px',
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    cursor: 'pointer',
  }));

  const profileRoute = useMemo(() => {
    if (userType === UserTypeEnum.Ngo) {
      if (isMine) return PATH_APP.profile.ngo.root;
      return PATH_APP.profile.ngo.root + '/view/' + userId;
    } else {
      if (isMine) return '/profile/user';
      return '/profile/user/view/' + userId;
    }
  }, [isMine, userId, userType]);

  return (
    <>
      <Stack
        sx={{ paddingRight: 2, paddingLeft: 2 }}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2}>
          <Link href={profileRoute} passHref>
            <Box>{avatar}</Box>
          </Link>
          <Stack spacing={1}>
            <Stack spacing={1} direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href={profileRoute} passHref>
                <Typography variant="h6">{username}</Typography>
              </Link>
              {location && (
                <Stack justifyContent="center">
                  <img src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
                </Stack>
              )}
              {location && (
                <Stack sx={{ flex: 1 }} spacing={0.5} direction="row" alignItems="center" flexWrap="nowrap">
                  <Box sx={{ minWidth: 16, minHeight: 16 }}>
                    <img src="/icons/location/24/Outline.svg" width={20} height={20} alt="selected-location" />
                  </Box>
                  <SelectedLocationStyle>
                    <Typography variant="subtitle2" color="text.secondary">
                      {location}
                    </Typography>
                  </SelectedLocationStyle>
                </Stack>
              )}
            </Stack>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {Date}
              </Typography>
              <PostTitleDot>
                <Stack justifyContent="center">
                  <img src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
                </Stack>
              </PostTitleDot>

              {PostNo === 'simple' ? (
                <Stack justifyContent="center">
                  <img src="/icons/Earth/24/Outline.svg" width={20} height={20} alt="selected-location" />
                </Stack>
              ) : (
                'sc'
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack justifyContent="flex-start">
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreHoriz sx={{ color: '#8798A1' }} />
          </IconButton>
        </Stack>
      </Stack>
      {isMine ? (
        <BottomSheet open={anchorEl} onDismiss={() => setAnchorEl(!anchorEl)}>
          <IconButton sx={{ justifyContent: 'start' }} disableRipple onClick={() => edit()}>
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                edit
              </Typography>
            </IconButton>
        </BottomSheet>
      ) : (
        <BottomSheet open={anchorEl} onDismiss={() => setAnchorEl(!anchorEl)}>
          <Stack py={2} px={2}>
            <Button sx={{ justifyContent: 'start'}}>
              ‌<Image src={saveIcon} alt="save" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                Save
              </Typography>
            </Button>
            <Button sx={{ justifyContent: 'start' }}>
              ‌<Image src={unfollow} alt="unfollow" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                Unfollow
              </Typography>
            </Button>
            <Button sx={{ justifyContent: 'start' }}>
              ‌<Image src={eyeIcon} alt="eyeIcon" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                I don't want to see this post
              </Typography>
            </Button>
            <Button sx={{ justifyContent: 'start' }} onClick={handelReport}>
              ‌<Image src={reportIcon} alt="report" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                Report
              </Typography>
            </Button>
          </Stack>
        </BottomSheet>
      )  }
    </>
  );
};

export default PostTitle;
