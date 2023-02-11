import { Box, CircularProgress, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GroupCategoryTypeEnum } from 'src/@types/sections/serverTypes';
import debounceFn from 'src/utils/debounce';
import { useLazySearchGroupCategoriesQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';

interface SelectCategoryType {
  onChange: (value: { id?: string; title?: string; iconUrl?: string }) => void;
}

function CategoryType(props: SelectCategoryType) {
  const { onChange } = props;
  const router = useRouter();
  const [searching, setSearching] = useState<boolean>();
  const id = router?.query?.id?.[0];
  const isEdit = !!id;

  const [getCategoryType, { data, isFetching }] = useLazySearchGroupCategoriesQuery();

  const handleInputChange = (val: string) => {
    if (!!val) {
      setSearching(true);
    } else {
      setSearching(false);
    }
    debounceFn(() =>
      getCategoryType({
        filter: {
          dto: {
            title: val,
            groupCategoryType: GroupCategoryTypeEnum?.Category,
          },
        },
      })
    );
  };

  const handleChange = (val: any) => {
    onChange({ id: val?.id, title: val?.title, iconUrl: val?.iconUrl });
  };

  useEffect(() => {
    getCategoryType({
      filter: {
        dto: {
          title: '',
          groupCategoryType: GroupCategoryTypeEnum.Category,
        },
      },
    });
  }, []);

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            NGO Category
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
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
          placeholder="NGO Category"
        />
        {isFetching ? (
          <CircularProgress size={20} />
        ) : (
          <>
            {data?.searchGroupCategories?.listDto?.items?.map((type) => (
              <Typography key={type.id} onClick={() => handleChange(type)}>
                {type?.title}
              </Typography>
            ))}
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default CategoryType;
