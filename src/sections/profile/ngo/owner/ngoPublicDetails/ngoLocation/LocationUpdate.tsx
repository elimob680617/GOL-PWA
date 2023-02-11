import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import GoogleMapReact from 'google-map-react';
import { ArrowDown2, ArrowLeft, CloseCircle, Eye, Location } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { PlacePayloadType } from 'src/@types/sections/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { ngoPlaceEmpty, ngoPlaceSelector, ngoPlaceUpdated } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useLazyGeocodeQuery } from 'src/_requests/graphql/locality/queries/geoCode.generated';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrganizationUserField.generated';
import LocationDelete from './LocationDelete';
import SelectAudienceLocation from './SelectAudienceLocation';
import LocationDiscard from './LocationDiscard';

const Marker = ({ lat, lng, text }) => <Typography>{text}</Typography>;

export default function LocationUpdate() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteLocation, setDeleteLocation] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [discard, setDiscard] = useState(false);
  // const [click, setClick] = useState(false);

  const dispatch = useDispatch();
  const ngoPlace = useSelector(ngoPlaceSelector);
  const id = router?.query?.id?.[0];
  const isEdit = !!id;

  const [getGeocode, { data: location, isFetching }] = useLazyGeocodeQuery();
  useEffect(() => {
    if (!!ngoPlace?.placeId)
      getGeocode({
        filter: {
          dto: {
            placeId: ngoPlace?.placeId,
          },
        },
      });
  }, [ngoPlace?.placeId]);

  const defaultProps = {
    center: {
      lat: !!ngoPlace?.lat ? ngoPlace?.lat : location?.geocode?.listDto?.items[0]?.lat,
      lng: !!ngoPlace?.lng ? ngoPlace?.lng : location?.geocode?.listDto?.items[0]?.lng,
    },
    zoom: 13,
  };

  const [upsertPlaceNgoUser, { isLoading: isLoading }] = useUpdateOrganizationUserFieldMutation();

  const handleNavigation = (url: string) => {
    dispatch(ngoPlaceUpdated({ ...getValues() }));
    router.push(url);
  };

  const onSubmit = async (data: PlacePayloadType) => {
    const response: any = await upsertPlaceNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Place,
          placeAudience: data.placeAudience,
          googlePlaceId: data.placeId,
          address: data.address,
          lat: ngoPlace?.lat,
          lng: ngoPlace?.lng,
        },
      },
    });
    if (response?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('The Location has been successfully updated ', { variant: 'success' });
      dispatch(ngoPlaceEmpty());
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    } else {
      enqueueSnackbar('The Location unfortunately not updated', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (!ngoPlace) router.push(PATH_APP.profile.ngo.publicDetails.list);
  }, [ngoPlace, router]);

  const handleDiscardDialog = () => {
    if (isDirty || ngoPlace?.isChange) {
      dispatch(ngoPlaceUpdated({ ...ngoPlace, lat: defaultProps.center.lat, lng: defaultProps.center.lng }));
      setDiscard(true);
    } else {
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };

  const methods = useForm<PlacePayloadType & { addressView?: boolean; mapView?: boolean }>({
    mode: 'onChange',
    defaultValues: {
      ...ngoPlace,
      addressView: true,
      mapView: true,
    },
  });

  const {
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;

  const handleUpdateAudience = () => {
    dispatch(ngoPlaceUpdated(getValues()));
    setSelectAudience(true);
  };

  const handleCurrentLatLng = (e) => {
    // setClick(true);
    dispatch(
      ngoPlaceUpdated({
        ...ngoPlace,
        lat: e.lat,
        lng: e.lng,
        isChange: true,
      })
    );
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} px={2} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={handleDiscardDialog}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              {isEdit ? 'Edit Location' : 'Add Location'}
            </Typography>
          </Stack>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            color="primary"
            disabled={!(isDirty || ngoPlace?.isChange) || !ngoPlace?.description}
            type="submit"
          >
            {isEdit ? 'Save' : 'Add'}
          </LoadingButton>
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Located in
          </Typography>
          <Box onClick={() => handleNavigation(PATH_APP.profile.ngo.publicDetails.locationName)}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ cursor: 'pointer' }}>
              {watch('description') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('description')}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
              )}
            </Typography>
          </Box>
        </Stack>

        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box>
            <Typography variant="subtitle1" color="text.primary" mb={2}>
              Address Detail
            </Typography>

            {watch('addressView') ? (
              <>
                <Typography
                  variant="body2"
                  color={watch('address') ? 'text.primary' : 'text.secondary'}
                  onClick={() => setValue('addressView', false)}
                >
                  {watch('address') || 'Address Details'}
                  {watch('address') && (
                    <IconButton
                      onClick={() => {
                        setValue('address', '', { shouldDirty: true });
                        dispatch(ngoPlaceUpdated({ ...getValues() }));
                      }}
                      sx={{ ml: 1 }}
                    >
                      &#215;
                    </IconButton>
                  )}
                </Typography>
              </>
            ) : (
              <Box>
                <RHFTextField
                  placeholder="Address Detail"
                  name="address"
                  size="small"
                  error={false}
                  inputProps={{ maxLength: 60 }}
                  onBlur={() => setValue('addressView', true)}
                  autoFocus
                />
              </Box>
            )}
          </Box>
        </Stack>

        {location?.geocode?.listDto?.items[0] && watch('mapView') && (
          <>
            <Divider />
            <Stack py={1} px={2} sx={{ direction: 'rtl' }}>
              <Box pb={1.2}>
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    setValue('mapView', false);
                  }}
                >
                  <CloseCircle variant="Outline" color={theme.palette.text.secondary} />
                </IconButton>
              </Box>
              <Box style={{ height: 230 }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                  defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}
                  onClick={(e) => handleCurrentLatLng(e)}
                >
                  <Marker
                    lat={ngoPlace?.lat}
                    lng={ngoPlace?.lng}
                    text={<Location size="28" color={theme.palette.error.main} variant="Bold" />}
                  />
                </GoogleMapReact>
              </Box>
            </Stack>
          </>
        )}

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
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('placeAudience'))]}
              </Typography>
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
            <Button color="error" onClick={() => setDeleteLocation(true)}>
              <Typography variant="button">Delete</Typography>
            </Button>
            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              onClick={handleUpdateAudience}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('placeAudience'))]}
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>

      <BottomSheet open={deleteLocation} onDismiss={() => setDeleteLocation(false)}>
        <LocationDelete />
      </BottomSheet>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceLocation
          onChange={(value) => {
            setValue('placeAudience', value, { shouldDirty: true });
            setSelectAudience(false);
          }}
          audience={watch('placeAudience')}
        />
      </BottomSheet>
      <BottomSheet open={discard} onDismiss={() => setDiscard(false)}>
        <LocationDiscard
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
