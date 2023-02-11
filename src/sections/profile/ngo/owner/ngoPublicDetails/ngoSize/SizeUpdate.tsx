import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { NgoSizeType } from 'src/@types/sections/profile/ngoSize';
import { AudienceEnum, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrganizationUserField.generated';
import { useLazyGetUserQuery } from 'src/_requests/graphql/profile/users/queries/getUser.generated';
import SizeDelete from './SizeDelete';
import SizeClose from './SizeClose';
import SizeSelectAudience from './SizeSelectAudience';
import SizeStatus from './SizeStatus';

export default function SizeUpdate() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteNgoSize, setDeleteNgoSize] = useState(false);
  const [selectNgoSize, setSelectNgoSize] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  const id = router?.query?.id?.[0];
  const isEdit = !!id;

  const [ngoSizeStatus, { isLoading }] = useUpdateOrganizationUserFieldMutation();
  const [getNgoSize, { data, isFetching }] = useLazyGetUserQuery();
  const ngoSize = data?.getUser?.listDto?.items[0];

  const onSubmit = async (data: NgoSizeType) => {
    const resData: any = await ngoSizeStatus({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          numberRangeId: data.id,
          sizeAudience: data.audience,
        },
      },
    });

    if (resData?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The NGO Size has been successfully edited' : 'The NGO Size has been successfully added',
        { variant: 'success' }
      );

      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };

  const defaultValues = {
    id: ngoSize?.organizationUserDto?.numberRange?.id,
    desc: ngoSize?.organizationUserDto?.numberRange?.desc,
    audience: AudienceEnum.Public,
  };

  const methods = useForm<NgoSizeType>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { isValid, isDirty },
  } = methods;

  useEffect(() => {
    if (!!id) getNgoSize({ filter: { dto: {} } });
  }, [id]);

  useEffect(() => {
    if (isEdit)
      reset({
        desc: ngoSize?.organizationUserDto?.numberRange?.desc,
        audience: ngoSize?.organizationUserDto?.sizeAudience,
      });
  }, [ngoSize, isEdit, reset]);

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handelCloseDialog}>
              <ArrowLeft />
            </IconButton>
            {!isEdit ? 'Add NGO Size' : 'Edit NGO Size'}
          </Typography>
          {!isEdit ? (
            <LoadingButton type="submit" variant="contained" disabled={!isDirty}>
              Add
            </LoadingButton>
          ) : (
            <LoadingButton type="submit" variant="contained" disabled={!isDirty}>
              Save
            </LoadingButton>
          )}
        </Stack>
        <Divider />
        {!ngoSize?.organizationUserDto?.numberRange?.id ? (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              NGO Size
            </Typography>
            <Button
              fullWidth
              size="large"
              startIcon={<ArrowDown2 size="16" />}
              variant="contained"
              onClick={() => setSelectNgoSize(true)}
            >
              <Typography variant="button">{watch('desc') || 'NGO Size'}</Typography>
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              NGO Size
            </Typography>
            <Button
              fullWidth
              size="large"
              startIcon={<ArrowDown2 size="16" />}
              variant="contained"
              onClick={() => setSelectNgoSize(true)}
            >
              <Typography variant="button">{watch('desc') ? watch('desc') : 'NGO Size'}</Typography>
            </Button>
          </Stack>
        )}
        <Divider />
        {!ngoSize?.organizationUserDto?.numberRange?.id ? (
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
            <Button variant="text" color="error" onClick={() => setDeleteNgoSize(true)}>
              Delete
            </Button>

            <LoadingButton
              loading={ngoSize?.organizationUserDto?.numberRange?.id && isLoading}
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
        open={selectNgoSize}
        onDismiss={() => setSelectNgoSize(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SizeStatus
          onChange={(value) => {
            setValue('desc', value?.desc, { shouldDirty: true });
            setValue('id', value?.id, { shouldDirty: true });
            setSelectNgoSize(false);
          }}
          sizeId={watch('id')}
        />
      </BottomSheet>
      <BottomSheet open={deleteNgoSize} onDismiss={() => setDeleteNgoSize(false)}>
        <SizeDelete />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <SizeClose
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscard(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SizeSelectAudience
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
    </FormProvider>
  );
}
