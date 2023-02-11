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
import { ISearchedUser } from 'src/@types/user';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetUserQuery } from 'src/_requests/graphql/post/create-post/queries/getUserQuery.generated';

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

interface ICollegeFilterProps {
  selectedPeople: ISearchedUser[];
  peopleSelected: (place: ISearchedUser) => void;
  peopleRemoved: (place: ISearchedUser) => void;
}

const PeopleFilter: FC<ICollegeFilterProps> = ({ selectedPeople, peopleSelected, peopleRemoved }) => {
  const [searchedValue, setSearchedValue] = useState<string>('');
  const searcheDebouncedValue = useDebounce<string>(searchedValue, 500);
  const [getUser, { isFetching: fetchingUser, data: users }] = useLazyGetUserQuery();

  useEffect(() => {
    if (!searcheDebouncedValue) return;
    getUser({
      filter: {
        dto: { searchText: searcheDebouncedValue },
        pageIndex: 0,
        pageSize: 5,
      },
    });
  }, [searcheDebouncedValue]);

  const checkChecked = (people: ISearchedUser) => selectedPeople.some((i) => i.id === people.id);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="people"
        placeholder="User Names"
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
        {selectedPeople.map((people) => (
          <Chip
            key={`selected-people-${people.id}`}
            label={people.fullName}
            onDelete={() => peopleRemoved(people)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      {fetchingUser && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!fetchingUser && searcheDebouncedValue && (
        <>
          {users?.getUserQuery?.listDto?.items.map((people) => (
            <Stack key={people.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(people)}
                onChange={() => (checkChecked(people) ? peopleRemoved(people) : peopleSelected(people))}
              />
              <Avatar src={people.avatarUrl || ''} sx={{ width: 32, height: 32 }}>
                {!people.avatarUrl ? people.fullName[0] : ''}
              </Avatar>
              <Tooltip title={people.fullName}>
                <ElipsesText noWrap data-text={people.fullName} variant="subtitle2" color="text.primary">
                  {people.fullName}
                </ElipsesText>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searcheDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            Start typing to find Users
          </Typography>
        </Stack>
      )}

      {searcheDebouncedValue && !fetchingUser && users?.getUserQuery?.listDto?.items.length === 0 && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            No Result Found
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PeopleFilter;
