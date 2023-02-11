import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIndustry } from 'src/@types/categories';
import { ICollege } from 'src/@types/education';
import { IExperirnce } from 'src/@types/experience';
import { IPlace } from 'src/@types/location';
import { ISearchedCampaignPost, ISearchedHashtag, ISearchedPost } from 'src/@types/post';
import { IRecentlySearch } from 'src/@types/search';
import { ConnectionStatusType, SearchCategoryEnumType } from 'src/@types/sections/serverTypes';
import { ISkil } from 'src/@types/skill';
import { ISearchedUser, ISearchNgoReponse, ISearchUserResponse } from 'src/@types/user';

// types
import { RootState } from 'src/redux/store';
import { Expanded } from 'src/sections/search/SearchFilter';
import { searchTabs } from 'src/sections/search/SearchMain';

// ----------------------------------------------------------------------

export interface ISearchedKeyWord {
  id?: any | null;
  keyword?: string | null;
}

export interface ISearch {
  searchedText: string;
  locations: IPlace[];
  skills: ISkil[];
  companyWorkeds: IExperirnce[];
  universities: ICollege[];
  colleges: ICollege[];
  peoples: ISearchedUser[];
  sortBy: string;
  companySize: string;
  postType: string;
  fundraisingType: string;
  fundraisingCategory: SearchCategoryEnumType[];
  industries: IIndustry[];
  mediaCreationTime: string;
  ngoSize: string[];
  ngos: ISearchNgoReponse[];
}

export const searchInitialState: ISearch = {
  searchedText: '',
  colleges: [],
  companyWorkeds: [],
  locations: [],
  skills: [],
  sortBy: '',
  universities: [],
  peoples: [],
  postType: '',
  fundraisingType: '',
  fundraisingCategory: [],
  industries: [],
  companySize: '',
  mediaCreationTime: '',
  ngoSize: [],
  ngos: [],
};

export interface ISearchStateProps {
  activeSearched: ISearch;
  confirimedSearched: ISearch;
  activeFilter: searchTabs | null;
  lastKeyWords: ISearchedKeyWord[];
  Post: any[];
  Fundraising: any[];
  People: any[];
  Ngo: any[];
  loading: boolean;
  count: number;
  Hashtags: any[];
  expandedFilter: Expanded | null;
  changeFilterFlag: number;
  recently: IRecentlySearch | null;
}

const initialState: ISearchStateProps = {
  activeSearched: searchInitialState,
  confirimedSearched: searchInitialState,
  activeFilter: null,
  Post: [],
  Fundraising: [],
  People: [],
  Ngo: [],
  loading: false,
  count: 0,
  Hashtags: [],
  lastKeyWords: [],
  expandedFilter: null,
  changeFilterFlag: 0,
  recently: null,
};

