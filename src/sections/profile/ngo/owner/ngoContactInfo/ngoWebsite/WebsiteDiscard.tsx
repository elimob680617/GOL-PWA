import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { userWebsiteSelector, websiteAdded } from 'src/redux/slices/profile/userWebsite-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpsertWebsiteMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertWebsite.generated';

export default function WebsiteDiscardDialog() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const personWebsite = useSelector(userWebsiteSelector);
  const [upsertUserWebsite] = useUpsertWebsiteMutation();

  function handlerDiscardWebsite() {
    dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  }

  const handleSaveChangeWebsite = async () => {
    const resData: any = await upsertUserWebsite({
      filter: {
        dto: {
          id: personWebsite?.id,
          webSiteUrl: personWebsite?.webSiteUrl,
          audience: personWebsite?.audience,
        },
      },
    });

    if (resData.data?.upsertWebSite?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.list);
      dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertWebSite?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertWebSite?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(websiteAdded({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ p: 0 }} onClick={handleBackRoute}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Do you want to save changes farshad?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangeWebsite}>
          <Save2 fontSize="24" variant="Outline" />
          <Typography variant="body2" color="text.primary">
            Save Change
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardWebsite}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
