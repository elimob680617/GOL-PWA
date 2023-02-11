import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseCircle, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { addedEmail, userEmailsSelector } from 'src/redux/slices/profile/userEmail-slice';
import { addedSocialMedia } from 'src/redux/slices/profile/userSocialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { useUpsertUserEmailMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
export default function EmailDiscardDialog() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const personEmail = useSelector(userEmailsSelector);
  const [upsertUserEmail] = useUpsertUserEmailMutation();

  function handlerDiscardEmail() {
    dispatch(addedEmail({ audience: AudienceEnum.Public }));
    router.push('/profile/user/contact-info/list');
  }

  const handleSaveChangeEmail = async () => {
    const resData: any = await upsertUserEmail({
      filter: {
        dto: {
          id: personEmail?.id,
          email: personEmail?.email,
          audience: personEmail?.audience,
        },
      },
    });

    if (resData.data?.upsertUserEmail?.isSuccess) {
      router.push('/profile/user/contact-info/list');
      dispatch(addedEmail({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(addedEmail({ audience: AudienceEnum.Public }));
    dispatch(addedSocialMedia({ audience: AudienceEnum.Public }));
    router.push('/profile/user/contact-info/list');
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Do you want to save changes?
          </Typography>
        </Box>

        <IconButton onClick={handleBackRoute}>
          <CloseCircle />
        </IconButton>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangeEmail}>
          <Save2 fontSize="24" variant="Outline" />
          <Typography variant="body2" color="text.primary">
            Save Change
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardEmail}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
