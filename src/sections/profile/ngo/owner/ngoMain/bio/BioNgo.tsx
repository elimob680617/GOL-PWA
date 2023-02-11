//mui
import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft } from 'iconsax-react';
//next
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
//...
import { useForm } from 'react-hook-form';
import { OrganizationUserBioInput } from 'src/@types/sections/serverTypes';
//component
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
//services
import { useUpdateOrganizationUserBioMutation } from 'src/_requests/graphql/profile/ngoBio/mutations/updateOrganizationUserBio.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
//.........................................................
const RootStyle = styled(Box)(({ theme }) => ({
  // with: 600,
  // height: 656,
}));
const RHFTextFieldStyle = styled(RHFTextField)(({ theme }) => ({
  width: '100%',
  border: 'none',
  overflowX: 'auto',
  scrollbarColor: `${theme.palette.grey[300]} ${theme.palette.grey[0]}`,
  scrollbarWidth: 'auto',
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));

function BioNgo() {
  const { initialize } = useAuth();
  // mutations
  const [updateOrganizationUserBio, { isLoading }] = useUpdateOrganizationUserBioMutation();
  //  query !!
  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const router = useRouter();
  // tools
  const id = router?.query?.id?.[0];
  const isEdit = !!id;
  const ngo = userData?.getUser?.listDto?.items?.[0];
  const bioData = ngo?.organizationUserDto?.bio;

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  // query !
  useEffect(() => {
    if (!!id) getUserDetail({ filter: { ids: [id] } });
  }, [id]);

  const onSubmit = async (data: OrganizationUserBioInput) => {
    const resBio: any = await updateOrganizationUserBio({
      filter: {
        dto: {
          body: data.body,
        },
      },
    });
    
    if (resBio?.data?.updateOrganizationUserBio?.isSuccess) {
      enqueueSnackbar('Bio successfully Added', { variant: 'success' });
    }
    initialize();
    router.back();
  };

  const defaultValues = {};
  const methods = useForm<OrganizationUserBioInput>({
    defaultValues: {
      ...BioNgo,
    },
    mode: 'onBlur',
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = methods;
  // useEffect
  useEffect(() => {
    if (isEdit)
      reset({
        body: bioData,
      });
  }, [ngo, isEdit, reset]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack p={2} direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={2} direction="row" alignItems="center">
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft color={theme.palette.text.primary} />
            </IconButton>
            <Typography variant="subtitle1">Bio</Typography>
          </Stack>

          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            disabled={isEdit ? !isDirty : !isDirty || !watch('body')}
            color="primary"
          >
            <Typography variant="button" sx={{ color: theme.palette.common.white }}>
              Save
            </Typography>
          </LoadingButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{  width: '100%'  }}>
          <RHFTextFieldStyle
            sx={{
              '& fieldset': {
                border: 'unset',
              },
            }}
            size="small"
            multiline
            name="body"
            placeholder="What do you want to talk about?"
            inputProps={{ maxLength: 1000 }}
            autoFocus
            // maxRows={5}
          />
        </Box>
      </FormProvider>
    </>
  );
}

export default BioNgo;
