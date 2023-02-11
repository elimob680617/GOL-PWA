import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import {
  addIndustry,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeIndustry,
  setChangeFilterFlag,
  setNgoSize,
  setSearchedExpandedFilter,
  setSearchLocation,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import LocationFilter from '../filters/LocationFilter';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';
import IndustryFilter from '../filters/IndustryFilter';
import NgoSize from '../filters/NgoSize';
import { Expanded } from '../SearchFilter';

export default function NgoFilter() {
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
      case 'Location':
        return (
          <LocationFilter
            locationSelected={(place) => dispatch(setSearchLocation([...searchedValue.locations, place]))}
            locationRemoved={(place) =>
              dispatch(setSearchLocation([...searchedValue.locations.filter((i) => i !== place)]))
            }
            selectedLocations={searchedValue.locations}
          />
        );
      case 'Industry':
        return (
          <IndustryFilter
            selectedIndustries={searchedValue.industries}
            industrySelected={(industry) => dispatch(addIndustry(industry))}
            industryRemoved={(industry) => dispatch(removeIndustry(industry))}
          />
        );
      case 'NGO Size':
        return <NgoSize sizeChanged={(size) => dispatch(setNgoSize(size))} ngoSize={searchedValue.ngoSize} />;

      default:
        return (
          <>
            <StackStyle onClick={() => handleExpandedChange('Location')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.locations.length}>
                <Typography variant="body2" color="text.primary">
                  Location
                </Typography>
              </SearchBadgeStyle>

              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('Industry')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.industries.length}>
                <Typography variant="body2" color="text.primary">
                  Industry
                </Typography>
              </SearchBadgeStyle>

              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>

            <StackStyle onClick={() => handleExpandedChange('NGO Size')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.ngoSize.length}>
                <Typography variant="body2" color="text.primary">
                  NGO Size
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
