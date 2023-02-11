import { Box, Divider, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { useDispatch } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useCreateCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createCollege.generated';
import { useLazySearchCollegesQuery } from 'src/_requests/graphql/profile/publicDetails/queries/searchColleges.generated';

type collegeType = {
  id: string;
  title?: string;
};

interface UniNameProps {
  onChange: (value: { id: string; name: string }) => void;
}

export default function UniversityName(props: UniNameProps) {
  const { onChange } = props;
  const [searching, setSearching] = useState<boolean>();

  //Mutation
  const [createUniversity] = useCreateCollegeMutation();

  //query
  const [searchCollege, { data, isFetching }] = useLazySearchCollegesQuery();
  const searchUniName = useMemo(
    () => data?.searchColleges?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchColleges?.listDto?.items]
  );
  //get Query
  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchCollege({
          filter: {
            dto: {
              name: val,
              instituteType: InstituteTypeEnum.University,
            },
          },
        })
      );
  };

  //For Redux & mutation
  const dispatch = useDispatch();
  const handleChange = async (value: collegeType & { inputValue: string }) => {
    if (value.inputValue) {
      //mutation create university name
      const response: any = await createUniversity({
        filter: {
          dto: {
            name: value.inputValue,
            instituteType: InstituteTypeEnum.University,
          },
        },
      });
      if (response?.data?.createCollege?.isSuccess) {
        const uniData = response?.data?.createCollege?.listDto?.items?.[0];
        console.log('assdaadsaasdasd', uniData);

        onChange({ id: uniData.id, name: uniData.name });
      }
    } else {
      onChange({ id: value.id, name: value.title });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            University Name
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
          options={searchUniName || data?.searchColleges?.listDto?.items || []}
          placeholder="University Name"
        />

        {!searching && (
          <>
            <Box mt={6} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.seconary">
                Start typing to find your University
              </Typography>
            </Box>
          </>
        )}
      </Stack>
    </Stack>
  );
}
