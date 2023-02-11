import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Button, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, Eye } from 'iconsax-react';
// components
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { UserPhoneNumberType } from 'src/@types/sections/profile/userPhoneNumber';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import PhoneNumber from 'src/components/PhoneNumber';
import {
  phoneNumberAdded,
  phoneNumberCleared,
  userPhoneNumberSelector,
} from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
// Queries and Mutations
import { useUpsertPhoneNumberMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertPhoneNumber.generated';
import * as Yup from 'yup';
import ConfirmDeletePhoneNumber from './ConfirmDeletePhoneNumber';
import SelectAudiencePhoneNumber from './SelectAudience';

const ParentPhoneInputStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingBottom: 95,
  display: 'flex',
  height: 40,
  position: 'relative',
  borderRadius: 8,
  '&:focus-within': {},
}));

function UpsertPhoneNumber() {
  const router = useRouter();
  const theme = useTheme();
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const [addUserPhoneNumber, { isLoading }] = useUpsertPhoneNumberMutation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [deletePhoneNumber, setDeletePhoneNumber] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);

  useEffect(() => {
    if (!userPhoneNumber) router.push(PATH_APP.profile.ngo.contactInfo.list);
  }, [userPhoneNumber, router]);

  const PhoneNumberSchema = Yup.object().shape({
    phoneNumber: Yup.string().test('phoneNumber', 'Invalid Phone Number', function (value: any) {
      const isValidPhone = isValidPhoneNumber(value || '');
      if (!isValidPhone || value?.length < 10) {
        return false;
      }
      return true;
    }),
  });

  const defaultValues = {
    id: userPhoneNumber?.id,
    audience: userPhoneNumber?.audience,
    phoneNumber: userPhoneNumber?.phoneNumber || '',
    status: userPhoneNumber?.status,
    verificationCode: userPhoneNumber?.verificationCode,
  };

  const methods = useForm<UserPhoneNumberType>({
    resolver: yupResolver(PhoneNumberSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { isValid, errors },
  } = methods;

  const onSubmit = async (data: UserPhoneNumberType) => {
    const { id, phoneNumber, audience, status } = data;

    const resData: any = await addUserPhoneNumber({
      filter: {
        dto: {
          id: id,
          phoneNumber: phoneNumber,
          audience: audience,
        },
      },
    });

    if (resData.data?.upsertPhoneNumber?.isSuccess) {
      dispatch(
        phoneNumberAdded({
          status,
          id,
          phoneNumber,
          audience,
        })
      );
      router.push(PATH_APP.profile.ngo.contactInfo.verifyNgoPhoneNumber);
    }
  };

  const handleNavigation = (url: string) => {
    dispatch(phoneNumberAdded(getValues()));
    router.push(url);
  };

  function closeHandler() {
    if (userPhoneNumber?.id) {
      handleNavigation('/profile/user');
    } else {
      dispatch(phoneNumberAdded({ audience: AudienceEnum.Public }));
      router.push(PATH_APP.profile.ngo.contactInfo.list);
    }
  }

  const handleBackRoute = () => {
    dispatch(phoneNumberCleared());
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  };

  const changeAudienceHandler = async (value) => {
    setValue('audience', value, { shouldDirty: true });
    setSelectAudience(false);
    if (userPhoneNumber?.id) {
      const resAudi: any = await addUserPhoneNumber({
        filter: {
          dto: {
            phoneNumber: userPhoneNumber.phoneNumber,
            id: userPhoneNumber.id,
            audience: value as AudienceEnum,
          },
        },
      });
      router.back();
    }
  };

  const handleUpdateAudience = () => {};

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
                <ArrowLeft />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {userPhoneNumber?.id ? 'Edit Phone Number' : 'Phone Number'}
              </Typography>
            </Stack>
            {!userPhoneNumber?.id ? (
              <LoadingButton type="submit" variant="contained" loading={isLoading}>
                Add
              </LoadingButton>
            ) : (
              <></>
            )}
          </Stack>
          <Divider />
          <ParentPhoneInputStyle>
            <Stack sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Phone Number
              </Typography>
              {!userPhoneNumber?.id ? (
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneNumber
                      value={field.value}
                      isError={!!errors?.phoneNumber}
                      placeHolder="Enter phone number"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              ) : (
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, paddingBottom: 0 }}>
                  <Typography variant="body2">{userPhoneNumber.phoneNumber}</Typography>
                  <Typography variant="body2" color="primary">
                    {userPhoneNumber.status}
                  </Typography>
                </Stack>
              )}
            </Stack>
            {!!errors?.phoneNumber && (
              <Typography component="div" variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                {errors?.phoneNumber?.message}
              </Typography>
            )}
          </ParentPhoneInputStyle>
          <Divider sx={{ mt: !!errors?.phoneNumber ? '32px !important' : '16px !important' }} />
          {!userPhoneNumber?.id ? (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Box />
              <Button
                variant="outlined"
                startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                onClick={() => setSelectAudience(true)}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
                </Typography>
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
              <Button variant="text" color="error" onClick={() => setDeletePhoneNumber(true)}>
                Delete
              </Button>
              <LoadingButton
                loading={userPhoneNumber?.id && isLoading}
                variant="outlined"
                startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                onClick={() => setSelectAudience(true)}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
                </Typography>
              </LoadingButton>
            </Stack>
          )}
        </Stack>
        <BottomSheet open={deletePhoneNumber} onDismiss={() => setDeletePhoneNumber(false)}>
          <ConfirmDeletePhoneNumber />
        </BottomSheet>
        <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
          <SelectAudiencePhoneNumber
            onChange={(value) => {
              changeAudienceHandler(value);
            }}
            audience={watch('audience')}
          />
        </BottomSheet>
      </FormProvider>
    </>
  );
}

export default UpsertPhoneNumber;
