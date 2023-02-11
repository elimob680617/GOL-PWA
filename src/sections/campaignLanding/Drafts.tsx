import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { DraftPostCard, HeaderCampaignLanding, MenuItemCampaignLanding } from 'src/components/campaignLanding';
import NGOsIcon from 'public/icons/campaignLanding/NGOs.svg';
import { useLazyGetHomePageFundRaisingPostsQuery } from 'src/_requests/graphql/post/getHomePageFundRaisingPosts.generated';
import { PostStatus } from 'src/@types/sections/serverTypes';
import useAuth from 'src/hooks/useAuth';
import noDrafts from 'public/icons/campaignLanding/NoDrafts.svg';

function Drafts() {
  const [getDraft] = useLazyGetHomePageFundRaisingPostsQuery();
  const [drafts, setDrafts] = useState([]);
  const user = useAuth();
  
  useEffect(() => {
    getDraft({
      filter: { pageSize: 900, pageIndex: 0, dto: { status: PostStatus.Draft, ownerUserId: user?.user?.id } },
    })
      .unwrap()
      .then((res) => {
        setDrafts(res?.getHomePageFundRaisingPosts?.listDto?.items);
      });
  }, [getDraft, user]);
  return (
    <Box>
      <HeaderCampaignLanding title="Campaign Landing" />
      <Box display={'flex'} sx={{ overflow: 'auto' }}>
        <MenuItemCampaignLanding active="drafts" />
      </Box>
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.surface.main,
          height: 214,
        }}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexWrap={'wrap'}
      >
        <Image src={NGOsIcon} alt="NGOs" />
        <Typography variant="overline" color={'text.secondary'} sx={{ width: '100%', textAlign: 'center' }}>
          Sorry! Creating campaign not available in Application, please use Website.
        </Typography>
      </Box>
      <Box>
        {drafts?.length > 0 ? (
          drafts.map((item) => <DraftPostCard key={item.id} data={item} drafts={drafts} setDrafts={setDrafts}/>)
        ) : (
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{pt:3}}>
            <Image src={noDrafts} alt="noDrafts" />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Drafts;
