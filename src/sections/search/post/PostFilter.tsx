import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import {
  addSearchPeople,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeSearchPeople,
  setChangeFilterFlag,
  setSearchedExpandedFilter,
  setSearchSor,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import PeopleFilter from '../filters/PeopleFilter';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';
import CreattionTimeSort from '../sorts/CreattionTimeSort';
import { Expanded } from '../SearchFilter';

export default function PostFilter() {
  const expandedFilter = useSelector(getSearchedExpandedFilter);
  const dispatch = useDispatch();
  const confirmedSearch = useSelector(getConfirmSearch);

  const handleExpandedChange = (panel: Expanded | null) => {
    dispatch(setSearchedExpandedFilter(panel));
  };

  const searchedValue = useSelector(getSearchedValues);

  const applyFilter = () => {
    dispatch(setChangeFilterFlag());
  };

  const renderFilterOption = () => {
    switch (expandedFilter) {
      case 'Creation Time':
        return (
          <CreattionTimeSort
            creationTimeChanged={(sort) => dispatch(setSearchSor(sort))}
            creattionTime={searchedValue.sortBy}
          />
        );
      case 'Posted by':
        return (
          <PeopleFilter
            selectedPeople={searchedValue.peoples}
            peopleRemoved={(people) => dispatch(removeSearchPeople(people))}
            peopleSelected={(people) => dispatch(addSearchPeople(people))}
          />
        );

      default:
        return (
          <>
            <StackStyle onClick={() => handleExpandedChange('Creation Time')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.sortBy}>
                <Typography variant="body2" color="text.primary">
                  Creation Time
                </Typography>
              </SearchBadgeStyle>

              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('Posted by')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.peoples.length}>
                <Typography variant="body2" color="text.primary">
                  Posted by
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <Stack spacing={2} justifyContent="space-between" direction="row">
              {/* <Button sx={{ flex: 1 }} variant="secondary">
                Clear
              </Button> */}
              <Button onClick={() => applyFilter()} sx={{ flex: 1 }} variant="primary">
                Apply
              </Button>
            </Stack>
          </>
        );
    }
  };

  return <>{renderFilterOption()}</>;
}
