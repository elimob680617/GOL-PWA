import { Box, Button, Divider, IconButton, Stack, styled, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'src/redux/store';
import { basicCreateSocialPostSelector, initialState } from 'src/redux/slices/post/createSocialPost';
import { getUploadingFiles } from 'src/redux/slices/upload';
import Link from 'next/link';
import { PATH_APP } from 'src/routes/paths';
import { IMediaProps } from 'src/components/upload/GolUploader';
import { boolean } from 'yup';
import { BottomSheet } from 'react-spring-bottom-sheet';
import Router, { useRouter } from 'next/router';

interface ICreatePostMainHeaderProps {
  startPosting?: () => void;
  loading?: boolean;
  media?: IMediaProps[];
}

const ButtonStyle = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: 0,
}));

const CreatePostMainHeader: FC<ICreatePostMainHeaderProps> = (props) => {
  const { loading, startPosting, media } = props;
  const { replace } = useRouter();

  const post = useSelector(basicCreateSocialPostSelector);
  const uploadingFiles = useSelector(getUploadingFiles);
  const [hasGIF, setHasGIF] = useState<number>(0);
  const [hasText, setHasText] = useState<boolean>(false);
  const [openConfirmBottomSheet, setOpenConfirmBottomSheet] = useState<boolean>(false);

  useEffect(() => {
    if (media?.length === 0) {
      setHasGIF(0);
    } else if (media[0]?.type === 'gif') {
      setHasGIF(1);
    } else {
      setHasGIF(2);
    }
  }, [media]);
  useEffect(() => {
    if (
      post.text.length === 1 &&
      (post.text[0] as any).children.length === 1 &&
      (post.text[0] as any).children[0].text === ''
    ) {
      setHasText(false);
    } else {
      setHasText(true);
    }
  }, [post.text]);

  const hasChanged = () => {
    if (
      post.audience != initialState.audience ||
      post.gifs != initialState.gifs ||
      post.location != initialState.location ||
      // post.picturesUrls != initialState.picturesUrls ||
      post.text != initialState.text ||
      // post.videoUrls != initialState.videoUrls ||
      post.mediaUrls != initialState.mediaUrls ||
      uploadingFiles.length > 0
    ) {
      return true;
    }
    return false;
  };

  const needToConformDialog = () => {
    if (hasChanged()) {
      setOpenConfirmBottomSheet(true);
    } else {
      replace(PATH_APP.home.index);
    }
  };

  // useEffect(() => {
  //   window.addEventListener('beforeunload', alertUser);
  //   return () => {
  //     window.removeEventListener('beforeunload', alertUser);
  //   };
  // }, []);
  // const alertUser = (e) => {
  //   e.preventDefault();
  //   e.returnValue = '';
  // };

  // useEffect(() => {
  //   Router.beforePopState(({ url, as, options }) => {
  //     // if (hasChanged()) {
  //     window.location.href = as;
  //     return false;
  //     // }
  //     return true;
  //   });
  // }, []);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={[
        (theme) => ({
          padding: '12px 12.2px 12px 16px',
          borderBottom: `1px solid ${theme.palette.grey[100]}`,
          height: 56,
        }),
      ]}
    >
      <Stack direction="row" alignItems="center">
        {/* <Link href={PATH_APP.home.index} replace passHref> */}
        <IconButton onClick={() => needToConformDialog()} sx={{ padding: 0 }}>
          <Image src="/icons/arrow/left-arrow.svg" width={24} height={24} alt="header-left-arrow" />
        </IconButton>
        {/* </Link> */}
        <Typography
          variant="subtitle1"
          sx={[
            (theme) => ({
              color: theme.palette.grey[800],
              fontWeight: 500,
              marginLeft: '16px',
              lineHeight: '20px',
            }),
          ]}
        >
          Social post
        </Typography>
      </Stack>
      <LoadingButton
        disabled={
          (!post.editMode &&
            !hasText &&
            hasGIF !== 1 &&
            // post.picturesUrls.length === 0 &&
            // post.videoUrls.length === 0 &&
            post.mediaUrls.length === 0 &&
            !post.location &&
            uploadingFiles.length === 0) ||
          (post.editMode &&
            !hasText &&
            hasGIF !== 1 &&
            // post.picturesUrls.length === 0 &&
            // post.videoUrls.length === 0 &&
            post.mediaUrls.length === 0 &&
            !post.location.id &&
            uploadingFiles.length === 0 &&
            media.length === 0)
            || loading
        }
        onClick={() => startPosting()}
        variant="contained"
      >
        {post.editMode ? 'Edit' : 'Post'}
      </LoadingButton>

      <BottomSheet
        open={openConfirmBottomSheet}
        onDismiss={() => setOpenConfirmBottomSheet(false)}
        snapPoints={({ minHeight }) => minHeight}
      >
        <Stack sx={{ padding: 2 }} spacing={2}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '20px', color: 'text.primary' }}
          >
            Want to finish your post later?
          </Typography>
          <Divider />
          <ButtonStyle onClick={() => replace(PATH_APP.home.index)} variant="text">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Image src="/icons/draft/draft.svg" width={24} height={24} alt="draft" />
              <Typography
                variant="body2"
                sx={{ fontWeight: '300', fontSize: '14px', lineHeight: '17.5px', color: 'text.primary' }}
              >
                Save as draft
              </Typography>
            </Stack>
          </ButtonStyle>

          <ButtonStyle variant="text" onClick={() => replace(PATH_APP.home.index)}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Image src="/icons/Close/red-outline.svg" width={24} height={24} alt="draft" />
              <Typography
                variant="body2"
                sx={{ fontWeight: '300', fontSize: '14px', lineHeight: '17.5px', color: 'error.main' }}
              >
                Discard
              </Typography>
            </Stack>
          </ButtonStyle>
        </Stack>
      </BottomSheet>
    </Stack>
  );
};

export default CreatePostMainHeader;
