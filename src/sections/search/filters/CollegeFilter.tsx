import {
  Avatar,
  Box,
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
import { ICollege } from 'src/@types/education';
import { InstituteType, InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import useDebounce from 'src/utils/useDebounce';
import { useLazySearchCollegesQuery } from 'src/_requests/graphql/profile/publicDetails/queries/searchColleges.generated';
import { useLazyGetCollegeForFilterQuery } from 'src/_requests/graphql/search/filters/queries/getCollegeForFilter.generated';

interface ICollegeFilterProps {
  selectedColleges: ICollege[];
  collegeSelected: (place: ICollege) => void;
  collegeRemoved: (place: ICollege) => void;
}

const CollegeFilter: FC<ICollegeFilterProps> = ({ selectedColleges, collegeRemoved, collegeSelected }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getColleges, { isFetching: gettingCollegeLoading, data: colleges }] = useLazyGetCollegeForFilterQuery();

  useEffect(() => {
    if (!searcheDebouncedValue) return;
    getColleges({
      filter: {
        dto: { searchText: searcheDebouncedValue, instituteType: InstituteType.College },
        pageIndex: 1,
        pageSize: 5,
      },
    });
  }, [searcheDebouncedValue]);

  const checkChecked = (college: ICollege) => selectedColleges.some((i) => i.id === college.id);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="college"
        placeholder="College Names"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedColleges.map((college) => (
          <Chip
            key={`selected-college-${college.id}`}
            label={college.title}
            onDelete={() => collegeRemoved(college)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {gettingCollegeLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!gettingCollegeLoading && searcheDebouncedValue && (
        <>
          {colleges?.collegeSearchQueryHandler?.listDto?.items.map((college) => (
            <Stack key={college.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(college)}
                onChange={() => (checkChecked(college) ? collegeRemoved(college) : collegeSelected(college))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{college.title[0]}</Avatar>
              <Tooltip title={college.title}>
                <Typography noWrap data-text={college.title} variant="subtitle2" color="text.primary">
                  {college.title}
                </Typography>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searcheDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            Start typing to find Colleges
          </Typography>
        </Stack>
      )}

      {searcheDebouncedValue &&
        !gettingCollegeLoading &&
        colleges?.collegeSearchQueryHandler?.listDto?.items.length === 0 && (
          <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
            <Typography variant="body2" color="grey.500">
              No Result Found
            </Typography>
          </Stack>
        )}
    </Stack>
  );
};

export default CollegeFilter;
