import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import {
  addFundraisingCategory,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeFundraisingCategory,
  setChangeFilterFlag,
  setSearchedExpandedFilter,
  setSearchLocation,
  setSearchNgoFilter,
  setSearchSor,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import FundraisingCategoryFilter from '../filters/FundraisingCategory';
import LocationFilter from '../filters/LocationFilter';
import NgoFiltering from '../filters/NgoFiltering';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';
import CreattionTimeSort from '../sorts/CreattionTimeSort';
import { Expanded } from '../SearchFilter';

export default function FundraisingFilter() {
  const expandedFilter = useSelector(getSearchedExpandedFilter);
  const dispatch = useDispatch();
  const activeSearched = useSelector(getSearchedValues);
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
      case 'Creation Date':
        return (
          <CreattionTimeSort
            creattionTime={searchedValue.sortBy}
            creationTimeChanged={(sort) => dispatch(setSearchSor(sort))}
          />
        );
      case 'Category':
        return (
          <FundraisingCategoryFilter
            selectedCategories={searchedValue.fundraisingCategory}
            categoryRemoved={(category) => dispatch(removeFundraisingCategory(category))}
            categorySelected={(category) => dispatch(addFundraisingCategory(category))}
          />
        );

      case 'Location':
        return (
          <LocationFilter
            selectedLocations={searchedValue.locations}
            locationSelected={(place) => dispatch(setSearchLocation([...searchedValue.locations, place]))}
            locationRemoved={(place) =>
              dispatch(setSearchLocation([...searchedValue.locations.filter((i) => i !== place)]))
            }
          />
        );
      case 'NGO':
        return (
          <NgoFiltering
            selectedNgos={searchedValue.ngos}
            ngoSelected={(ngo) => dispatch(setSearchNgoFilter([...searchedValue.ngos, ngo]))}
            ngoRemoved={(ngo) => dispatch(setSearchNgoFilter([...searchedValue.ngos.filter((i) => i.id !== ngo.id)]))}
          />
        );
      default:
        return (
          <>
            <StackStyle onClick={() => handleExpandedChange('Creation Date')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.sortBy}>
                <Typography variant="body2" color="text.primary">
                  Creation Time
                </Typography>
              </SearchBadgeStyle>

              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('Category')}>
              <SearchBadgeStyle
                color="error"
                variant="dot"
                invisible={confirmedSearch.fundraisingCategory.length === 0}
              >
                <Typography variant="body2" color="text.primary">
                  Category
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('Location')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={confirmedSearch.locations.length === 0}>
                <Typography variant="body2" color="text.primary">
                  Location
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('NGO')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={confirmedSearch.ngos.length === 0}>
                <Typography variant="body2" color="text.primary">
                  NGO
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
