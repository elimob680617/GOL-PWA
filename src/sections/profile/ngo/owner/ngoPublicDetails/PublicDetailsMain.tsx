import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { Add, ArrowDown2, ArrowLeft, Edit2, Eye } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { PlacePayloadType } from 'src/@types/sections/profile/ngoPublicDetails';
import { AudienceEnum, OrgUserFieldEnum, Place } from 'src/@types/sections/serverTypes';
import SvgIconStyle from 'src/components/SvgIconStyle';
import useAuth from 'src/hooks/useAuth';
import { ngoPlaceUpdated } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrganizationUserField.generated';
import { useUpdateJoinAudienceMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updateJoinAudience.generated';
import { useLazyGetUserQuery } from 'src/_requests/graphql/profile/users/queries/getUser.generated';
import SelectAudienceMain from './SelectAudienceMain';

export default function NGOPublicDetailsMainDialog() {
  const router = useRouter();
  const theme = useTheme();
  const { initialize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [selectAudience, setSelectAudience] = useState(false);

  //Query Services
  const [getUser, { data: userData, isFetching: audienceIsLoading }] = useLazyGetUserQuery();
  const [updateJoinAudience, { isLoading }] = useUpdateJoinAudienceMutation();
  const [updateOrganization, { isLoading: organizationIsLoading }] = useUpdateOrganizationUserFieldMutation();
  const user = userData?.getUser?.listDto?.items[0];
  const category = user?.organizationUserDto?.groupCategory;
  useEffect(() => {
    getUser({ filter: { all: true } });
  }, []);

  const handleRoutingCategory = async () => {
    const resAudience: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.GroupCategory,
          groupCategoryAudience: AudienceEnum.Public,
        },
      },
    });
    router.push(PATH_APP.profile.ngo.publicDetails.ngoCategory);
  };

  const handleRoutingSize = async () => {
    const resAudience: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          sizeAudience: AudienceEnum.Public,
        },
      },
    });
    router.push(PATH_APP.profile.ngo.publicDetails.ngoSize);
  };
  const handleRoutingEstablishedDate = async () => {
    const resAudience: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.EstablishmentDate,
          establishmentDateAudience: AudienceEnum.Public,
        },
      },
    });
    router.push(PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate);
  };

  const handleRoutingLocation = (exp: PlacePayloadType) => {
    dispatch(ngoPlaceUpdated(exp));
    router.push(PATH_APP.profile.ngo.publicDetails.location);
  };

  const handleEditLocation = (location: Place, audience: AudienceEnum, address, lat, lng) => {
    dispatch(ngoPlaceUpdated({ ...location, placeAudience: audience, address: address, lat: lat, lng: lng }));
    router.push(PATH_APP.profile.ngo.publicDetails.location + `/${user.organizationUserDto.id}`);
  };

  const handelJoinAudience = async (value) => {
    setSelectAudience(false);
    const resAudi: any = await updateJoinAudience({
      filter: {
        dto: {
          joinAudience: value as AudienceEnum,
        },
      },
    });
    if (resAudi?.data?.updateJoinAudience?.isSuccess) {
      getUser({ filter: { all: true } });
      enqueueSnackbar('Audience Updated', { variant: 'success' });
    }
  };

  function handleClose() {
    const fromWizard = localStorage.getItem('fromWizardNgo') === 'true';
    initialize();
    if (fromWizard) {
      localStorage.removeItem('fromWizardNgo');
      router.push(PATH_APP.profile.wizardListNgo);
    } else {
      router.push(PATH_APP.profile.ngo.root);
    }
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Public Details
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          NGO Category
        </Typography>
        {!!user?.organizationUserDto?.groupCategory ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <SvgIconStyle src={`/icons/relationshipIcon.svg`} sx={{ width: 10, height: 10 }} />
                <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                  {user?.organizationUserDto?.groupCategory?.title}
                </Typography>
              </Box>
              <Box>
                <Link
                  href={PATH_APP.profile.ngo.publicDetails.ngoCategory + `/${user.organizationUserDto.groupCategoryId}`}
                  passHref
                >
                  <IconButton>
                    <Edit2 variant="Outline" size="16" color={theme.palette.text.primary} />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={handleRoutingCategory}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Add color={theme.palette.text.primary} />
                <Typography color="text.primary">Add NGO Category</Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          NGO Size
        </Typography>
        {!!user?.organizationUserDto?.numberRange ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <SvgIconStyle src={`/icons/relationshipIcon.svg`} sx={{ width: 10, height: 10 }} />
                <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                  {user?.organizationUserDto?.numberRange?.desc}
                </Typography>
              </Box>
              <Box>
                <Link
                  href={PATH_APP.profile.ngo.publicDetails.ngoSize + `/${user.organizationUserDto.numberRange.id}`}
                  passHref
                >
                  <IconButton>
                    <Edit2 variant="Outline" size="16" color={theme.palette.text.primary} />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={handleRoutingSize}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Add color={theme.palette.text.primary} />
                <Typography color="text.primary">Add NGO Size</Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          Date of Establishment
        </Typography>
        {!!user?.organizationUserDto?.establishmentDate ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <Typography variant="subtitle2" color="text.primary" component="span" sx={{ mr: 1 }}>
                  {getMonthName(new Date(user?.organizationUserDto?.establishmentDate))},{' '}
                  {new Date(user?.organizationUserDto?.establishmentDate).getFullYear()}
                </Typography>
              </Box>
              <Box>
                <Link
                  href={PATH_APP.profile.ngo.publicDetails.ngoEstablishedDate + `/${user.organizationUserDto.id}`}
                  passHref
                >
                  <IconButton>
                    <Edit2 variant="Outline" size="16" color={theme.palette.text.primary} />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={() => handleRoutingEstablishedDate()}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Add color={theme.palette.text.primary} />
                <Typography color="text.primary">Add Date of Establishment</Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          Located in
        </Typography>
        {!!user?.organizationUserDto?.place ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                <Typography variant="subtitle2" color="text.primary" component="span" sx={{ mr: 1 }}>
                  {!!user?.organizationUserDto?.address && `${user?.organizationUserDto?.address}, `}
                  {user?.organizationUserDto?.place?.mainText}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  onClick={() =>
                    handleEditLocation(
                      user?.organizationUserDto?.place as Place,
                      user?.organizationUserDto?.placeAudience,
                      user?.organizationUserDto?.address,
                      user?.organizationUserDto?.lat,
                      user?.organizationUserDto?.lng
                    )
                  }
                >
                  <Edit2 variant="Outline" size="16" color={theme.palette.text.primary} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={() => handleRoutingLocation({ placeAudience: AudienceEnum.Public })}
            sx={{
              borderColor: 'text.secondary',
              '&:active': {
                borderColor: 'text.secondary',
              },
            }}
          >
            {audienceIsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Add color={theme.palette.text.primary} />
                <Typography color="text.primary">Add Location</Typography>
              </>
            )}
          </Button>
        )}
      </Stack>
      <Divider />
      <>
        <Stack spacing={2} sx={{ px: 2, mb: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Joined Garden of Love
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {user?.organizationUserDto?.joinDateTime && (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(user?.organizationUserDto?.joinDateTime))}{' '}
                {new Date(user?.organizationUserDto?.joinDateTime).getFullYear()}
              </Typography>
            )}
            <LoadingButton
              loading={audienceIsLoading || isLoading}
              onClick={() => setSelectAudience(true)}
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
            >
              <Typography color={theme.palette.text.primary}>
                {
                  Object.keys(AudienceEnum)[
                    Object.values(AudienceEnum).indexOf(user?.organizationUserDto?.joinAudience)
                  ]
                }
              </Typography>
            </LoadingButton>
          </Stack>
        </Stack>
        <Divider />
      </>
      <BottomSheet open={selectAudience} onDismiss={() => setSelectAudience(false)}>
        <SelectAudienceMain
          value={user?.organizationUserDto?.joinAudience}
          onChange={(value) => handelJoinAudience(value)}
        />
      </BottomSheet>
    </Stack>
  );
}
