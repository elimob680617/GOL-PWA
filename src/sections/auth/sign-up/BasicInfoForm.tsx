import * as Yup from 'yup';
import { useEffect, useState } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { Eye, EyeSlash, Sms, Lock } from 'iconsax-react';
import PasswordStrength from 'src/components/PasswordStrength';
import { useDispatch, useSelector } from 'src/redux/store';
import {
  basicInfoSelector,
  signUpUserTypeSelector,
  updateSignUpBasicInfo,
  signUpBySelector,
} from 'src/redux/slices/auth';
import { useRouter } from 'next/router';
import { useExistUserMutation } from 'src/_requests/graphql/cognito/mutations/existUser.generated';
import { EmailOrPhoneNumberEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import PhoneNumber from 'src/components/PhoneNumber';
import { isValidPhoneNumber } from 'react-phone-number-input';
// ----------------------------------------------------------------------

type BasicInfoFormProps = {
  username: string;
  password: string;
  afterSubmit?: string;
};

export default function BaseInfoForm() {
  const isMountedRef = useIsMountedRef();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  // const signUpType = useSelector(signUpTypeSelector);
  const userSignUpBy = useSelector(signUpBySelector);
  const userType = useSelector(signUpUserTypeSelector) as UserTypeEnum;
  const { username, password } = useSelector(basicInfoSelector);

  const [checkUserExists] = useExistUserMutation();

  const SignUpSchema = Yup.object().shape({
    username: Yup.string().test(
      'validateUsername',
      userSignUpBy === 'email' ? 'Please use a valid email address.' : 'Please use a valid phone number address.',
      function (value) {
        let emailRegex;
        // let phoneRegex
        if (userSignUpBy === 'email') {
          emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          const isValidEmail = emailRegex.test(value);
          if (!isValidEmail) {
            return false;
          }
        } else {
          const isValidPhone = isValidPhoneNumber(value || '');
          if (!isValidPhone) {
            return false;
          }
        }
        return true;
      }
    ),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username,
    password,
  };

  const methods = useForm<BasicInfoFormProps>({
    resolver: yupResolver(SignUpSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    // reset,

    setValue,
    setError,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async ({ username, password }: BasicInfoFormProps) => {
    try {
      dispatch(updateSignUpBasicInfo({ username, password }));
      const result = await checkUserExists({
        data: {
          dto: {
            userName: username,
            password,
            emailOrPhone: userSignUpBy === 'email' ? EmailOrPhoneNumberEnum.Email : EmailOrPhoneNumberEnum.PhoneNumber,
            userType,
          },
        },
      });

      // if ((res as any)?.error) {
      //   throw new Error((res as any)?.error)
      // }
      // if(result.existUser.listDto.items[0].isExist)

      // check if user exists from a true boolean on response and show error alert.

      router.push(PATH_AUTH.signUp.advancedInfo);
    } catch (error: any) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error.message.split(':')[1]);
      }
    }
  };
  useEffect(() => {
    if (userSignUpBy) {
      setValue('username', '');
    }
  }, [userSignUpBy, setValue]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={3} spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Stack spacing={1}>
          {userSignUpBy === 'email' ? (
            <RHFTextField
              size="small"
              autoComplete="new-password"
              inputProps={{
                autoComplete: 'new-password',
              }}
              name="username"
              label="Email"
            />
          ) : (
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <PhoneNumber
                  value={field.value}
                  isError={!!errors?.username}
                  placeHolder="Enter phone number"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          )}
        </Stack>

        <Stack spacing={1}>
          <RHFTextField
            size="small"
            name="password"
            label="Password"
            autoComplete="current-password"
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
          <Box sx={{ pb: 2 }}>
            {!!watch('password').length ? <PasswordStrength password={watch('password')} /> : <Box height={18} />}
          </Box>
        </Stack>
      </Stack>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isValid}
      >
        Continue
      </LoadingButton>
    </FormProvider>
  );
}
