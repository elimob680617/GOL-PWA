import { Box, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Concentration } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import debounceFn from 'src/utils/debounce';
import { useCreateConcentrationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createConcentraition.generated';
import { useLazySearchConcentrationsQuery } from 'src/_requests/graphql/profile/publicDetails/queries/concentration.generated';

interface ConcentrationProps {
  onChange: (value: { id: string; title?: string }) => void;
}

export default function UniversityConcentration(props: ConcentrationProps) {
  const { onChange } = props;
  const [searching, setSearching] = useState<boolean>();

  const [concentration, { data, isFetching }] = useLazySearchConcentrationsQuery();
  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        concentration({
          filter: {
            dto: {
              title: val,
            },
          },
        })
      );
  };
  //Mutation
  const [createConcentration] = useCreateConcentrationMutation();

  const handleChange = async (value: Concentration & { inputValue: string }) => {
    if (value.inputValue) {
      const response: any = await createConcentration({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (response?.data?.createConcentration?.isSuccess) {
        const uniData = response?.data?.createConcentration?.listDto?.items?.[0];
        onChange({ id: uniData?.id, title: uniData?.title });
      }
    } else {
      onChange(value);
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            Concentration
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack sx={{ px: 2 }}>
        <AutoCompleteAddable
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={data?.concentrations?.listDto?.items || []}
          placeholder="Concentration"
        />
        <Box>
          <Box mt={6} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!searching && (
              <Typography variant="body2" color="text.seconary">
                Start typing to find your Concenteration
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
