import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, Relationship } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import {
  RelationShipCleared,
  userRelationShipSelector,
  userRelationShipUpdate,
} from 'src/redux/slices/profile/userRelationShip-slice';
import { dispatch, useSelector } from 'src/redux/store';
import { useUpdateRelationshipMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updateRelationship.generated';
import CloseRelationship from './CloseRelationship';
import ConfirmDeleteRelationship from './ConfirmDeleteRelationship';
import RelationshipStatusForm from './RelationshipStatus';
import SelectAudienceRelationship from './SelectAudienceRelationship';

function UpsertRelationship() {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const relationShip = useSelector(userRelationShipSelector);
  const isEdit = !!relationShip?.personId;
  const [deleteRelationship, setDeleteRelationship] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);

  const [updateRelationship, { isLoading }] = useUpdateRelationshipMutation();

  const onSubmit = async (data: Relationship) => {
    const resData: any = await updateRelationship({
      filter: {
        dto: {
          audience: data.audience,
          relationshipStatusId: data.relationshipStatus?.id,
        },
      },
    });

    if (resData?.data?.updateRelationship?.isSuccess) {
      dispatch(RelationShipCleared());
      enqueueSnackbar(
        isEdit ? 'The relationship has been successfully edited' : 'The relationship has been successfully added',
        { variant: 'success' }
      );

      router.push('/profile/user/public-details/list');
    }
  };

  const defaultValues = {
    personId: relationShip?.personId,
    audience: relationShip?.audience,
    relationshipStatus: relationShip?.relationshipStatus,
  };
  const methods = useForm<Relationship>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  const handelCloseDialog = () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      dispatch(userRelationShipUpdate({ audience: AudienceEnum.Public }));
      router.push('/profile/user/public-details/list');
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (!relationShip) router.push('/profile/user/public-details/list');
  }, [relationShip, router]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isEdit ? 'Edit Relationship Status' : ' Set Relationship Status'}
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
            Relationship status
          </Typography>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            sx={{ borderColor: 'text.disabled' }}
            onClick={() => setRelationshipStatus(true)}
            endIcon={<Icon name="down-arrow" color="text.primary" />}
          >
            <Typography color="text.primary" variant="button">
              {watch('relationshipStatus.title') ? watch('relationshipStatus.title') : 'Relationship'}
            </Typography>
          </Button>
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
            <Button color="error" onClick={() => setDeleteRelationship(true)}>
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
      <BottomSheet open={deleteRelationship} onDismiss={() => setDeleteRelationship(false)}>
        <ConfirmDeleteRelationship />
      </BottomSheet>
      <BottomSheet
        open={relationshipStatus}
        onDismiss={() => setRelationshipStatus(false)}
        snapPoints={({ maxHeight }) => maxHeight / 1.8}
      >
        <RelationshipStatusForm
          onChange={(value) => {
            setValue('relationshipStatus', value, { shouldDirty: true });
            setRelationshipStatus(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceRelationship
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <CloseRelationship />
      </BottomSheet>
    </FormProvider>
  );
}

export default UpsertRelationship;