const slice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    valuingSearchValues(state, action: PayloadAction<ISearch>) {
      state.activeSearched.colleges = action.payload.colleges;
      state.activeSearched.companyWorkeds = action.payload.companyWorkeds;
      state.activeSearched.locations = action.payload.locations;
      state.activeSearched.searchedText = action.payload.searchedText;
      state.activeSearched.skills = action.payload.skills;
      state.activeSearched.sortBy = action.payload.sortBy;
      state.activeSearched.universities = action.payload.universities;
      state.activeSearched.peoples = action.payload.peoples;
      state.activeSearched.postType = action.payload.postType;
      state.activeSearched.fundraisingType = action.payload.fundraisingType;
      state.activeSearched.fundraisingCategory = action.payload.fundraisingCategory;
      state.activeSearched.industries = action.payload.industries;
      state.activeSearched.companySize = action.payload.companySize;
      state.activeSearched.mediaCreationTime = action.payload.mediaCreationTime;
      state.activeSearched.ngoSize = action.payload.ngoSize;
      state.activeSearched.ngos = action.payload.ngos;
    },
    setSearchLocation(state, action: PayloadAction<IPlace[]>) {
      state.activeSearched.locations = action.payload;
    },
    setSearchNgoFilter(state, action: PayloadAction<ISearchNgoReponse[]>) {
      state.activeSearched.ngos = action.payload;
    },
    setSearchSkill(state, action: PayloadAction<ISkil[]>) {
      state.activeSearched.skills = action.payload;
    },
    addSearchCollege(state, action: PayloadAction<ICollege>) {
      state.activeSearched.colleges = [...state.activeSearched.colleges, action.payload];
    },
    removeSearchCollege(state, action: PayloadAction<ICollege>) {
      state.activeSearched.colleges = [...state.activeSearched.colleges.filter((i) => i.id !== action.payload.id)];
    },
    addSearchUniversity(state, action: PayloadAction<ICollege>) {
      state.activeSearched.universities = [...state.activeSearched.universities, action.payload];
    },
    removeSearchUniversity(state, action: PayloadAction<ICollege>) {
      state.activeSearched.universities = [
        ...state.activeSearched.universities.filter((i) => i.id !== action.payload.id),
      ];
    },
    addSearchCompany(state, action: PayloadAction<IExperirnce>) {
      state.activeSearched.companyWorkeds = [...state.activeSearched.companyWorkeds, action.payload];
    },
    removeSearchCompany(state, action: PayloadAction<IExperirnce>) {
      state.activeSearched.companyWorkeds = [
        ...state.activeSearched.companyWorkeds.filter((i) => i.id !== action.payload.id),
      ];
    },
    addSearchPeople(state, action: PayloadAction<ISearchedUser>) {
      state.activeSearched.peoples = [...state.activeSearched.peoples, action.payload];
    },
    removeSearchPeople(state, action: PayloadAction<ISearchedUser>) {
      state.activeSearched.peoples = [...state.activeSearched.peoples.filter((i) => i.id !== action.payload.id)];
    },
    setSearchSor(state, action: PayloadAction<string>) {
      state.activeSearched.sortBy = action.payload;
    },
    setSearchPostType(state, action: PayloadAction<string>) {
      state.activeSearched.postType = action.payload;
    },
    setSearchFundraisingType(state, action: PayloadAction<string>) {
      state.activeSearched.fundraisingType = action.payload;
    },
    addFundraisingCategory(state, action: PayloadAction<SearchCategoryEnumType>) {
      state.activeSearched.fundraisingCategory = [...state.activeSearched.fundraisingCategory, action.payload];
    },
    removeFundraisingCategory(state, action: PayloadAction<SearchCategoryEnumType>) {
      state.activeSearched.fundraisingCategory = [
        ...state.activeSearched.fundraisingCategory.filter((i) => i !== action.payload),
      ];
    },
    addIndustry(state, action: PayloadAction<IIndustry>) {
      state.activeSearched.industries = [...state.activeSearched.industries, action.payload];
    },
    removeIndustry(state, action: PayloadAction<IIndustry>) {
      state.activeSearched.industries = [...state.activeSearched.industries.filter((i) => i.id !== action.payload.id)];
    },
    setSearchCompanySize(state, action: PayloadAction<string>) {
      state.activeSearched.companySize = action.payload;
    },
    setMediaCreationTime(state, action: PayloadAction<string>) {
      state.activeSearched.mediaCreationTime = action.payload;
    },
    setNgoSize(state, action: PayloadAction<string[]>) {
      state.activeSearched.ngoSize = action.payload;
    },
    setActiveFilter(state, action: PayloadAction<searchTabs>) {
      state.activeFilter = action.payload;
    },
    resetSearch(state) {
      state.activeSearched.colleges = initialState.activeSearched.colleges;
      state.activeSearched.companyWorkeds = initialState.activeSearched.companyWorkeds;
      state.activeSearched.locations = initialState.activeSearched.locations;
      // state.activeSearched.searchedText = initialState.activeSearched.searchedText;
      state.activeSearched.skills = initialState.activeSearched.skills;
      state.activeSearched.sortBy = initialState.activeSearched.sortBy;
      state.activeSearched.universities = initialState.activeSearched.universities;
      state.activeSearched.peoples = initialState.activeSearched.peoples;
      state.activeSearched.postType = initialState.activeSearched.postType;
      state.activeSearched.fundraisingType = initialState.activeSearched.fundraisingType;
      state.activeSearched.fundraisingCategory = initialState.activeSearched.fundraisingCategory;
      state.activeSearched.industries = initialState.activeSearched.industries;
      state.activeSearched.companySize = initialState.activeSearched.companySize;
      state.activeSearched.mediaCreationTime = initialState.activeSearched.mediaCreationTime;
      state.activeSearched.ngoSize = initialState.activeSearched.ngoSize;
      state.activeSearched.ngos = initialState.activeSearched.ngos;
    },
    setSearchedText(state, action: PayloadAction<string>) {
      state.confirimedSearched.searchedText = action.payload;
      state.activeSearched.searchedText = action.payload;
    },
    resetConfirmedSearch(state) {
      state.confirimedSearched.colleges = initialState.confirimedSearched.colleges;
      state.confirimedSearched.companyWorkeds = initialState.confirimedSearched.companyWorkeds;
      state.confirimedSearched.locations = initialState.confirimedSearched.locations;
      // state.confirimedSearched.searchedText = initialState.confirimedSearched.searchedText;
      state.confirimedSearched.skills = initialState.confirimedSearched.skills;
      state.confirimedSearched.sortBy = initialState.confirimedSearched.sortBy;
      state.confirimedSearched.universities = initialState.confirimedSearched.universities;
      state.confirimedSearched.peoples = initialState.confirimedSearched.peoples;
      state.confirimedSearched.postType = initialState.confirimedSearched.postType;
      state.confirimedSearched.fundraisingType = initialState.confirimedSearched.fundraisingType;
      state.confirimedSearched.fundraisingCategory = initialState.confirimedSearched.fundraisingCategory;
      state.confirimedSearched.industries = initialState.confirimedSearched.industries;
      state.confirimedSearched.companySize = initialState.confirimedSearched.companySize;
      state.confirimedSearched.mediaCreationTime = initialState.confirimedSearched.mediaCreationTime;
      state.confirimedSearched.ngoSize = initialState.confirimedSearched.ngoSize;
      state.confirimedSearched.ngos = initialState.confirimedSearched.ngos;
    },
    setConfirmiedSearch(state, action: PayloadAction<ISearch>) {
      state.confirimedSearched.colleges = action.payload.colleges;
      state.confirimedSearched.companyWorkeds = action.payload.companyWorkeds;
      state.confirimedSearched.locations = action.payload.locations;
      state.confirimedSearched.searchedText = action.payload.searchedText;
      state.confirimedSearched.skills = action.payload.skills;
      state.confirimedSearched.sortBy = action.payload.sortBy;
      state.confirimedSearched.universities = action.payload.universities;
      state.confirimedSearched.peoples = action.payload.peoples;
      state.confirimedSearched.postType = action.payload.postType;
      state.confirimedSearched.fundraisingType = action.payload.fundraisingType;
      state.confirimedSearched.fundraisingCategory = action.payload.fundraisingCategory;
      state.confirimedSearched.industries = action.payload.industries;
      state.confirimedSearched.companySize = action.payload.companySize;
      state.confirimedSearched.mediaCreationTime = action.payload.mediaCreationTime;
      state.confirimedSearched.ngoSize = action.payload.ngoSize;
      state.confirimedSearched.ngos = action.payload.ngos;
    },
    valuingAllSearchedKeyWord(state, action: PayloadAction<ISearchedKeyWord[]>) {
      state.lastKeyWords = action.payload;
    },
    addKeyWord(state, action: PayloadAction<ISearchedKeyWord>) {
      state.lastKeyWords = [action.payload, ...state.lastKeyWords];
    },
    removeKeyWord(state, action: PayloadAction<string>) {
      state.lastKeyWords = [...state.lastKeyWords.filter((i) => i.id !== action.payload)];
    },
    setValues(state, action: PayloadAction<{ searchTab: searchTabs; data: any[] }>) {
      state[action.payload.searchTab] = action.payload.data;
    },
    updateValues(state, action: PayloadAction<{ searchTab: searchTabs; data: any[] }>) {
      state[action.payload.searchTab] = [...state[action.payload.searchTab], ...action.payload.data];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    resetAllSearched(state) {
      state.count = 0;
      state.loading = false;
      state.Fundraising = [];
      state.Hashtags = [];
      state.Ngo = [];
      state.People = [];
      state.Post = [];
    },
    setSearchedExpandedFilter(state, action: PayloadAction<Expanded | null>) {
      state.expandedFilter = action.payload;
    },
    setChangeFilterFlag(state) {
      state.changeFilterFlag = state.changeFilterFlag + 1;
    },
    setRecently(state, action: PayloadAction<IRecentlySearch>) {
      state.recently = action.payload;
    },
  },
});

