import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, ArrowLeft, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, OrganizationUser, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrganizationUserField.generated';
import { useLazyGetUserQuery } from 'src/_requests/graphql/profile/users/queries/getUser.generated';
import EstablishedDate from './EstablishedDate';
import EstablishmentDelete from './EstablishedDelete';
import EstablishmentDiscard from './EstablishmentDiscard';
import SelectAudienceEstablishedDate from './SelectAudienceEstablishedDate';

export default function EstablishedDateUpdate() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const id = router?.query?.id?.[0];
  const isEdit = !!id;
  const [deleteEstablishmentDate, setDeleteEstablishmentDate] = useState(false);
  const [establishmentDate, setEstablishmentDate] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);

  const [getEstablishmentDate, { data }] = useLazyGetUserQuery();
  const ngoEstablishmentDate = data?.getUser?.listDto?.items?.[0];

  const [upsertCategoryNgoUser, { isLoading: isLoading }] = useUpdateOrganizationUserFieldMutation();

  const onSubmit = async (data: OrganizationUser) => {
    const EstablishedDate = new Date(data.establishmentDate);
    const result: any = await upsertCategoryNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum?.EstablishmentDate,
          establishmentDate:
            EstablishedDate.getFullYear() + '-' + ('0' + (EstablishedDate.getMonth() + 1)).slice(-2) + '-01',
          establishmentDateAudience: data?.establishmentDateAudience,
        },
      },
    });
    if (result?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar(
        isEdit
          ? 'The Establishment Date has been successfully edited'
          : 'The Establishment Date has been successfully added',
        { variant: 'success' }
      );
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };

  const defaultValues = {
    establishmentDateAudience: AudienceEnum.Public,
    establishmentDate: ngoEstablishmentDate?.organizationUserDto?.establishmentDate,
  };
  const methods = useForm<OrganizationUser>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid, isDirty },
  } = methods;

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };

  useEffect(() => {
    if (!!id) getEstablishmentDate({ filter: { dto: {} } });
  }, [id]);

  useEffect(() => {
    if (isEdit)
      reset({
        establishmentDate: ngoEstablishmentDate?.organizationUserDto?.establishmentDate,
        establishmentDateAudience: ngoEstablishmentDate?.organizationUserDto?.establishmentDateAudience,
      });
  }, [ngoEstablishmentDate, isEdit, reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
              <ArrowLeft />
            </IconButton>
            {isEdit ? (
              <Typography variant="subtitle1" color="text.primary">
                Edit Date of Establishment
              </Typography>
            ) : (
              <Typography variant="subtitle1" color="text.primary">
                Add Date of Establishment
              </Typography>
            )}
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
            Date of Establishment
          </Typography>
          {watch('establishmentDate') ? (
            <Typography
              variant="body2"
              color={ngoEstablishmentDate?.organizationUserDto?.establishmentDate ? 'text.primary' : 'text.secondary'}
              sx={{ cursor: 'pointer' }}
            >
              {getMonthName(new Date(watch('establishmentDate')))}, {new Date(watch('establishmentDate')).getFullYear()}
              <IconButton
                onClick={() => {
                  setValue('establishmentDate', undefined, { shouldDirty: true });
                }}
                sx={{ ml: 1 }}
              >
                &#215;
              </IconButton>
            </Typography>
          ) : (
            <Box onClick={() => setEstablishmentDate(true)}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                Date of Establishment
              </Typography>
            </Box>
          )}
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
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('establishmentDateAudience'))]}
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button color="error" onClick={() => setDeleteEstablishmentDate(true)}>
              <Typography variant="button">Delete</Typography>
            </Button>
            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              onClick={() => setSelectAudience(true)}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('establishmentDateAudience'))]}
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
      <BottomSheet open={deleteEstablishmentDate} onDismiss={() => setDeleteEstablishmentDate(false)}>
        <EstablishmentDelete />
      </BottomSheet>
      <BottomSheet
        open={establishmentDate}
        onDismiss={() => setEstablishmentDate(false)}
        snapPoints={({ maxHeight }) => maxHeight / 1.8}
      >
        <EstablishedDate
          onChange={(value) => {
            setValue('establishmentDate', value, { shouldDirty: true });
            setEstablishmentDate(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceEstablishedDate
          onChange={(value) => {
            setValue('establishmentDateAudience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('establishmentDateAudience')}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <EstablishmentDiscard
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
