import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
// components
import { ArrowDown2, ArrowLeft, Eye } from 'iconsax-react';
import { useRouter, withRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { addedEmail, emptyEmail, userEmailsSelector } from 'src/redux/slices/profile/userEmail-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpsertUserEmailMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/upsertUserEmail.generated';
import * as Yup from 'yup';
import EmailDelete from './EmailDelete';
import SelectAudience from './SelectAudience';

type EmailValueProps = {
  id?: string;
  email: string;
  audience: AudienceEnum;
  status?: VerificationStatusEnum;
};

function UpsertPersonEmailForm() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertUserEmail, { isLoading }] = useUpsertUserEmailMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const personEmail = useSelector(userEmailsSelector);
  const [deleteEmail, setDeleteEmail] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);

  useEffect(() => {
    if (!personEmail) router.push(PATH_APP.profile.ngo.contactInfo.list);
  }, [personEmail, router]);

  const EmailSchema = Yup.object().shape({
    email: Yup.string().email().required('Please fill out this field.'),
  });

  const defaultValues = {
    id: personEmail?.id,
    email: personEmail?.email || '',
    audience: personEmail?.audience || AudienceEnum.Public,
    status: personEmail?.status || VerificationStatusEnum.Pending,
  };

  const methods = useForm<EmailValueProps>({
    mode: 'onSubmit',
    resolver: yupResolver(EmailSchema),
    defaultValues,
  });

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty, isValid },
  } = methods;

  const handleNavigation = (url: string) => {
    dispatch(addedEmail(getValues()));
    router.push(url);
  };

  function closeHandler() {
    if (personEmail?.id) {
      router.push('/profile/ngo');
    } else {
      dispatch(emptyEmail({ audience: AudienceEnum.Public }));
      router.push(PATH_APP.profile.ngo.contactInfo.list);
    }
  }

  const onSubmit = async (data: EmailValueProps) => {
    const { id, email, audience, status } = data;
    const resData: any = await upsertUserEmail({
      filter: {
        dto: {
          id: id,
          email: email,
          audience: audience,
        },
      },
    });

    if (resData.data?.upsertUserEmail?.isSuccess) {
      dispatch(
        addedEmail({
          status,
          id,
          email,
          audience,
        })
      );
      router.push(PATH_APP.profile.ngo.contactInfo.verifyNgoEmail);
      // dispatch(addedEmail({ audience: AudienceEnum.Public }));
    }
    if (!resData.data?.upsertUserEmail?.isSuccess) {
      enqueueSnackbar(resData.data?.upsertUserEmail?.messagingKey, { variant: 'error' });
    }
  };

  const changeAudienceHandler = async (value) => {
    setValue('audience', value, { shouldDirty: true });
    setSelectAudience(false);
    if (personEmail?.id) {
      const resAudi: any = await upsertUserEmail({
        filter: {
          dto: {
            email: personEmail.email,
            id: personEmail.id,
            audience: value as AudienceEnum,
          },
        },
      });
      router.back();
    }
  };

  const handleBackRoute = () => {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
              <ArrowLeft />
            </IconButton>
            {!personEmail?.id ? 'Add Email' : 'Edit Email'}
          </Typography>
          {!personEmail?.id ? (
            <LoadingButton type="submit" variant="contained" loading={isLoading}>
              Add
            </LoadingButton>
          ) : (
            <></>
          )}
        </Stack>
        <Divider />

        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Email
          </Typography>
          {!personEmail?.id ? (
            <RHFTextField autoComplete="Email" placeholder="Email" type="text" name="email" size="small" />
          ) : (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.primary">
                  {personEmail?.email}
                </Typography>
                <Typography variant="caption" color="primary">
                  {personEmail?.status}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
        <Divider />

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            justifyContent: 'space-between',
            px: 2,
            ...(personEmail?.id && {
              justifyContent: 'space-between',
            }),
          }}
        >
          {personEmail?.id && (
            <Button variant="text" color="error" onClick={() => setDeleteEmail(true)}>
              Delete
            </Button>
          )}
          <Box />
          <LoadingButton
            loading={personEmail?.id && isLoading}
            variant="outlined"
            startIcon={<Eye size="18" color={theme.palette.text.primary} />}
            onClick={() => {
              dispatch(addedEmail(getValues()));
              setSelectAudience(true);
            }}
            endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
          >
            <Typography color={theme.palette.text.primary}>
              {Object.keys(AudienceEnum)
                [Object.values(AudienceEnum).indexOf(watch('audience'))]?.replace(/([A-Z])/g, ' $1')
                .trim()}
            </Typography>
          </LoadingButton>
        </Stack>
      </Stack>
      <BottomSheet open={deleteEmail} onDismiss={() => setDeleteEmail(false)}>
        <EmailDelete />
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

export default withRouter(UpsertPersonEmailForm);
