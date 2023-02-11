import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, Location, LocationTypeEnum } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import { emptyLocation, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';
import { dispatch, useSelector } from 'src/redux/store';
import sleep from 'src/utils/sleep';
import { useUpsertLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/addCurrentCity.generated';
import { useGetLocationQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getLocation.generated';
import CloseHomeTown from './CloseHomeTown';
import ConfirmDeleteHomeTown from './ConfirmDeleteHomeTown';
import HomeTown from './HomeTown';
import SelectAudienceHomeTown from './SelectAudienceHomeTown';

function UpsertHomeTown() {
  const theme = useTheme();
  const [deleteHometown, setDeleteHometown] = useState(false);
  const [selectHometown, setSelectHometown] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);

  const userCity = useSelector(userLocationSelector);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!userCity?.id;
  const { data, isFetching } = useGetLocationQuery({
    filter: {
      dto: {
        id: null,
        locationType: LocationTypeEnum.Hometown,
      },
    },
  });
  const [upsertLocation, { isLoading, data: resUpsertLocation }] = useUpsertLocationMutation();

  const onSubmit = async (data: Location) => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: data.audience,
          cityId: data.city?.id,
          id: data.id,
          locationType: LocationTypeEnum.Hometown,
        },
      },
    });

    if (result?.data?.upsertLocation?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The home town has been successfully edited' : 'The home town has been successfully added',
        { variant: 'success' }
      );
      router.back();
      dispatch(emptyLocation());
    }
  };
  const defaultValues = {
    id: userCity?.id,
    audience: userCity?.audience,
    city: userCity?.city,
  };
  const methods = useForm<Location>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    getValues,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  useEffect(() => {
    if (!userCity) router.push('/profile/user/public-details/list');
  }, [userCity, router]);

  const handelCloseDialog = async () => {
    if (isDirty) {
      setDiscard(true);
    } else {
      router.push('/profile/user/public-details/list');
      await sleep(200);
      dispatch(emptyLocation());
    }
  };
  const handleUpdateAudience = () => {};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={handelCloseDialog}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isEdit ? 'Edit Home Town' : 'Add Home Town'}
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
            Home Town
          </Typography>

          <Typography
            variant="body2"
            onClick={() => setSelectHometown(true)}
            color={userCity?.city?.name ? 'text.primary' : 'text.secondary'}
            sx={{ cursor: 'pointer' }}
          >
            {watch('city') ? watch('city.name') : 'Home Town'}
          </Typography>
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
            <Button color="error" onClick={() => setDeleteHometown(true)}>
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
      <BottomSheet open={deleteHometown} onDismiss={() => setDeleteHometown(false)}>
        <ConfirmDeleteHomeTown />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceHomeTown
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
      <BottomSheet
        open={selectHometown}
        onDismiss={() => setSelectHometown(false)}
        snapPoints={({ maxHeight }) => maxHeight / 1.8}
      >
        <HomeTown
          onChange={(value) => {
            setValue('city', value, { shouldDirty: true });
            setSelectHometown(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <CloseHomeTown />
      </BottomSheet>
    </FormProvider>
  );
}
export default UpsertHomeTown;
