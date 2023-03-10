import { Box, Stack, styled } from '@mui/material';
import React, { FC } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  getActiveFilter,
  getSearchLoading,
  setActiveFilter,
  getSearchedNgo,
  getSearchCount,
} from 'src/redux/slices/search';
import { dispatch, useSelector } from 'src/redux/store';
import NgoNotFound from '../notFound/NgoNotFound';
import SearchSeeMore from '../SeeMore';
import { SearchWrapperStyle } from '../SharedStyled';
import NgoSkelton from '../skelton/NgoSkelton';
import NgoFilter from './NgoFilter';
import NgoItem from './NgoItem';

const NgoSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const ngos = useSelector(getSearchedNgo);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);
  const activeFilter = useSelector(getActiveFilter);

  return (
    <SearchWrapperStyle spacing={2}>
      {ngos.map((ngo, index) => (
        <NgoItem index={index} key={ngo.id} ngo={ngo} />
      ))}

      {ngos.length === 0 && loading && (
        <>
          {[...Array(25)].map((i, index) => (
            <NgoSkelton key={`people-skelton-${index}`} />
          ))}
        </>
      )}

      {ngos.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <NgoNotFound />
        </Stack>
      )}

      {ngos.length >0 && count > ngos.length && (
        <SearchSeeMore seeMore={() =>nextPage()} loading={loading} />
      )}

      <BottomSheet
        open={activeFilter === 'Ngo'}
        onDismiss={() => dispatch(setActiveFilter(null))}
        snapPoints={({ minHeight }) => [minHeight]}
      >
        <NgoFilter />
      </BottomSheet>
    </SearchWrapperStyle>
  );
}

export default NgoSearch;
