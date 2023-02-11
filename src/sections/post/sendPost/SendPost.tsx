import { Button, CircularProgress, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MentionExample from 'src/components/textEditor';
import { basicSendPostSelector, resetSendPost } from 'src/redux/slices/post/sendPost';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { ERROR } from 'src/theme/palette';
import { useLazyGetSocialPostQuery } from 'src/_requests/graphql/post/getSocialPost.generated';
import { useLazyGetFundRaisingPostQuery } from 'src/_requests/graphql/post/post-details/queries/getFundRaisingPost.generated';
import SendCampaignPostCard from './SendCampaignPostCard';
import SendSocialPostCard from './SendSocialPostCard';
//icon
import { Icon } from 'src/components/Icon';

function SendPost() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const [listOfRichs, setListOfRichs] = useState<any[]>([]);
  const [textLimitation, setTextLimitation] = useState<string>('');
  const [getSocialPost, { data: socialPostData, isFetching: getSocialPostFetching }] = useLazyGetSocialPostQuery();
  const socialPost = socialPostData?.getSocialPost?.listDto?.items?.[0];
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const postSent = useSelector(basicSendPostSelector);
  const idSendPost = localStorage.getItem('idSendPost');
  const typeSendPostType = localStorage.getItem('typeSendPostType');

  const listOfTag: any[] = [];
  const listOfMention: any[] = [];
  let postText = '';
  listOfRichs.map((item) => {
    item?.children?.map((obj: any) => {
      if (obj.type) {
        obj.type === 'tag' ? listOfTag.push(obj?.id) : obj.type === 'mention' ? listOfMention.push(obj?.id) : null;
      }
      obj.text
        ? (postText += obj.text)
        : obj.type === 'tag'
        ? (postText += `#${obj.title}`)
        : obj.type === 'mention'
        ? (postText += `╣${obj.fullname}╠`)
        : (postText += ' ');
    });
    if (listOfRichs.length > 1) {
      postText += '\\n';
    }
  });
  useEffect(() => {
    if (postSent?.id) {
      if (postSent?.postType === 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: postSent?.id },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: postSent?.id } } });
      }
    } else {
      if (typeSendPostType === 'campaign') {
        getFundRaisingPost({
          filter: {
            dto: { id: idSendPost },
          },
        });
      } else {
        getSocialPost({ filter: { dto: { id: idSendPost } } });
      }
    }
  }, [getFundRaisingPost, getSocialPost, idSendPost, postSent?.id, postSent?.postType, typeSendPostType]);

  return (
    <>
      <Stack>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ py: 1.5, px: 2, borderBottom: `1px solid ${theme.palette.grey[100]}` }}
        >
          <Stack direction={'row'} spacing={2.5} alignItems={'center'}>
            <IconButton
              onClick={() => {
                router.back();
                dispatch(resetSendPost());
              }}
              sx={{ padding: 0 }}
            >
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1">Write a message</Typography>
          </Stack>
          <Link href={`${PATH_APP.post.sendPost.sendToConnections}`} shallow passHref>
            <Button variant="contained" size="small" sx={{ height: 32 }} disabled={Number(textLimitation) >= 1000}>
              Next
            </Button>
          </Link>
        </Stack>
        <Stack sx={{ mt: 2, px: 2 }}>
          {typeSendPostType === 'campaign' || postSent?.postType === 'campaign' ? (
            getFundRaisingPostFetching ? (
              <CircularProgress size={16} />
            ) : (
              <SendCampaignPostCard sentPost={campaignPost} />
            )
          ) : getSocialPostFetching ? (
            <CircularProgress size={16} />
          ) : (
            <SendSocialPostCard sentPost={socialPost} />
          )}
        </Stack>
        <Stack sx={{ px: 2 }}>
          <MentionExample
            setListOfRichs={setListOfRichs}
            setTextLimitation={setTextLimitation}
            eventType={'sendPost'}
            placeholder="Write A Message"
          />
        </Stack>

        {Number(textLimitation) >= 1000 ? (
          <Stack
            direction={'row'}
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              bgcolor: 'background.neutral',
              p: 1,
              m: 2,
            }}
          >
            <Icon name="Exclamation-Mark" color="error.main" type="solid" />
            <Typography variant="subtitle2" color={ERROR.main}>
              Characters should be less than 1,000.
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </>
  );
}

export default SendPost;
