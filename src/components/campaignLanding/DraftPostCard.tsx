import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useDeleteFundraisingPostMutation } from 'src/_requests/graphql/post/mutations/deleteFundRaisingPost.generated';
import { Icon } from '../Icon';
import noCoverImage from 'public/icons/campaignLanding/noCoverImage.svg';

interface IDraftPostCard {
  data: any;
  drafts: any;
  setDrafts: any;
}

function DraftPostCard(props: IDraftPostCard) {
  const { data, drafts, setDrafts } = props;
  const [deletePost, { isLoading: loadingDelete }] = useDeleteFundraisingPostMutation();
  const { push } = useRouter();

  const handleDeleteDraft = (e) => {
    deletePost({ fundRaisingPost: { dto: { id: e.target.value } } })
      .unwrap()
      .then((res) => {
        if (res.deleteFundRaisingPost.isSuccess === true) {
          setDrafts(drafts.filter((object) => object.id !== e.target.value));
        }
      });
  };
  console.log(data.id);
  return (
    <Box sx={{ bgcolor: (theme) => theme.palette.surface.main, m: 2, borderRadius: '8px', minHeight: 330 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{data?.title !== '' ? data?.title : 'No Title'}</Typography>
        <Typography variant="body2" color="text.secondary">
          Edited {data.updatedDateTime} ago
        </Typography>
      </Box>
      {data?.coverImageUrl !== '' ? (
        <Box>
          <img src={data?.coverImageUrl} alt="coverImageUrl" width="100%" />
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
      <Box sx={{ p: 2, pt: 3 }} display="flex" justifyContent={'flex-end'}>
        <Button color="error" onClick={handleDeleteDraft} value={data.id}>
          {' '}
          <Icon name="trash" color="error.main" />
          Delete
        </Button>
        <Button variant="contained" sx={{ ml: 1 }} onClick={() => push(`/campaigns/details/${data.id}`)}>
          {' '}
          Publish
        </Button>
      </Box>
    </Box>
  );
}

export default DraftPostCard;
