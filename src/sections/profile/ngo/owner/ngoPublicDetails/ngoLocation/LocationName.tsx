import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RestrictionTypeEnum } from 'src/@types/sections/serverTypes';
import { ngoPlaceUpdated } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useLazySearchPlacesQuery } from 'src/_requests/graphql/locality/queries/searchPlaces.generated';

export default function LocationName() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [searching, setSearching] = useState<boolean>();

  const [searchPlaces, { data, isFetching }] = useLazySearchPlacesQuery();

  const handleInputChange = (val: string) => {
    // setSearching(!!val.length);
    if (val.length > 1) {
      debounceFn(() =>
        searchPlaces({
          filter: {
            dto: {
              searchText: val,
              restrictionType: RestrictionTypeEnum.None,
            },
          },
        })
      );
    }
  };
  const handleChange = (value: any & { inputValue?: string }) => {
    dispatch(
      ngoPlaceUpdated({
        placeId: value.placeId,
        description: value.description,
        mainText: value.structuredFormatting?.mainText,
        isChange: true,
      })
    );
    router.back();
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Search your location
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={2} px={2}>
        <TextField
          size="small"
          onChange={(e) => {
            handleInputChange((e.target as HTMLInputElement).value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img
                  src="/icons/Research/Outline.svg"
                  width={20}
                  height={20}
                  alt="research"
                  style={{ marginRight: 8 }}
                />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          placeholder="Search"
        />
      </Stack>
      <Box>
        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            {data?.searchPlaces?.listDto?.items[0]?.predictions.map((place) => (
              <>
                <Stack key={place?.placeId} direction="row" spacing={1} p={2} onClick={() => handleChange(place)}>
                  <Box />
                  <Stack spacing={0.5}>
                    <Typography>{place?.structuredFormatting?.mainText}</Typography>
                    <Typography>{place?.description}</Typography>
                  </Stack>
                </Stack>
                <Divider />
              </>
            ))}
          </>
        )}
      </Box>
    </Stack>
  );
}
