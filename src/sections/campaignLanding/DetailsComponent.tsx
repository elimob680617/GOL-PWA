import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { HeaderCampaignLanding } from 'src/components/campaignLanding';
import { Icon } from 'src/components/Icon';
import { useLazyGetFundRaisingPostQuery } from 'src/_requests/graphql/post/post-details/queries/getFundRaisingPost.generated';
import noCoverImage from 'public/icons/campaignLanding/noCoverImage.svg';
import noBody from 'public/icons/campaignLanding/noBody.svg';
import Image from 'next/image';
import PostDetailsNgoInfo from '../post/campaignPost/postDetails/PostDetailsNgoInfo';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import ReactHtmlParser from 'react-html-parser';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 0 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? 'primary' : '#308fe8',
  },
}));

function DetailsComponent() {
  const [getDetails] = useLazyGetFundRaisingPostQuery();

  const { query } = useRouter();
  const postId = query.id;
  const [post, setPost] = useState([]);
  useEffect(() => {
    if (query?.id) {
      getDetails({ filter: { dto: { id: postId[1] } } })
        .unwrap()
        .then((res) => {
          setPost(res.getFundRaisingPost.listDto.items);
        });
    }
  }, [getDetails, postId, query?.id]);
  console.log(post);
  return (
    <Box>
      <HeaderCampaignLanding title="Details" postId={post[0]?.id} post={post[0]}/>
      {post[0]?.coverImageUrl !== '' ? (
        <Box>
          <img src={post[0]?.coverImageUrl} alt="coverImageUrl" width="100%" />
        </Box>
      ) : (
        <Box
          sx={{ height: 176, width: '100%', bgcolor: (theme) => theme.palette.background.neutral }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Image src={noCoverImage} alt="coverImageUrl" />
          <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
            There is no Cover Photo
          </Typography>
        </Box>
      )}
      <Box sx={{ p: 2 }} display="flex" justifyContent={'space-between'}>
        <Typography variant="subtitle1">{post[0]?.title !== '' ? post[0]?.title : 'No Title'}</Typography>
        <IconButton>
          <Icon name="Menu" type="solid" />
        </IconButton>
      </Box>
      <Box sx={{ p: 2 }}>
        <PostDetailsNgoInfo
          fullName={post[0]?.fullName}
          avatar={post[0]?.userAvatarUrl || undefined}
          location={post[0]?.placeDescription}
          createdDateTime={`saved ${post[0]?.createdDateTime} ago`}
          userType={UserTypeEnum.Ngo}
          ownerUserId={post[0]?.ownerUserId}
          isMine={post[0]?.isMine}
        />
      </Box>
      <Box
        sx={{
          height: 126,
          bgcolor: (theme) => theme.palette.background.neutral,
          color: (theme) => theme.palette.primary.main,
          p: 2,
        }}
      >
        <Typography variant="subtitle2" color={(theme) => theme.palette.primary.main} sx={{ mb: 2 }}>
          {post[0]?.target === 0 ? 'No Money added' : `$${post[0]?.raisedMoney} raised of $${post[0]?.target}`}
        </Typography>
        <BorderLinearProgress
          variant="determinate"
          value={post[0]?.raisedMoney !== 0 ? (post[0]?.raisedMoney * 100) / post[0]?.target : 0}
          sx={{
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary' : 'secondary'),
            },
          }}
        />
        <Box sx={{ width: '100%' }} display="flex" justifyContent={'flex-end'}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              p: 1,
              borderRadius: 0.5,
              m: 2,
              maxWidth: 165,
              textAlign: 'center',
            }}
          >
            {post[0]?.dayLeft ? (
              <Box>
                {post[0]?.dayLeft > 0 && (
                  <Typography variant="subtitle2" color={(theme) => theme.palette.primary.dark}>
                    {post[0]?.dayLeft} days left
                  </Typography>
                )}
              </Box>
            ) : (
              <Box>
                {post[0]?.dayLeft === 0 ? (
                  <Typography variant="subtitle2" color={(theme) => theme.palette.warning.dark}>
                    Expired
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" color={(theme) => theme.palette.primary.dark}>
                    No deadline added
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 2, maxWidth: '100%', overflowX: 'hidden' }}>
        {post[0]?.body === '' ? (
          <Box display="flex" justifyContent={'center'} alignItems="center">
            <Image src={noBody} alt="noBody" />
          </Box>
        ) : (
          <Typography>{ReactHtmlParser(post[0]?.body || '')}</Typography>
        )}
      </Box>
    </Box>
  );
}

export default DetailsComponent;
