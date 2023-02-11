import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import {
  addSearchCollege,
  addSearchCompany,
  addSearchUniversity,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  removeSearchCollege,
  removeSearchCompany,
  removeSearchUniversity,
  setActiveFilter,
  setChangeFilterFlag,
  setConfirmiedSearch,
  setSearchedExpandedFilter,
  setSearchLocation,
  setSearchSkill,
  setSearchSor,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import CollegeFilter from '../filters/CollegeFilter';
import LocationFilter from '../filters/LocationFilter';
import SkillFilter from '../filters/SkillFilter';
import UniversityFilter from '../filters/UniversityFilter';
import WorkedCompanyFilter from '../filters/WorkedCompanyFilter';
import PeopleSort from '../sorts/PeopleSort';
import { ImageStyle, SearchBadgeStyle, StackStyle } from '../SharedStyled';

type Expanded = 'Location' | 'Skill' | 'Worked Company' | 'University' | 'College' | 'Sort';

export default function PeopleSidebar() {
  const expandedFilter = useSelector(getSearchedExpandedFilter);
  const dispatch = useDispatch();
  const activeSearched = useSelector(getSearchedValues);
  const confirmedSearch = useSelector(getConfirmSearch);

  const handleExpandedChange = (panel: Expanded | null) => {
    dispatch(setSearchedExpandedFilter(panel));
  };

  const searchedValue = useSelector(getSearchedValues);

  const applyFilter = () => {
    dispatch(setChangeFilterFlag())
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
      case 'Skill':
        return (
          <SkillFilter
            skillRemoved={(skill) => dispatch(setSearchSkill([...searchedValue.skills.filter((i) => i !== skill)]))}
            skillSelected={(skill) => dispatch(setSearchSkill([...searchedValue.skills, skill]))}
            selectedSkills={searchedValue.skills}
          />
        );

      case 'Worked Company':
        return (
          <WorkedCompanyFilter
            companyRemoved={(company) => dispatch(removeSearchCompany(company))}
            companySelected={(company) => dispatch(addSearchCompany(company))}
            selectedWorkedCompanies={searchedValue.companyWorkeds}
          />
        );
      case 'University':
        return (
          <UniversityFilter
            selecedUniversities={searchedValue.universities}
            universityRemoved={(university) => dispatch(removeSearchUniversity(university))}
            universitySelected={(university) => dispatch(addSearchUniversity(university))}
          />
        );

      case 'College':
        return (
          <CollegeFilter
            selectedColleges={searchedValue.colleges}
            collegeRemoved={(college) => dispatch(removeSearchCollege(college))}
            collegeSelected={(college) => dispatch(addSearchCollege(college))}
          />
        );

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
            <StackStyle onClick={() => handleExpandedChange('Skill')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.skills.length}>
                <Typography variant="body2" color="text.primary">
                  Skill
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('Worked Company')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.companyWorkeds.length}>
                <Typography variant="body2" color="text.primary">
                  Worked Company
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('University')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.universities.length}>
                <Typography variant="body2" color="text.primary">
                  University
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <StackStyle onClick={() => handleExpandedChange('College')}>
              <SearchBadgeStyle color="error" variant="dot" invisible={!confirmedSearch.colleges.length}>
                <Typography variant="body2" color="text.primary">
                  College
                </Typography>
              </SearchBadgeStyle>
              <ImageStyle src="/icons/right arrow/grey-arrow.svg" />
            </StackStyle>
            <Stack spacing={2} justifyContent="space-between" direction="row">
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