export const getSearchedValues = (state: RootState) => <ISearch>state.searchSlice.activeSearched;
export const getActiveFilter = (state: RootState) => <searchTabs>state.searchSlice.activeFilter;
export const getConfirmSearch = (state: RootState) => <ISearch>state.searchSlice.confirimedSearched;
export const getSearchedLastKeyWords = (state: RootState) => <ISearchedKeyWord[]>state.searchSlice.lastKeyWords;
export const getSearchedSocialPosts = (state: RootState) => <any[]>state.searchSlice.Post;
export const getSearchLoading = (state: RootState) => <boolean>state.searchSlice.loading;
export const getSearchCount = (state: RootState) => <number>state.searchSlice.count;
export const getSearchedHashtags = (state: RootState) => <any[]>state.searchSlice.Hashtags;
export const getSearchedNgo = (state: RootState) => <any[]>state.searchSlice.Ngo;
export const getSearchedPeople = (state: RootState) => <any[]>state.searchSlice.People;
export const getSearchedCampaginPost = (state: RootState) => <any[]>state.searchSlice.Fundraising;
export const getSearchedExpandedFilter = (state: RootState) => <Expanded>state.searchSlice.expandedFilter;
export const getChangeFilterFlag = (state: RootState) => <number>state.searchSlice.changeFilterFlag;
export const getRecently = (state: RootState) => <IRecentlySearch|null>state.searchSlice.recently;

// Reducer
export default slice.reducer;

// Actions
export const {
  resetSearch,
  valuingSearchValues,
  setSearchLocation,
  setSearchSkill,
  addSearchCollege,
  removeSearchCollege,
  addSearchUniversity,
  removeSearchUniversity,
  addSearchCompany,
  removeSearchCompany,
  setSearchSor,
  addSearchPeople,
  removeSearchPeople,
  setSearchPostType,
  setSearchFundraisingType,
  addFundraisingCategory,
  removeFundraisingCategory,
  addIndustry,
  removeIndustry,
  setSearchCompanySize,
  setMediaCreationTime,
  setActiveFilter,
  setConfirmiedSearch,
  resetConfirmedSearch,
  setSearchedText,
  resetAllSearched,
  setCount,
  setLoading,
  setNgoSize,
  setSearchNgoFilter,
  setValues,
  updateValues,
  addKeyWord,
  removeKeyWord,
  valuingAllSearchedKeyWord,
  setSearchedExpandedFilter,
  setChangeFilterFlag,
  setRecently,
} = slice.actions;
