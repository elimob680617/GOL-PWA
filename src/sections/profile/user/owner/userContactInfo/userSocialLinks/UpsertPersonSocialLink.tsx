import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
// components
import { ArrowDown2, Eye } from 'iconsax-react';
// hooks
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, SocialMedia } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import {
  addedSocialMedia,
  emptySocialMedia,
  userSocialMediasSelector,
} from 'src/redux/slices/profile/userSocialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { useUpsertUserSocialMediaMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserSocialMedia.generated';
import * as Yup from 'yup';
import SelectAudience from './SelectAudience';
import SocialLinkDelete from './SocialLinkDelete';
import SocialLinkPlatform from './SocialLinkPlatform';

type SocialMediaValueProps = {
  id?: string;
  socialMediaDto: SocialMedia;
  audience: AudienceEnum;
  userName: string;
};

function AddSocialLinkNewForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserSocialMedia, { isLoading }] = useUpsertUserSocialMediaMutation();
  const router = useRouter();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [deleteSocialLink, setDeleteSocialLink] = useState(false);
  const [selectPlatform, setSelectPlatform] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);

  useEffect(() => {
    if (!personSocialMedia) router.push('/profile/user/contact-info/list');
  }, [personSocialMedia, router]);

  const SocialLinkSchema = Yup.object().shape({
    userName: Yup.string().required('Please fill out this field.'),
    socialMediaDto: Yup.object().shape({ title: Yup.string().required('') }),
  });

  const defaultValues = {
    id: personSocialMedia?.id,
    socialMediaDto: personSocialMedia?.socialMediaDto || undefined,
    audience: personSocialMedia?.audience || AudienceEnum.Public,
    userName: personSocialMedia?.userName || '',
  };

  const methods = useForm<SocialMediaValueProps>({
    mode: 'onChange',
    resolver: yupResolver(SocialLinkSchema),
    defaultValues,
  });
  const {
    control,
    getValues,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = methods;

  const handleNavigation = (url: string) => {
    dispatch(addedSocialMedia(getValues()));
    router.push(url);
  };

  useEffect(() => {
    trigger(['socialMediaDto.title']);
  }, []);
  // click on closeicon and go to Discard or profile
  function closeHandler() {
    const errorLength = Object.keys(errors).length;
    if (errorLength) {
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      router.push('/profile/user');
    } else {
      // handleNavigation('/profile/socialLink-discard-saveChange');
      router.push('/profile/user');
    }
  }

  const handlePlatformClick = () => {
    dispatch(addedSocialMedia(getValues()));
    router.push('/profile/user/contact-info/social-links/social-link-platform');
  };

  const onSubmit = async (data: SocialMediaValueProps) => {
    const { id, userName, audience, socialMediaDto } = data;
    const resData: any = await upsertUserSocialMedia({
      filter: {
        dto: {
          id: id,
          userName: userName,
          socialMediaId: socialMediaDto?.id,
          audience: audience,
        },
      },
    });
    if (resData.data?.upsertUserSocialMedia?.isSuccess) {
      dispatch(
        addedSocialMedia({
          id: id,
          userName: userName,
          socialMediaDto: socialMediaDto,
          audience: audience,
        })
      );
      router.push('/profile/user/contact-info/list');
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      enqueueSnackbar('The Social link has been successfully added', { variant: 'success' });
    }
    if (!resData.data?.upsertUserSocialMedia?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserSocialMedia?.messagingKey, { variant: 'error' });
    }
  };
  const handleBackRoute = () => {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push('/profile/user/contact-info/list');
  };

  const changeAudienceHandler = async (value) => {
    setValue('audience', value, { shouldDirty: true });
    setSelectAudience(false);
    if (personSocialMedia?.id) {
      const resAudi: any = await upsertUserSocialMedia({
        filter: {
          dto: {
            socialMediaId: personSocialMedia.userName,
            id: personSocialMedia.id,
            audience: value as AudienceEnum,
          },
        },
      });
      router.back();
    }
  };

  const handleUpdateAudience = () => {};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
              <Icon name="left-arrow-1" color="grey.500" />
            </IconButton>
            {!personSocialMedia?.id ? 'Add Social Link' : 'Edit Social Link'}
          </Typography>
          {!personSocialMedia?.id ? (
            <LoadingButton type="submit" variant="contained" disabled={!isValid}>
              Add
            </LoadingButton>
          ) : (
            <></>
          )}
        </Stack>
        <Divider />
        {!personSocialMedia?.id ? (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Social Link
            </Typography>
            <Button
              fullWidth
              size="large"
              startIcon={<Icon name="down-arrow" color='background.paper' size={16} />}
              variant="contained"
              onClick={() => setSelectPlatform(true)}
            >
              <Typography variant="button">{watch('socialMediaDto.title') || 'Platform'}</Typography>
            </Button>
            <RHFTextField autoComplete="UserName" placeholder="Username" type="text" name="userName" size="small" />
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {personSocialMedia?.socialMediaDto?.title}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {personSocialMedia?.userName}
            </Typography>
          </Stack>
        )}
        <Divider />
        {!personSocialMedia?.id ? (
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
            <Button variant="text" color="error" onClick={() => setDeleteSocialLink(true)}>
              Delete
            </Button>

            <LoadingButton
              loading={personSocialMedia?.id && isLoading}
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
      <BottomSheet
        open={selectPlatform}
        onDismiss={() => setSelectPlatform(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SocialLinkPlatform
          onChange={(value) => {
            setValue('socialMediaDto', value);
            setSelectPlatform(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={deleteSocialLink} onDismiss={() => setDeleteSocialLink(false)}>
        <SocialLinkDelete />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudience
          onChange={(value) => {
            changeAudienceHandler(value);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
    </FormProvider>
  );
}

export default AddSocialLinkNewForm;
