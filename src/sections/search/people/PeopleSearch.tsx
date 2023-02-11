import { Stack } from '@mui/material';
import React, { FC } from 'react';
import PeopleItem from './PeopleItem';
import PeopleSkelton from '../skelton/PeopleSkelton';
import { useSelector } from 'src/redux/store';
import { getActiveFilter, getSearchCount, getSearchedPeople, getSearchLoading } from 'src/redux/slices/search';
import { SearchWrapperStyle } from '../SharedStyled';
import PeopleNotFound from '../notFound/PeopleNotFound';
import SearchSeeMore from '../SeeMore';

const PeopleSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const peoples = useSelector(getSearchedPeople);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <SearchWrapperStyle spacing={2}>
      <Stack spacing={2}>
        {peoples.map((people, index) => (
          <PeopleItem index={index} key={people.id} people={people} />
        ))}
      </Stack>

      {peoples.length === 0 && loading && (
        <>
          {[...Array(25)].map((i, index) => (
            <PeopleSkelton key={`people-skelton-${index}`} />
          ))}
        </>
      )}

      {peoples.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PeopleNotFound />
        </Stack>
      )}

      {peoples.length > 0 && count > peoples.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </SearchWrapperStyle>
  );
};

export default PeopleSearch;
