import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseCircle, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { phoneNumberAdded, userPhoneNumberSelector } from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpsertPhoneNumberMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertPhoneNumber.generated';

export default function PhoneNumberDiscard() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [upsertUserPhoneNumber] = useUpsertPhoneNumberMutation();

  function handlerDiscardPhoneNumber() {
    dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  }

  const handleSaveChangePhoneNumber = async () => {
    const resData: any = await upsertUserPhoneNumber({
      filter: {
        dto: {
          id: userPhoneNumber?.id,
          phoneNumber: userPhoneNumber?.phoneNumber,
          audience: userPhoneNumber?.audience,
        },
      },
    });

    if (resData.data?.upsertUserPhoneNumber?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.list);
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserPhoneNumber?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserPhoneNumber?.messagingKey, { variant: 'error' });
    }
  };

  const handleBackRoute = () => {
    dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.list);
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
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleSaveChangePhoneNumber}>
          <Save2 fontSize="24" variant="Outline" />
          <Typography variant="body2" color="text.primary">
            Save Change
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handlerDiscardPhoneNumber}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
