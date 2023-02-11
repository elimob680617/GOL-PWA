//mui
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import {
  getSearchedNgo,
  getSearchLoading,
} from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import NgoNotFound from '../notFound/NgoNotFound';
import { HorizontalScrollerWithScroll } from '../SharedStyled';
import PeopleItem from './people/PeopleItem';

function AllNgoSearch() {
  const ngos = useSelector(getSearchedNgo);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Ngos
        </Typography>
        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.ngo}>
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
        {ngos.map((ngo, index) => (
          <Box key={ngo.id} sx={{ width: 152, display: 'inline-block' }}>
            <PeopleItem index={index} people={ngo} varient="ngo" />
          </Box>
        ))}

        {ngos.length === 0 && loading && (
          // <>
          //   {[...Array(4)].map((i, index) => (
          //     <PeopleSkelton key={`people-skelton-${index}`} />
          //   ))}
          // </>

          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {ngos.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <NgoNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithScroll>
    </Stack>
  );
}

export default AllNgoSearch;
