import { Box, Button, CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Icon } from '../Icon';
import { useDeleteFundraisingPostMutation } from 'src/_requests/graphql/post/mutations/deleteFundRaisingPost.generated';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { useUpdateFundRaisingPostMutation } from 'src/_requests/graphql/post/mutations/updateFundRaisingPost.generated';
import { CreateFundRaisingPostInput } from 'src/@types/sections/serverTypes';

interface IHeaderCL {
  title: string;
  postId?: string;
  post?: CreateFundRaisingPostInput;
}

function HeaderCampaignLanding(props: IHeaderCL) {
  const { title, postId, post } = props;
  const { back } = useRouter();
  const [publishPost, { isLoading: loadingPublish }] = useUpdateFundRaisingPostMutation();
  const [deletePost, { isLoading: loadingDelete }] = useDeleteFundraisingPostMutation();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handlePublishPost = () => {
    publishPost({
      fundRaisingPost: {
        dto: {
          audience: post.audience,
          body: post.body,
          category: post.category,
          coverImageUrl: post.coverImageUrl,
          deadline: post.deadline,
          id: post.id,
          mentionedUserIds: post.mentionedUserIds,
          pictureUrls: post.pictureUrls,
          placeId: post.placeId,
          status: post.status,
          summary: post.summary,
          tagIds: post.tagIds,
          target: post.target,
          title: post.title,
          videoUrls: post.videoUrls,
        },
      },
    }).unwrap().then(res => console.log(res))
  };
  const handleDeletePost = () => {
    deletePost({ fundRaisingPost: { dto: { id: postId } } })
      .unwrap()
      .then((res) => {
        if (res.deleteFundRaisingPost.isSuccess === true) {
          setOpenDialog(false);
          back();
        }
      });
  };
  return (
    <Box
      sx={{ height: 60, bgcolor: (theme) => theme.palette.surface.main, p: 1 }}
      display="flex"
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Typography variant="subtitle1">
        <IconButton onClick={() => back()}>
          <Icon name="left-arrow-1" color="grey.500" />
        </IconButton>
        {title}
      </Typography>
      {title === 'Details' ? (
        <Box>
          <IconButton onClick={() => setOpenDialog(true)}>
            <Icon name="trash" color="grey.500" />
          </IconButton>
          <Button variant="contained" sx={{ ml: 1 }} onClick={handlePublishPost}>
            Publish
          </Button>
        </Box>
      ) : null}
      <BottomSheet
        open={openDialog}
        onDismiss={() => setOpenDialog(!openDialog)}
        header={
          <Typography variant="subtitle1" sx={{ p: 2 }}>
            Are you sure to delete this draft?
          </Typography>
        }
      >
        <Divider />
        <IconButton sx={{ mt: 1 }} onClick={handleDeletePost}>
          {loadingDelete ? (
            <CircularProgress color="error" size={12} />
          ) : (
            <Typography variant="body2" color="error">
              <Icon name="trash" color="error.main" />
              Delete Draft
            </Typography>
          )}
        </IconButton>
        <br />
        <IconButton sx={{ mt: 1, mb: 1 }} onClick={() => setOpenDialog(false)}>
          <Icon name="Close" type="linear" />
          <Typography variant="body2">Discard</Typography>
        </IconButton>
      </BottomSheet>
    </Box>
  );
}

export default HeaderCampaignLanding;
