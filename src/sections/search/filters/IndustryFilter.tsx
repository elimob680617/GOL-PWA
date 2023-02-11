import {
  Avatar,
  Checkbox,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { IIndustry } from 'src/@types/categories';
import { GroupCategoryTypeEnum } from 'src/@types/sections/serverTypes';
import useDebounce from 'src/utils/useDebounce';
import { useLazySearchGroupCategoriesQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';

const ElipsesText = styled(Typography)(({ theme }) => ({
  //   position: 'relative',
  //   '&:focus, &:hover': {
  //     overflow: 'visible',
  //     color: 'transparent',
  //     '&:after': {
  //       content: 'attr(data-text)',
  //       overflow: 'visible',
  //       textOverflow: 'inherit',
  //       position: 'absolute',
  //       left: '0',
  //       top: '0',
  //       whiteSpace: 'normal',
  //       wordWrap: 'break-word',
  //       display: 'block',
  //       zIndex: 2,
  //       color: theme.palette.text.primary,
  //       maxWidth: 'min-content',
  //       backgroundColor: theme.palette.background.paper,
  //       boxShadow: '0 2px 4px 0 rgba(0,0,0,.28)',
  //       padding: theme.spacing(1),
  //       borderRadius: theme.spacing(1),
  //     },
  //   },
}));

interface IIndustryFilterProps {
  selectedIndustries: IIndustry[];
  industrySelected: (industry: IIndustry) => void;
  industryRemoved: (industry: IIndustry) => void;
}

const IndustryFilter: FC<IIndustryFilterProps> = ({ selectedIndustries, industryRemoved, industrySelected }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searchedValueDebouncedValue = useDebounce<string>(searchedValue, 500);

  const [getIndustries, { isFetching: gettingIndustryLoading, data: industries }] = useLazySearchGroupCategoriesQuery();

  useEffect(() => {
    if (!searchedValueDebouncedValue) return;
    getIndustries({
      filter: {
        dto: { title: searchedValueDebouncedValue, groupCategoryType: GroupCategoryTypeEnum.Industry },
        pageIndex: 1,
        pageSize: 5,
      },
    });
  }, [searchedValueDebouncedValue]);

  const checkChecked = (industry: IIndustry) => selectedIndustries.some((i) => i.id === industry.id);

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        id="industry"
        placeholder="Industry"
        variant="outlined"
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
            </InputAdornment>
          ),
        }}
      />

      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedIndustries.map((industry) => (
          <Chip
            key={`selected-industry-${industry.id}`}
            label={industry.title}
            onDelete={() => industryRemoved(industry)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {gettingIndustryLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!gettingIndustryLoading && searchedValueDebouncedValue && (
        <>
          {industries?.searchGroupCategories?.listDto?.items?.map((industry) => (
            <Stack key={industry.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(industry)}
                onChange={() => (checkChecked(industry) ? industryRemoved(industry) : industrySelected(industry))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{industry.title[0]}</Avatar>
              <Tooltip title={industry.title}>
                <ElipsesText noWrap data-text={industry.title} variant="subtitle2" color="text.primary">
                  {industry.title}
                </ElipsesText>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searchedValueDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            Start typing to find Industries
          </Typography>
        </Stack>
      )}

      {searchedValueDebouncedValue &&
        !gettingIndustryLoading &&
        industries?.searchGroupCategories?.listDto?.items.length === 0 && (
          <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
            <Typography variant="body2" color="grey.500">
              No Result Found
            </Typography>
          </Stack>
        )}
    </Stack>
  );
};

export default IndustryFilter;
