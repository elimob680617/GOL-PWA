import { Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import {
  getActiveFilter,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  resetConfirmedSearch,
  setActiveFilter,
  setConfirmiedSearch,
  setSearchedExpandedFilter,
  valuingSearchValues,
} from 'src/redux/slices/search';
import { dispatch } from 'src/redux/store';
import RenderFilter from './RenderFilter';
import { BottomSheet } from 'react-spring-bottom-sheet';

export type Expanded =
  | 'Location'
  | 'Skill'
  | 'Worked Company'
  | 'University'
  | 'College'
  | 'Sort'
  | 'Type'
  | 'Creation Date'
  | 'Category'
  | 'Location'
  | 'NGO'
  | 'Industry'
  | 'NGO Size'
  | 'Creation Time'
  | 'Posted by'

const SearchFilter: FC = () => {
  const activeFilter = useSelector(getActiveFilter);
  const activeSearched = useSelector(getSearchedValues);
  const confirmedSearch = useSelector(getConfirmSearch);
  const expandedFilter = useSelector(getSearchedExpandedFilter);

  const handleExpandedChange = (panel: Expanded | null) => {
    dispatch(setSearchedExpandedFilter(panel));
  };

  const handleConfirmSearch = () => {
    dispatch(setConfirmiedSearch(activeSearched));
    handleExpandedChange(null);
  };

  const handleResetSearch = () => {
    dispatch(resetConfirmedSearch());
  };

  useEffect(() => {
    handleExpandedChange(null);
  }, [activeFilter]);

  useEffect(() => {
    dispatch(valuingSearchValues(confirmedSearch));
  }, [expandedFilter]);

  return (
    <BottomSheet
      open={activeFilter && activeFilter !== 'All'}
      onDismiss={() => dispatch(setActiveFilter(null))}
      snapPoints={({ minHeight, maxHeight }) => [minHeight]}
    >
      <Stack p={3} spacing={3}>
        <Stack justifyContent="space-between" spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              {expandedFilter && (
                <IconButton onClick={() => handleExpandedChange(null)} sx={{ padding: 0 }}>
                  <Image src="/icons/arrow/left-arrow.svg" width={24} height={24} alt="header-left-arrow" />
                </IconButton>
              )}

              <Typography variant="subtitle1" color="text.primary">
                {expandedFilter ? expandedFilter : 'Filters'}
              </Typography>
            </Stack>
            {expandedFilter && confirmedSearch != activeSearched && (
              <Button onClick={() => handleConfirmSearch()} variant="text" sx={{ color: 'primary.main' }}>
                Done
              </Button>
            )}
            {!expandedFilter && confirmedSearch != activeSearched && (
              <Button onClick={() => handleResetSearch()} variant="text" sx={{ color: 'info.main' }}>
                Clear All
              </Button>
            )}
          </Stack>

          <Divider />

          <RenderFilter activeFilter={activeFilter} />
        </Stack>
      </Stack>
    </BottomSheet>
  );
};

export default SearchFilter;
