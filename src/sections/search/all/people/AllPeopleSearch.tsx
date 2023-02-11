//mui
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import {
  getSearchedPeople,
  getSearchLoading,
} from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import PeopleNotFound from '../../notFound/PeopleNotFound';
//component
import { HorizontalScrollerWithScroll } from '../../SharedStyled';
import PeopleItem from './PeopleItem';

function AllPeopleSearch() {
  const peoples = useSelector(getSearchedPeople);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          People
        </Typography>
        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.people}>
            <a>See more</a>
          </Link>
        </Typography>
      </Stack>
      <HorizontalScrollerWithScroll
        sx={{
          '& :not(:last-child)': {
            marginRight: '8px',
          },
        }}
      >
        {peoples.map((people, index) => (
          <Box key={people.id} sx={{ width: 152, display: 'inline-block' }}>
            <PeopleItem index={index} people={people} />
          </Box>
        ))}

        {peoples.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {peoples.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <PeopleNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithScroll>
    </Stack>
  );
}

export default AllPeopleSearch;
