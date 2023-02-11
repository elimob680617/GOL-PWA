import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { Add, ArrowLeft, Camera, Edit2 } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { PersonInput, ProfileFieldEnum } from 'src/@types/sections/serverTypes';
import DatePicker from 'src/components/DatePicker';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { updateMainInfo, userMainInfoSelector } from 'src/redux/slices/profile/userMainInfo-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import {
  useUpdatePersonProfileMutation,
  useUpdateProfileFiledMutation,
} from 'src/_requests/graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import MainProfileBirthday from './MainProfileBirthday';
import MainProfileChangePhoto from './MainProfileChangePhoto';
import MainProfileCoverAvatar from './MainProfileCoverAvatar';
import MainProfileDiscard from './MainProfileDiscard';
import MainProfileGender from './MainProfileGender';

// ------------styles !---------------------
const AvatarStyle = styled(Box)(() => ({
  position: 'absolute',
  left: 24,
  bottom: -36,
}));

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(0, -50%)',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function MainProfileEditDialog() {
  const { initialize, user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const userMainInfo = useSelector(userMainInfoSelector);
  // services !
  const [getUser, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [updateProfile, { isLoading }] = useUpdatePersonProfileMutation();
  const [updateProfileField, { isLoading: isLoadingField }] = useUpdateProfileFiledMutation();

  // bottom sheet state
  const [discardBottomSheet, setDiscardBottomSheet] = useState(false);
  const [birthDayBottomSheet, setBirthDayBottomSheet] = useState(false);
  const [genderBottomSheet, setGenderBottomSheet] = useState(false);
  const [profileChangePhoto, setProfileChangePhotoBottomSheet] = useState(false);
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  //
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();

  const methods = useForm<PersonInput & { headlineView?: boolean }>({
    // resolver: yupResolver(ExperienceFormSchema),
    defaultValues: { ...userMainInfo, headlineView: true },
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    control,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors, isValid, isDirty },
  } = methods;
  useEffect(() => {
    if (user && !userFetching) {
      reset({
        avatarUrl: user?.avatarUrl,
        birthday: user?.birthday,
        coverUrl: user?.coverUrl,
        gender: user?.gender,
        headline: user?.headline,
        headlineView: true,
      });
    }
  }, [reset, user, userFetching]);

  const onSubmit = async (value: PersonInput) => {
    let birthdayValue;
    if (value?.birthday) {
      const date = new Date(value?.birthday);
      birthdayValue = `${date.getFullYear()}-${('0' + (date?.getMonth() + 1)).slice(-2)}-${(
        '0' + date?.getDate()
      ).slice(-2)}`;
    }
    const res: any = await updateProfile({
      filter: {
        dto: {
          birthday: birthdayValue,
          gender: value.gender,
          headline: value.headline,
        },
      },
    });

    const resCover: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.CoverUrl,
          coverUrl: value.coverUrl,
        },
      },
    });

    const resAvatar: any = await updateProfileField({
      filter: {
        dto: {
          field: ProfileFieldEnum.AvatarUrl,
          avatarUrl: value.avatarUrl,
        },
      },
    });
    if (
      res?.data?.updatePersonProfile?.isSuccess &&
      resCover?.data?.updateProfileFiled?.isSuccess &&
      resAvatar?.data?.updateProfileFiled?.isSuccess
    ) {
      initialize();
      enqueueSnackbar('Profile Updated', { variant: 'success' });
      handleCloseInDiscardAndSubmit();
    }
  };

  const handleClose = () => {
    if (isDirty) {
      setDiscardBottomSheet(true);
    } else {
      handleCloseInDiscardAndSubmit();
    }
  };

  function handleCloseInDiscardAndSubmit() {
    const fromWizard = localStorage.getItem('fromWizard') === 'true';
    initialize();
    if (fromWizard) {
      localStorage.removeItem('fromWizard');
      router.push(PATH_APP.profile.wizardList);
    } else {
      router.push(PATH_APP.user.profile);
    }
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" justifyContent="center" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={handleClose}>
              <ArrowLeft color={theme.palette.text.primary} />
            </IconButton>
            <Typography variant="subtitle1">Edit Profile</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <LoadingButton
              loading={isLoading || isLoadingField}
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isDirty}
            >
              <Typography variant="button">Save</Typography>
            </LoadingButton>
          </Stack>
        </Stack>
        <Divider />
        {userFetching ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack>
            <Box sx={{ position: 'relative' }}>
              <Box>
                <CardMedia
                  component="img"
                  alt="Cover Image"
                  height={'250px'}
                  image={watch('coverUrl') || '/icons/empty_cover.svg'}
                  sx={{ objectFit: 'unset' }}
                />
                <IconButtonStyle
                  sx={{ transform: 'translate(-50%,-50%)' }}
                  onClick={() => {
                    watch('coverUrl') ? setProfileChangePhotoBottomSheet(true) : setProfileCoverAvatarBottomSheet(true);
                    setStatusPhoto('cover');
                  }}
                >
                  <Camera size="24" color={theme.palette.text.secondary} />
                </IconButtonStyle>
              </Box>
              <AvatarStyle>
                <Box sx={{ position: 'relative', width: 80 }}>
                  <Avatar alt={user?.fullName} src={watch('avatarUrl') || undefined} sx={{ width: 80, height: 80 }} />

                  <IconButtonStyle
                    sx={{ left: '25%' }}
                    onClick={() => {
                      watch('avatarUrl')
                        ? setProfileChangePhotoBottomSheet(true)
                        : setProfileCoverAvatarBottomSheet(true);
                      setStatusPhoto('avatar');
                    }}
                  >
                    <Camera size="24" color={theme.palette.text.secondary} />
                  </IconButtonStyle>
                </Box>
              </AvatarStyle>
            </Box>
            <Stack spacing={2} sx={{ pt: 9, pb: 3 }}>
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">Headline</Typography>
                  {watch('headline') && watch('headlineView') && (
                    <IconButton onClick={() => setValue('headlineView', false)}>
                      <Edit2 size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  )}
                </Box>
                {!watch('headline') && watch('headlineView') ? (
                  <Button variant="outlined" onClick={() => setValue('headlineView', false)}>
                    <Add color={theme.palette.text.primary} />
                    <Typography color="text.primary">Add Headline</Typography>
                  </Button>
                ) : watch('headlineView') ? (
                  <Typography
                    color="text.primary"
                    variant="body2"
                    onClick={() => setValue('headlineView', false)}
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {watch('headline')}
                  </Typography>
                ) : (
                  <Box>
                    <RHFTextField
                      name="headline"
                      size="small"
                      placeholder="Add Headline"
                      inputProps={{ maxLength: 100 }}
                      onBlur={() => setValue('headlineView', true, { shouldDirty: true })}
                      autoFocus
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                      sx={{ width: '100%', textAlign: 'right' }}
                    >
                      {watch('headline')?.length || 0}/100
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Divider />
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">Birthday</Typography>
                  {watch('birthday') && (
                    <IconButton onClick={() => setBirthDayBottomSheet(true)}>
                      <Edit2 size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  )}
                </Box>
                {!watch('birthday') ? (
                  <Button variant="outlined" onClick={() => setBirthDayBottomSheet(true)}>
                    <Add color={theme.palette.text.primary} />
                    <Typography color="text.primary">Add Birthday</Typography>
                  </Button>
                ) : (
                  <Typography color="text.primary" variant="body2">
                    {new Date(watch('birthday')).getDate()}, {getMonthName(new Date(watch('birthday')))},{' '}
                    {new Date(watch('birthday')).getFullYear()}
                    <IconButton
                      sx={{ p: 0, ml: 1 }}
                      onClick={() => {
                        setValue('birthday', undefined, { shouldDirty: true });
                        dispatch(updateMainInfo({ ...getValues() }));
                      }}
                    >
                      &#215;
                    </IconButton>
                  </Typography>
                )}
              </Stack>
              <Divider />
              <Stack sx={{ px: 2 }} spacing={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2">Gender</Typography>
                  {watch('gender') && (
                    <IconButton onClick={() => setGenderBottomSheet(true)}>
                      <Edit2 size="16" color={theme.palette.text.primary} />
                    </IconButton>
                  )}
                </Box>
                {!watch('gender') ? (
                  <Button variant="outlined" onClick={() => setGenderBottomSheet(true)}>
                    <Add color={theme.palette.text.primary} />
                    <Typography color="text.primary">Add Gender</Typography>
                  </Button>
                ) : (
                  <Typography color="text.primary" variant="body2">
                    {watch('gender')[0] + watch('gender').substring(1).toLowerCase()}
                    <IconButton
                      onClick={() => {
                        setValue('gender', undefined, { shouldDirty: true });
                        dispatch(updateMainInfo({ ...getValues() }));
                      }}
                      sx={{ ml: 1 }}
                    >
                      &#215;
                    </IconButton>
                  </Typography>
                )}
              </Stack>
              <Divider />
            </Stack>
          </Stack>
        )}
      </FormProvider>
      <BottomSheet open={discardBottomSheet} onDismiss={() => setDiscardBottomSheet(false)}>
        <MainProfileDiscard
          onSubmit={() => {
            onSubmit(getValues());
            setDiscardBottomSheet(false);
          }}
          onDiscard={handleCloseInDiscardAndSubmit}
        />
      </BottomSheet>
      <BottomSheet
        open={birthDayBottomSheet}
        onDismiss={() => setBirthDayBottomSheet(false)}
        snapPoints={({ minHeight }) => minHeight - 2}
      >
        <MainProfileBirthday
          onChange={(value) => {
            setValue('birthday', value, { shouldDirty: true });
            setBirthDayBottomSheet(false);
          }}
          birthDay={watch('birthday')}
        />
      </BottomSheet>
      <BottomSheet
        open={genderBottomSheet}
        onDismiss={() => setGenderBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2.5}
      >
        <MainProfileGender
          onChange={(value) => {
            setValue('gender', value, { shouldDirty: true });
            setGenderBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={profileChangePhoto}
        onDismiss={() => setProfileChangePhotoBottomSheet(false)}
        // snapPoints={({ minHeight }) => minHeight * 3}
      >
        <MainProfileChangePhoto
          isProfilePhoto={statusPhoto === 'avatar'}
          onRemove={() => {
            setValue(statusPhoto == 'avatar' ? 'avatarUrl' : 'coverUrl', undefined, { shouldDirty: true });
            setProfileChangePhotoBottomSheet(false);
          }}
          onUpload={() => {
            setProfileChangePhotoBottomSheet(false);
            setProfileCoverAvatarBottomSheet(true);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={profileCoverAvatar}
        onDismiss={() => setProfileCoverAvatarBottomSheet(false)}
        snapPoints={({ minHeight, maxHeight }) => [maxHeight, minHeight, maxHeight]}
      >
        <MainProfileCoverAvatar
          isAvatar={statusPhoto === 'avatar'}
          onChange={(value) => {
            setValue(statusPhoto == 'avatar' ? 'avatarUrl' : 'coverUrl', value, { shouldDirty: true });
            setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default MainProfileEditDialog;
