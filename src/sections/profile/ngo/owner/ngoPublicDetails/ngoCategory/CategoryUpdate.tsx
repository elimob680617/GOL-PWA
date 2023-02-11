import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { GroupCategoryType } from 'src/@types/sections/profile/ngoCategory';
import { AudienceEnum, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import SvgIconStyle from 'src/components/SvgIconStyle';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrganizationUserField.generated';
import { useLazyGetUserQuery } from 'src/_requests/graphql/profile/users/queries/getUser.generated';
import CategoryClose from './CategoryClose';
import CategoryDelete from './CategoryDelete';
import CategoryType from './CategoryType';
import SelectAudienceGroupCategory from './SelectAudienceGroupCategory';

export default function CategoryUpdate() {
  const theme = useTheme();
  const [deleteGroupCategory, setDeleteGroupCategory] = useState(false);
  const [groupCategory, setGroupCategory] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const id = router?.query?.id?.[0];
  const isEdit = !!id;

  const [getCategoryType, { data }] = useLazyGetUserQuery();
  const ngoCategory = data?.getUser?.listDto?.items[0];

  const [updateOrganization, { isLoading, data: resUpdateOrganization }] = useUpdateOrganizationUserFieldMutation();

  console.log('audience is:', ngoCategory);
  const onSubmit = async (data: GroupCategoryType) => {
    const result: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum?.GroupCategory,
          groupCategoryId: data?.id,
          groupCategoryAudience: data.audience,
        },
      },
    });

    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The ngo category has been successfully edited' : 'The ngo category has been successfully added',
        { variant: 'success' }
      );
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };

  const defaultValues = {
    groupCategory: ngoCategory?.organizationUserDto?.groupCategory,
    audience: AudienceEnum.Public,
    groupCategoryId: ngoCategory?.organizationUserDto?.groupCategoryId,
    id: ngoCategory?.organizationUserDto?.id,
    organizationUserType: ngoCategory?.organizationUserDto?.organizationUserType,
  };

  const methods = useForm<GroupCategoryType>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid, isDirty },
  } = methods;

  useEffect(() => {
    if (!!id) getCategoryType({ filter: { dto: {} } });
  }, [id]);

  useEffect(() => {
    if (isEdit)
      reset({
        audience: ngoCategory?.organizationUserDto?.groupCategoryAudience,
        id: ngoCategory?.organizationUserDto?.groupCategoryId,
        title: ngoCategory?.organizationUserDto?.groupCategory?.title,
      });
  }, [ngoCategory, isEdit, reset]);

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };

  const handleUpdateAudience = () => {};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isEdit ? 'Edit Ngo Category' : 'Add Ngo Category'}
            </Typography>
          </Box>

          <Box>
            <LoadingButton loading={isLoading} type="submit" color="primary" variant="contained" disabled={!isDirty}>
              {isEdit ? 'Save' : 'Add'}
            </LoadingButton>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Ngo Category
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
            <SvgIconStyle src={`/icons/relationshipIcon.svg`} sx={{ width: 10, height: 10 }} />
            <Typography
              variant="body2"
              color={ngoCategory?.organizationUserDto?.groupCategory?.title ? 'text.primary' : 'text.secondary'}
              sx={{ cursor: 'pointer' }}
              onClick={() => setGroupCategory(true)}
            >
              {watch('title') ? watch('title') : 'NGO Category'}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {!isEdit ? (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
            <Box />
            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button color="error" onClick={() => setDeleteGroupCategory(true)}>
              <Typography variant="button">Delete</Typography>
            </Button>
            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
      <BottomSheet open={deleteGroupCategory} onDismiss={() => setDeleteGroupCategory(false)}>
        <CategoryDelete />
      </BottomSheet>
      <BottomSheet
        open={groupCategory}
        onDismiss={() => setGroupCategory(false)}
        snapPoints={({ maxHeight }) => maxHeight / 1.8}
      >
        <CategoryType
          onChange={(value) => {
            setValue('title', value.title, { shouldDirty: true });
            setValue('id', value.id, { shouldDirty: true });
            setGroupCategory(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceGroupCategory
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <CategoryClose
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscard(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>
    </FormProvider>
  );
}
