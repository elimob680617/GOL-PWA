import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import debounceFn from 'src/utils/debounce';
import { useCreateCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createCollege.generated';
import { useLazySearchCollegesQuery } from 'src/_requests/graphql/profile/publicDetails/queries/searchColleges.generated';

type collegeType = {
  id: string;
  title?: string;
};
interface CollegeNameProps {
  onChange: (value: { id: string; name: string }) => void;
}

export default function CollegeName(props: CollegeNameProps) {
  const { onChange } = props;
  const [searching, setSearching] = useState<boolean>();

  //Query
  const [searchCollege, { data, isFetching }] = useLazySearchCollegesQuery();
  //refactor type of query
  const searchCollegeName = useMemo(
    () => data?.searchColleges?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchColleges?.listDto?.items]
  );
  //get Search Query
  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchCollege({
          filter: {
            dto: {
              name: val,
              instituteType: InstituteTypeEnum.College,
            },
          },
        })
      );
  };

  //Mutation
  const [createCollege] = useCreateCollegeMutation();

  const handleChange = async (value: collegeType & { inputValue?: string }) => {
    if (value.inputValue) {
      //mutation create college name
      const response: any = await createCollege({
        filter: {
          dto: {
            name: value.inputValue,
            instituteType: InstituteTypeEnum.College,
          },
        },
      });
      if (response?.data?.createCollege?.isSuccess) {
        const collegeData = response?.data?.createCollege?.listDto?.items?.[0];
        onChange({ id: collegeData.id, name: collegeData.name });
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
            College Name
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
          options={searchCollegeName || []}
          placeholder="College Name"
        />
        <Box>
          <Box mt={6} />
          {!searching && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.seconary">
                Start typing to find your College
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
