import { Box, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MessageText1 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { EntityType } from 'src/@types/sections/serverTypes';
import { setSendPostId, setSendPostType } from 'src/redux/slices/post/sendPost';
import { setSharedPostId, setSharedPostType } from 'src/redux/slices/post/sharePost';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useCreateLikeMutation } from 'src/_requests/graphql/postbehavior/mutations/createLike.generated';
//icon
import { Icon } from 'src/components/Icon';

interface IPostAction {
  postType?: 'campaign' | 'social';
  like?: number;
  comment: string;
  share: string;
  view: string;
  setCommentOpen?: any;
  commentOpen?: any;
  id: string;
  isLikedByUser?: boolean;
  likeChanged?: (status: boolean) => void;
  countLikeChanged?: (status: number) => void;
  inDetails?: boolean;
  commentsCount?: string | null | undefined;
  sharedSocialPost?: any;
  sharedCampaignPost?: any;
}

const ActiontextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
const IconButtonAction = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const PostActions: FC<IPostAction> = ({
  inDetails = false,
  like,
  comment,
  share,
  view,
  setCommentOpen,
  commentOpen,
  likeChanged,
  id,
  isLikedByUser,
  countLikeChanged,
  postType,
  commentsCount,
  sharedSocialPost,
  sharedCampaignPost,
}) => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(!anchorEl);
  };

  const [createLikeMutation] = useCreateLikeMutation();
  const [countLike, setCountLike] = useState(Number(like));
  const [isLike, setIsLike] = useState(isLikedByUser);

  const createLike = () => {
    createLikeMutation({
      like: {
        dto: {
          entityType: EntityType.Post,
          entityId: id,
        },
      },
    });
  };

  function likeHandler() {
    if (isLike) {
      setIsLike(false);
      setCountLike(countLike - 1);
    } else {
      setIsLike(true);
      setCountLike(countLike + 1);
    }
  }
  const onCopy = () => {
    setCopied(true);
    if (copied) {
      enqueueSnackbar('Copied!');
    }
  };
  const handleSharedCampaignPost = () => {
    dispatch(setSharedPostId(sharedCampaignPost?.id));
    dispatch(setSharedPostType('campaign'));
    localStorage.setItem('idSharedPost', sharedCampaignPost?.id);
    localStorage.setItem('typeSharedPostType', 'campaign');
    push(`${PATH_APP.post.sharePost.index}/${id}/${postType}`);
  };

  const handleSharedSocialPost = () => {
    dispatch(setSharedPostId(sharedSocialPost?.id));
    dispatch(setSharedPostType('social'));
    localStorage.setItem('idSharedPost', sharedSocialPost?.id);
    localStorage.setItem('typeSharedPostType', 'social');
    push(`${PATH_APP.post.sharePost.index}/${id}/${postType}`);
  };
  const handleSharePost = () => {
    dispatch(setSharedPostId(id));
    dispatch(setSharedPostType(postType || 'social'));
    localStorage.setItem('idSharedPost', id);
    localStorage.setItem('typeSharedPostType', postType || 'social');
    push(`${PATH_APP.post.sharePost.index}/${id}/${postType}`);
  };
  const handleSentCampaignPost = () => {
    dispatch(setSendPostId(id));
    dispatch(setSendPostType('social'));
    localStorage.setItem('idSendPost', id);
    localStorage.setItem('typeSendPostType', 'social');
    push(`${PATH_APP.post.sendPost.index}/${id}/${postType}`);
  };
  const handleSentPost = () => {
    dispatch(setSendPostId(id));
    dispatch(setSendPostType(postType || ''));
    localStorage.setItem('idSendPost', id);
    localStorage.setItem('typeSendPostType', postType || '');
    push(`${PATH_APP.post.sendPost.index}/${id}/${postType}`);
  };
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center">
        <IconButtonAction
          sx={{ p: 0.5 }}
          onClick={() => {
            createLike();
            likeChanged(!isLikedByUser);
            likeHandler();
            countLikeChanged(like);
          }}
        >
          {!!isLikedByUser ? (
            <Icon name="heart" type="solid" color="error.main" />
          ) : (
            <Icon name="heart" type="linear" color="grey.500" />
          )}
        </IconButtonAction>

        {inDetails ? (
          <ActiontextStyle variant="body2">{like}</ActiontextStyle>
        ) : countLike === NaN ? (
          <ActiontextStyle variant="body2">{like}</ActiontextStyle>
        ) : (
          <ActiontextStyle variant="body2">{countLike}</ActiontextStyle>
        )}
      </Stack>

      <Box onClick={() => setCommentOpen(!commentOpen)}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButtonAction sx={{ p: 0.5 }}>
            <MessageText1 size={20} />
          </IconButtonAction>
          <ActiontextStyle variant="body2">{commentsCount ? commentsCount : comment}</ActiontextStyle>
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center">
        <IconButtonAction sx={{ p: 0.5 }} onClick={handleClick}>
          <Icon name="Reshare" type="linear" color="grey.500" />
          <ActiontextStyle variant="body2">{share}</ActiontextStyle>
        </IconButtonAction>
      </Stack>

      <BottomSheet open={anchorEl} onDismiss={() => setAnchorEl(!anchorEl)}>
        <Stack py={2} px={2}>
          <IconButton
            sx={{ justifyContent: 'start' }}
            onClick={
              sharedSocialPost
                ? handleSharedSocialPost
                : sharedCampaignPost
                ? handleSharedCampaignPost
                : handleSharePost
            }
          >
            <Icon name="Reshare" type="linear" color="grey.500" />
            <Typography variant="body2" color="text.primary" sx={{ m: 1 }}>
              Share
            </Typography>
          </IconButton>
          <IconButton
            sx={{ justifyContent: 'start' }}
            onClick={sharedCampaignPost ? handleSentCampaignPost : handleSentPost}
          >
            <Icon name="Send" type="linear" color="grey.500" />
            <Typography variant="body2" color="text.primary" sx={{ m: 1 }}>
              Send in Chat
            </Typography>
          </IconButton>
          <CopyToClipboard
            text={`https://devpwa.aws.gardenoflove.co/post/campaign-post/post-details/${id}`}
            onCopy={onCopy}
          >
            <IconButton sx={{ justifyContent: 'start' }}>
              <Image src="/icons/link/24/Outline.svg" width={24} height={24} alt="link-icon" />
              <Typography variant="body2" color="text.primary" sx={{ m: 1 }}>
                Share via
              </Typography>
            </IconButton>
          </CopyToClipboard>
        </Stack>
      </BottomSheet>

      <Stack direction="row" alignItems="center">
        <IconButtonAction sx={{ p: 0.5 }}>
          <Icon name="Eye" type="linear" color="grey.500" />
        </IconButtonAction>
        <ActiontextStyle variant="body2">{view}</ActiontextStyle>
      </Stack>
    </Stack>
  );
};

export default PostActions;
