import { Box, Button, IconButton, Stack, styled, Typography } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PATH_APP } from 'src/routes/paths';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { EntityType } from 'src/@types/sections/serverTypes';
import { getFileInputsInformations } from 'src/utils/fileFunctions';
import { useUploadImageMutation } from 'src/_requests/graphql/upload/mutations/createFile.generated';
import { useSelector } from 'src/redux/store';
import { basicCreateSocialPostSelector } from 'src/redux/slices/post/createSocialPost';
import { getUploadingFiles } from 'src/redux/slices/upload';
import { LoadingButton } from '@mui/lab';
import { IMediaProps, LimitationType } from 'src/components/upload/GolUploader';
import { ERROR } from 'src/theme/palette';
import ExclamationMark from 'public/icons/Exclamation Mark/24/Outline.svg';
import { useTheme } from '@mui/system';

const PostButtonStyle = styled(LoadingButton)(() => ({
  width: 120,
}));

const WrapperStyle = styled(Stack)(({ theme }) => ({
  // paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  // height: 64,
  width: '100%',
  height: 48,
  position: 'relative',
}));
const DivideLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(-1),
  right: 0,
  left: 0,
  backgroundColor: theme.palette.background.neutral,
  height: '1px',
}));

const OkStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.grey[800],
  border: `1px solid #C8D3D9`,
  width: 120,
}));

const Input = styled('input')({
  display: 'none',
});

interface ICreatePostMainFotterProps {
  addImage: () => void;
  startPosting: () => void;
  loading: boolean;
  limitationError: LimitationType;
  okLimitationClicked: () => void;
  media: IMediaProps[];
  disableButtons: boolean;
  textLimitation: any;
}

const CreatePostMainFootter: FC<ICreatePostMainFotterProps> = (props) => {
  const {
    addImage,
    startPosting,
    loading,
    limitationError,
    okLimitationClicked,
    media,
    disableButtons,
    textLimitation,
  } = props;
  const post = useSelector(basicCreateSocialPostSelector);
  const uploadingFiles = useSelector(getUploadingFiles);
  const [hasGIF, setHasGIF] = useState<number>(0);
  const [hasText, setHasText] = useState<boolean>(false);

  const theme = useTheme();
  useEffect(() => {
    console.log(media);
    if (media?.length === 0) {
      setHasGIF(0);
    } else if (media[0]?.type === 'gif') {
      setHasGIF(1);
    } else {
      setHasGIF(2);
    }
  }, [media]);
  useEffect(() => {
    if (post.text.length === 1 && (post.text[0] as any).children[0].text === '') {
      setHasText(true);
    } else {
      setHasText(false);
    }
  });
  return (
    <WrapperStyle
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      sx={[(theme) => ({})]}
    >
      <DivideLine />
      {textLimitation >= 3000 ? (
        <Box
          sx={{
            width: '100%',
            height: 'rem',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Image src={ExclamationMark} alt="" />
          <Typography variant="button" color={ERROR.main}>
            Characters should be less than 3,000.
          </Typography>
        </Box>
      ) : null}
      {!limitationError && (
        <Stack direction="row" spacing={3} alignItems="center">
          <IconButton
            style={hasGIF === 1 ? { display: 'none' } : null}
            onClick={() => {
              if (!disableButtons) addImage();
            }}
            aria-label="upload picture"
            component="span"
          >
            <img src="/icons/media/gallery.svg" width={24} height={24} alt="import-image" />
          </IconButton>
          {!disableButtons && (
            <Stack direction="row" spacing={3} alignItems="center">
              <Link href={PATH_APP.post.createPost.socialPost.addGif} shallow passHref>
                <IconButton style={hasGIF === 2 ? { display: 'none' } : null}>
                  <img src="/icons/gif.svg" width={24} height={24} alt="post-gifs" />
                </IconButton>
              </Link>
              <Link href={PATH_APP.post.createPost.socialPost.addLocation} shallow passHref>
                <IconButton>
                  <img src="/icons/location/location.svg" width={24} height={24} alt="post-gifs" />
                </IconButton>
              </Link>
            </Stack>
          )}

          {disableButtons && (
            <Stack direction="row" spacing={3} alignItems="center">
              <IconButton style={hasGIF === 2 ? { display: 'none' } : null}>
                <img src="/icons/gif.svg" width={24} height={24} alt="post-gifs" />
              </IconButton>
              <IconButton>
                <img src="/icons/location/location.svg" width={24} height={24} alt="post-gifs" />
              </IconButton>
            </Stack>
          )}
        </Stack>
      )}

      {/* FIXME add primary variant to button */}
      {/* FIXME fix button styles for overrides */}

      {limitationError && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Stack spacing={1} direction="row" alignItems="center">
            <img src="/icons/warning/Outline.svg" width={24} height={24} alt="limitation-warning" />
            <Typography
              variant="body2"
              sx={{ color: 'error.main', fontWeight: '300', fontSize: '14px', lineHeight: '17.5px' }}
            >
              {limitationError === 'videoSize'
                ? 'The video file that you have selected is larger than 2 GB. Unable to send file.'
                : limitationError === 'imageSize'
                ? 'The Image file that you have selected is larger than 30 MB. Unable to send file.'
                : limitationError === 'imageCount' || limitationError === 'videoCount'
                ? 'Please reduce the number of media files you are attaching. You can add maximum 10 images and 5 videos'
                : ''}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <OkStyle
              onClick={() => okLimitationClicked()}
              // variant="primary"
              sx={{ color: 'grey.800', border: '1px solid' }}
            >
              OK
            </OkStyle>
          </Stack>
        </Stack>
      )}
    </WrapperStyle>
  );
};

export default CreatePostMainFootter;
