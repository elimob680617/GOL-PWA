import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, InputAdornment, Stack, TextField, Typography, useTheme } from '@mui/material';
import { ArrowLeft, Eye, EyeSlash } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { emptyEmail, userEmailsSelector } from 'src/redux/slices/profile/userEmail-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeleteUserEmailMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/deleteUserEmail.generated';

function ConfirmPassword() {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [valid, setValid] = useState(true);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [deleteUserEmail, { isLoading }] = useDeleteUserEmailMutation();
  const personEmail = useSelector(userEmailsSelector);
  const handleDeleteEmail = async () => {
    const resDataDelete: any = await deleteUserEmail({
      filter: {
        dto: {
          id: personEmail?.id,
          password: password,
        },
      },
    });

    if (resDataDelete.data.deleteUserEmail?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.list);
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
      enqueueSnackbar('The Email has been successfully deleted', { variant: 'success' });
    }

    if (!resDataDelete.data.deleteUserEmail?.isSuccess) {
      enqueueSnackbar(resDataDelete.data.deleteUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Delete Email
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.primary" sx={{ mt: 4 }}>
            Are you sure you want to remove this email address? To save this setting, please enter your Garden of Love
            password.
          </Typography>
        </Box>
        <TextField
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          loading={isLoading}
          onClick={() => handleDeleteEmail()}
          disabled={password.length ? !valid : valid}
          sx={{ maxHeight: '40px' }}
        >
          Confirm
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

export default ConfirmPassword;
