//mui
import { Box, Stack, styled } from '@mui/material';
import AllHashtagSearch from './AllHashtags';
import AllNgoSearch from './AllNgoSearch';
import AllPeopleSearch from './people/AllPeopleSearch';
import AllPostSearch from './AllPostSearch';
import AllFundrasingSearch from './AllFundraisingSearch';

const ItemWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
}));

export default function AllSearch() {
  return (
    <>
      <Stack sx={{ width: '100%', borderRadius: 1,overflowX:'hidden' }} spacing={2}>
        <ItemWrapper>
          <AllPeopleSearch />
        </ItemWrapper>
        <ItemWrapper>
          <AllNgoSearch />
        </ItemWrapper>
        <ItemWrapper sx={{ padding: 0 }}>
          <AllPostSearch />
        </ItemWrapper>
        <ItemWrapper sx={{ padding: 0 }}>
          <AllFundrasingSearch />
        </ItemWrapper>
        <ItemWrapper>
          <AllHashtagSearch />
        </ItemWrapper>
      </Stack>
    </>
  );
}
