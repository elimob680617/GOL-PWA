import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SearchTypeEnum } from 'src/@types/sections/serverTypes';
import SelectLocationRow from 'src/components/location/LocationSelect';
import NotFound from 'src/components/notFound/NotFound';
import { placeSearchRadius } from 'src/config';
import { basicSharePostSelector, setCurrentPosition, setSharedPostLocation } from 'src/redux/slices/post/sharePost';
import { useSelector } from 'src/redux/store';
import useDebounce from 'src/utils/useDebounce';
import { useLazySearchPlacesQuery } from 'src/_requests/graphql/locality/queries/searchPlaces.generated';
import { useLazyGetLastLocationsQuery } from 'src/_requests/graphql/post/getLatLocation.generated';
import AllowGpsConfirm from '../create-post/social-post/AllowGpsConfirm';

const OneLineTextStyle = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  color: theme.palette.text.primary,
  fontWeight: 500,
  lineHeight: '23px',
  fontSize: '16px',
}));

interface IPlace {
  description?: string;
  placeId?: string;
  searchType?: SearchTypeEnum;
  structuredFormatting?: {
    mainText?: string;
    secondaryText?: string;
  };
}

function SharePostAddLocation() {
  const post = useSelector(basicSharePostSelector);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { back } = useRouter();
  const [openGpsConfirm, setOpenGpsConfirm] = useState<boolean>(false);
  const [nearByPlaces, setNearByPlaces] = useState<IPlace[]>([]);
  const [openSearchPlaces, setOpenSearchPlaces] = useState<IPlace[]>([]);
  const [getPlacesQuery, { isLoading: gettingPlaceLoading, data: places, isFetching: fetchingPlaceLoading }] =
    useLazySearchPlacesQuery();
  const [getRecentPlaces, { data: recentPlaces }] = useLazyGetLastLocationsQuery();
  const [searchedText, setSearchedText] = useState<string>('');
  const [searchedValue, setSearchedValue] = useState<string>();
  const [createPlaceLoading, setCreatePlaceLoading] = useState<boolean>(false);

  const debouncedValue = useDebounce<string>(searchedText, 500);

  useEffect(() => {
    if (debouncedValue) {
      setNearByPlaces([]);
      setOpenSearchPlaces([]);
      getPlacesQuery({
        filter: {
          dto: {
            searchText: debouncedValue,
            locationDto: {
              lat: post.currentPosition[0],
              lng: post.currentPosition[1],
              searchRadius: placeSearchRadius,
              strictBounds: post.currentPosition[0] && post.currentPosition[1] ? true : false,
            },
          },
        },
      });
    }
  }, [debouncedValue, getPlacesQuery, post.currentPosition]);

  useEffect(() => {
    getRecentPlaces({ filter: { pageIndex: 0, pageSize: 5 } });
  }, []);

  const getCreatePlaceLoading = (loading: boolean) => {
    setCreatePlaceLoading(loading);
  };

  useEffect(() => {
    if (
      places &&
      places.searchPlaces &&
      places.searchPlaces.listDto &&
      places.searchPlaces.listDto.items &&
      places.searchPlaces.listDto.items[0]?.predictions &&
      places.searchPlaces.listDto.items[0]?.predictions?.length > 0 &&
      post.currentPosition[0] &&
      post.currentPosition[1]
    ) {
      const findedPlaces = places?.searchPlaces.listDto?.items[0]?.predictions;
      const nearBy = findedPlaces.filter((i) => i.searchType === SearchTypeEnum.Nearby);
      const openSearch = findedPlaces.filter((i) => i.searchType === SearchTypeEnum.OpenSearch);
      setNearByPlaces(nearBy);
      setOpenSearchPlaces(openSearch);
    }
  }, [places, post.currentPosition]);

  function setPosition(position: GeolocationPosition) {
    dispatch(setCurrentPosition([position.coords.latitude!, position.coords.longitude!]));
  }

  function positionError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied the request for Geolocation.');
        break;

      case error.POSITION_UNAVAILABLE:
        console.error('Location information is unavailable.');
        break;

      case error.TIMEOUT:
        console.error('The request to get user location timed out.');
        break;

      default:
        console.error('An unknown error occurred.');
        break;
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition, positionError);
    } else {
      console.log('no access');
    }
  };
  return (
    <>
      <Stack>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ p: 2, borderBottom: `1px solid ${theme.palette.grey[100]}` }}
        >
          <Stack direction={'row'} spacing={2.5} alignItems={'center'}>
            <IconButton onClick={() => back()} sx={{ padding: 0 }}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1">Add location</Typography>
          </Stack>
        </Stack>

        {!createPlaceLoading && (
          <Stack
            sx={{
              minHeight: 'calc(100vh - 49px)',
              maxHeight: 'calc(100vh - 49px)',
              padding: 2,
              overflowY: 'auto',
            }}
          >
            <Stack spacing={3}>
              <Box sx={{ width: '100%' }}>
                <TextField
                  value={searchedText}
                  onChange={(e) => setSearchedText(e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Where are you?"
                  InputProps={{
                    endAdornment: searchedText && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchedText('')}>
                          <Image
                            src="/icons/Close/24/Outline.svg"
                            width={24}
                            height={24}
                            alt="place search input remover"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {post.currentPosition[0] && post.currentPosition[1] && !debouncedValue && (
                <NotFound text={'Search here to find your location'} />
              )}

              {!debouncedValue && (
                <>
                  {' '}
                  {/* gps is off */}
                  {!post.currentPosition[0] && !post.currentPosition[1] && (
                    <Stack
                      alignItems="center"
                      spacing={3}
                      sx={[
                        (theme) => ({
                          padding: theme.spacing(0, 2),
                        }),
                      ]}
                    >
                      <Typography
                        variant="h4"
                        sx={[
                          (theme) => ({
                            color: theme.palette.text.primary,
                          }),
                        ]}
                      >
                        Find place near you
                      </Typography>
                      {!debouncedValue && (
                        <Box sx={{ width: 160, height: 160 }}>
                          <Image src="/icons/location/places.svg" width={160} height={160} alt="location" />
                        </Box>
                      )}

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          textAlign: 'center',
                          color: (theme) => theme.palette.text.secondary,
                          margin: (theme) => theme.spacing(3, 0),
                          marginRight: '52px',
                          marginLeft: '52px',
                        }}
                      >
                        To see places near you, or to check in to a specific location,turn on Location Services
                      </Typography>
                      <Button onClick={() => setOpenGpsConfirm(true)} sx={{ width: '100%' }} variant="contained">
                        Turn on
                      </Button>
                    </Stack>
                  )}
                  {/* currently selected */}
                  {post.location && !searchedValue && (
                    <Box>
                      <Typography
                        sx={[
                          (theme) => ({
                            color: theme.palette.text.primary,
                            fontSize: '20px',
                            lineHeight: '25px',
                            fontWeight: 700,
                          }),
                        ]}
                        variant="h5"
                      >
                        Currently Selected
                      </Typography>
                      <Stack
                        sx={{ marginTop: 3, height: 24, marginBottom: 3 }}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <OneLineTextStyle variant="subtitle1">{post.location.address}</OneLineTextStyle>

                        <IconButton onClick={() => dispatch(setSharedPostLocation(null))} sx={{ padding: '1px' }}>
                          <Image src="/icons/Close/24/Outline.svg" width={24} height={24} alt="remove currently icon" />
                        </IconButton>
                      </Stack>
                      <Divider />
                    </Box>
                  )}
                  {/* Recents Places */}
                  {!searchedValue &&
                    recentPlaces &&
                    recentPlaces.getLatestLocationsQuery &&
                    recentPlaces.getLatestLocationsQuery.listDto &&
                    recentPlaces?.getLatestLocationsQuery.listDto?.items &&
                    recentPlaces?.getLatestLocationsQuery.listDto?.items?.length > 0 && (
                      <Stack spacing={3}>
                        <Typography
                          sx={[
                            (theme) => ({
                              color: theme.palette.text.primary,
                              fontSize: '20px',
                              lineHeight: '25px',
                              fontWeight: 700,
                            }),
                          ]}
                          variant="h5"
                        >
                          Recents Places
                        </Typography>

                        <Stack spacing={2}>
                          {recentPlaces?.getLatestLocationsQuery.listDto?.items.map((place, index) => {
                            if (index === 0) {
                              return (
                                <Box>
                                  <SelectLocationRow
                                    postId={post.id}
                                    locationType="share"
                                    id={place?.id as string}
                                    address={place?.description as string}
                                    name={place?.mainText as string}
                                    variant="home"
                                    secondaryText={place?.secondaryText as string}
                                    createPostLoadingChange={getCreatePlaceLoading}
                                  />
                                </Box>
                              );
                            } else {
                              return (
                                <Stack spacing={2}>
                                  <Divider />
                                  <Box>
                                    <SelectLocationRow
                                      postId={post.id}
                                      locationType="share"
                                      id={place?.id as string}
                                      address={place?.description as string}
                                      name={place?.mainText as string}
                                      variant="home"
                                      secondaryText={place?.secondaryText as string}
                                      createPostLoadingChange={getCreatePlaceLoading}
                                    />
                                  </Box>
                                </Stack>
                              );
                            }
                          })}
                        </Stack>
                      </Stack>
                    )}
                </>
              )}

              {/* search results */}
              {debouncedValue && (
                <Typography
                  sx={[
                    (theme) => ({
                      color: theme.palette.text.primary,
                      fontSize: '20px',
                      lineHeight: '25px',
                      fontWeight: 700,
                    }),
                  ]}
                  variant="h5"
                >
                  Search Results
                </Typography>
              )}

              {/* when location on */}

              {debouncedValue && !fetchingPlaceLoading && post.currentPosition[0] && post.currentPosition[1] && (
                <Stack spacing={2}>
                  {nearByPlaces.length > 0 && (
                    <Box>
                      <Typography
                        sx={[
                          (theme) => ({
                            color: theme.palette.text.primary,
                            fontSize: '15px',
                            lineHeight: '25px',
                            fontWeight: 700,
                          }),
                        ]}
                        variant="h6"
                      >
                        Near places
                      </Typography>
                    </Box>
                  )}
                  {nearByPlaces.map((place, index) => {
                    if (index === 0) {
                      return (
                        <Box>
                          <SelectLocationRow
                            postId={post.id}
                            locationType="share"
                            id={place?.placeId as string}
                            address={place?.description as string}
                            name={place?.structuredFormatting?.mainText as string}
                            variant="home"
                            secondaryText={place?.structuredFormatting?.secondaryText as string}
                            createPostLoadingChange={getCreatePlaceLoading}
                          />
                        </Box>
                      );
                    } else {
                      return (
                        <Stack spacing={2}>
                          <Divider />
                          <Box>
                            <SelectLocationRow
                              postId={post.id}
                              locationType="share"
                              id={place?.placeId as string}
                              address={place?.description as string}
                              name={place?.structuredFormatting?.mainText as string}
                              variant="home"
                              secondaryText={place?.structuredFormatting?.secondaryText as string}
                              createPostLoadingChange={getCreatePlaceLoading}
                            />
                          </Box>
                        </Stack>
                      );
                    }
                  })}

                  {openSearchPlaces.length > 0 && (
                    <Box>
                      <Typography
                        sx={[
                          (theme) => ({
                            color: theme.palette.text.primary,
                            fontSize: '15px',
                            lineHeight: '25px',
                            fontWeight: 700,
                          }),
                        ]}
                        variant="h6"
                      >
                        Other places
                      </Typography>
                    </Box>
                  )}
                  {openSearchPlaces.map((place, index) => {
                    if (index === 0) {
                      return (
                        <Box>
                          <SelectLocationRow
                            postId={post.id}
                            locationType="share"
                            id={place?.placeId as string}
                            address={place?.description as string}
                            name={place?.structuredFormatting?.mainText as string}
                            variant="home"
                            secondaryText={place?.structuredFormatting?.secondaryText as string}
                            createPostLoadingChange={getCreatePlaceLoading}
                          />
                        </Box>
                      );
                    } else {
                      return (
                        <Stack spacing={2}>
                          <Divider />
                          <Box>
                            <SelectLocationRow
                              postId={post.id}
                              locationType="share"
                              id={place?.placeId as string}
                              address={place?.description as string}
                              name={place?.structuredFormatting?.mainText as string}
                              variant="home"
                              secondaryText={place?.structuredFormatting?.secondaryText as string}
                              createPostLoadingChange={getCreatePlaceLoading}
                            />
                          </Box>
                        </Stack>
                      );
                    }
                  })}
                </Stack>
              )}

              {debouncedValue &&
                !fetchingPlaceLoading &&
                nearByPlaces.length === 0 &&
                openSearchPlaces.length === 0 &&
                places &&
                places.searchPlaces &&
                places.searchPlaces.listDto &&
                places.searchPlaces.listDto.items &&
                places.searchPlaces.listDto.items[0]?.predictions &&
                places.searchPlaces.listDto.items[0]?.predictions?.length > 0 &&
                places?.searchPlaces.listDto?.items[0]?.predictions.map((place, index) => {
                  if (index === 0) {
                    return (
                      <Box>
                        <SelectLocationRow
                          postId={post.id}
                          locationType="share"
                          id={place?.placeId as string}
                          address={place?.description as string}
                          name={place?.structuredFormatting?.mainText as string}
                          variant="home"
                          secondaryText={place?.structuredFormatting?.secondaryText as string}
                          createPostLoadingChange={getCreatePlaceLoading}
                        />
                      </Box>
                    );
                  } else {
                    return (
                      <Stack spacing={2}>
                        <Divider />
                        <Box>
                          <SelectLocationRow
                            postId={post.id}
                            locationType="share"
                            id={place?.placeId as string}
                            address={place?.description as string}
                            name={place?.structuredFormatting?.mainText as string}
                            variant="home"
                            secondaryText={place?.structuredFormatting?.secondaryText as string}
                            createPostLoadingChange={getCreatePlaceLoading}
                          />
                        </Box>
                      </Stack>
                    );
                  }
                })}

              {debouncedValue &&
                !fetchingPlaceLoading &&
                nearByPlaces.length === 0 &&
                places?.searchPlaces.listDto?.items[0]?.predictions.length === 0 &&
                openSearchPlaces.length === 0 && (
                  <Box sx={{ marginTop: 8 }}>
                    <NotFound
                      text={!debouncedValue ? 'Search here to find your location' : 'Sorry! No results found'}
                    />
                  </Box>
                )}

              {fetchingPlaceLoading && debouncedValue && (
                <Stack sx={{ marginTop: 4 }} alignItems="center">
                  <CircularProgress />
                </Stack>
              )}
            </Stack>
          </Stack>
        )}

        <AllowGpsConfirm
          close={() => setOpenGpsConfirm(false)}
          confirm={() => {
            getCurrentLocation();
            setOpenGpsConfirm(false);
          }}
          open={openGpsConfirm}
        />
        {createPlaceLoading && (
          <Stack
            spacing={3}
            sx={{ height: 600, marginTop: 2, paddingRight: 0, paddingLeft: 0 }}
            alignItems="center"
            justifyContent="center"
          >
            <img src="/images/location/location.svg" alt="image" />
            <Typography
              variant="body1"
              sx={{ fontWeight: '300', fontSize: '16px', lineHeight: '20px', color: 'text.primary' }}
            >
              Please wait...
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );
}

export default SharePostAddLocation;
