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
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import useDebounce from 'src/utils/useDebounce';
import { useLazySearchCollegesQuery } from 'src/_requests/graphql/profile/publicDetails/queries/searchColleges.generated';


interface IUniversityFilterProps {
  selecedUniversities: ICollege[];
  universitySelected: (place: ICollege) => void;
  universityRemoved: (place: ICollege) => void;
}

const UniversityFilter: FC<IUniversityFilterProps> = ({
  selecedUniversities,
  universityRemoved,
  universitySelected,
}) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getColleges, { isFetching: gettingUniversityLoading, data: universities }] = useLazySearchCollegesQuery();

  useEffect(() => {
    if (!searcheDebouncedValue) return;
    getColleges({
      filter: {
        dto: { name: searcheDebouncedValue, instituteType: InstituteTypeEnum.University },
        pageIndex: 1,
        pageSize: 5,
      },
    });
  }, [searcheDebouncedValue]);

  const checkChecked = (college: ICollege) => selecedUniversities.some((i) => i.id === college.id);
  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="university"
        placeholder="University Names"
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
        {selecedUniversities.map((university) => (
          <Chip
            key={`selected-university-${university.id}`}
            label={university.name}
            onDelete={() => universityRemoved(university)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>
      {gettingUniversityLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!gettingUniversityLoading && searcheDebouncedValue && (
        <>
          {universities?.searchColleges?.listDto?.items.map((university) => (
            <Stack key={university.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(university)}
                onChange={() =>
                  checkChecked(university) ? universityRemoved(university) : universitySelected(university)
                }
              />
              <Avatar sx={{ width: 32, height: 32 }}>{university.name[0]}</Avatar>
              <Tooltip title={university.name}>
                <Typography noWrap data-text={university.name} variant="subtitle2" color="text.primary">
                  {university.name}
                </Typography>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searcheDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            Start typing to find Universities
          </Typography>
        </Stack>
      )}

      {searcheDebouncedValue && !gettingUniversityLoading && universities?.searchColleges?.listDto?.items.length === 0 && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            No Result Found
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default UniversityFilter;
