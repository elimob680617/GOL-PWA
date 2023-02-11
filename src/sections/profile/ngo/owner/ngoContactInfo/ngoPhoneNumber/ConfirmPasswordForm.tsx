import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ArrowLeft, Eye, EyeSlash } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { userPhoneNumberSelector } from 'src/redux/slices/profile/userPhoneNumber-slice';
import { PATH_APP } from 'src/routes/paths';
import { useRemovePhoneNumberMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/removePhoneNumber.generated';

function ConfirmPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteUserPhoneNumber, { isLoading }] = useRemovePhoneNumberMutation();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);

  const handleDeletePhoneNumber = async () => {
    const resDataDelete: any = await deleteUserPhoneNumber({
      filter: {
        dto: {
          id: userPhoneNumber?.id,
          password: password,
        },
      },
    });
    if (resDataDelete.data.deletePhoneNumber?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.list);
      enqueueSnackbar('Phone Number Deleted', { variant: 'error' });
    } else {
      enqueueSnackbar(resDataDelete.data.deletePhoneNumber?.messagingKey, { variant: 'error' });
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
            Delete Phone Number
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.primary" sx={{ mt: 4 }}>
            Are you sure you want to remove this phone number address? To save this setting, please enter your Garden of
            Love password.
          </Typography>
        </Box>
        <TextField
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
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
          loading={isLoading}
          color="primary"
          variant="contained"
          onClick={() => handleDeletePhoneNumber()}
        >
          Confirm
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

export default ConfirmPassword;
