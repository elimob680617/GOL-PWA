import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import AutoComplete from 'src/components/AutoComplete';
import { userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useLazySearchCitiesQuery } from 'src/_requests/graphql/locality/queries/searchCities.generated';

interface SelectHometownProps {
  onChange: (value: { id?: string; name?: string }) => void;
}

function HomeTown(props: SelectHometownProps) {
  const { onChange } = props;
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  const [searching, setSearching] = useState<boolean>();
  const userCity = useSelector(userLocationSelector);

  const handleInputChange = (val: string) => {
    if (!!val) {
      setSearching(true);
    } else {
      setSearching(false);
    }
    if (val.length > 2)
      debounceFn(() =>
        searchCities({
          filter: {
            dto: {
              seearchValue: val,
            },
          },
        })
      );
  };

  const handleChange = (val: any) => {
    onChange({ id: val?.id, name: val?.title });
  };

  useEffect(() => {
    if (!userCity) router.push('/profile/user/public-details/list');
  }, [userCity, router]);

  const citiesOption = useMemo(
    () => data?.searchCities?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchCities.listDto?.items]
  );
  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Home Town
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <AutoComplete
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={citiesOption || []}
          placeholder="Home Town"
        />
        {!searching && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Typography color="text.secondary" variant="body2">
                Start typing to find your Home Town
              </Typography>
            </Box>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default HomeTown;
