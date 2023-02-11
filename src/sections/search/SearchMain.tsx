import { Box, Stack, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
//...................................................................
import React, { useState, useEffect } from 'react';
import {
  getConfirmSearch,
  ISearch,
  resetAllSearched,
  resetSearch,
  searchInitialState,
  setSearchedText,
  setConfirmiedSearch,
  getChangeFilterFlag,
  setChangeFilterFlag,
  addKeyWord,
  removeKeyWord,
  ISearchedKeyWord,
  getSearchedLastKeyWords,
  valuingAllSearchedKeyWord,
  getRecently,
  setRecently,
} from 'src/redux/slices/search';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import Image from 'next/image';
import { bottomNavbar, localStorageKeys } from 'src/config';
import SearchBody from './SearchBody';
import { ISkil } from 'src/@types/skill';
import { ISearchedUser, ISearchNgoReponse } from 'src/@types/user';
import { IPlace } from 'src/@types/location';
import { IIndustry } from 'src/@types/categories';
import { ICollege } from 'src/@types/education';
import { IExperirnce } from 'src/@types/experience';
import { SearchCategoryEnumType } from 'src/@types/sections/serverTypes';
import useSearch from './useSearch';
import SearchFilter from './SearchFilter';
import History from './history/History';

import { useLazyGetLastKeyWordQuery } from 'src/_requests/graphql/search/queries/getLastKeyword.generated';
import { useRemoveKeyWordMutation } from 'src/_requests/graphql/search/mutations/removeKeyWord.generated';
import { useAddKeyWordMutation } from 'src/_requests/graphql/search/mutations/addKeyWord.generated';
import { IRecentlySearch } from 'src/@types/search';
import { useLazyGetRecentlyQuery } from 'src/_requests/graphql/search/queries/getRecently.generated';
import { Icon } from 'src/components/Icon';

export type searchTabs = 'All' | 'People' | 'Ngo' | 'Post' | 'Fundraising' | 'Hashtags';

function SearchMain() {
  const { query, push, replace, asPath } = useRouter();
  const dispatch = useDispatch();
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const confirmedSearch = useSelector(getConfirmSearch);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [canSendRequest, setCanSendRequest] = useState<boolean>(false);
  const [searchedValueText, setSearchedValueText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<searchTabs | null>(null);
  const changeFilterFlag = useSelector(getChangeFilterFlag);
  const [getLastKeyWordQuery, { data: keyWordsResponse }] = useLazyGetLastKeyWordQuery();
  const [getRecentlyRequest] = useLazyGetRecentlyQuery();
  const [removeKeyWordMutation] = useRemoveKeyWordMutation();
  const [addKeyWordMutation] = useAddKeyWordMutation();
  const keyWords = useSelector(getSearchedLastKeyWords);
  const recentlies = useSelector(getRecently);

  useSearch(query && query.index ? (query.index[0] as searchTabs) : null, pageIndex, changeFilterFlag, canSendRequest);

  const nextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  useEffect(() => {
    if (query.index && query.index[0]) {
      setPageIndex(1);
    }
  }, [query.index]);

  useEffect(() => {
    if (confirmedSearch.searchedText) {
      setSearchedValueText(confirmedSearch.searchedText);
    }
  }, [confirmedSearch.searchedText]);

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
      return;
    }
    dispatch(resetSearch());
  }, [query.index]);

  useEffect(() => {
    if (changeFilterFlag && !firstTime) {
      setPageIndex(1);
      dispatch(resetAllSearched());
      localStorage.setItem(localStorageKeys.search, JSON.stringify(confirmedSearch));
      let searchQuery = '';
      if (query?.index && query.index[0]) {
        searchQuery = query.index[0];
      }
      replace(
        { pathname: `${PATH_APP.search.root}/${searchQuery}`, query: { search: JSON.stringify(valuingQuery()) } },
        undefined,
        {
          shallow: true,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeFilterFlag]);

  useEffect(() => {
    if (!firstTime) {
      dispatch(setChangeFilterFlag());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedSearch.searchedText]);

  useEffect(() => {
    if (query.search) {
      const searchObject = { ...searchInitialState };
      const search = JSON.parse(query.search as string);
      if (!localStorage.getItem(localStorageKeys.search)) return;
      const searchLocalStageValue = JSON.parse(localStorage.getItem(localStorageKeys.search)!) as ISearch;
      if (search.colleges) {
        const colleges = searchLocalStageValue.colleges.filter((college) =>
          search.colleges.some((i) => i === college.id)
        );
        searchObject.colleges = colleges as ICollege[];
      }
      if (search.peoples) {
        const peoples = searchLocalStageValue.peoples.filter((people) => search.peoples.some((i) => i === people.id));
        searchObject.peoples = peoples as ISearchedUser[];
      }
      if (search.companyWorkeds) {
        const companies = searchLocalStageValue.companyWorkeds.filter((company) =>
          search.companyWorkeds.some((i) => i === company.id)
        );
        searchObject.companyWorkeds = companies as IExperirnce[];
      }
      if (search.industries) {
        const industries = searchLocalStageValue.industries.filter((industry) =>
          search.industries.some((i) => i === industry.id)
        );
        searchObject.industries = industries as IIndustry[];
      }
      if (search.fundraisingCategory) {
        const fundraisingCategory = searchLocalStageValue.fundraisingCategory.filter((category) =>
          search.fundraisingCategory.some((i) => i === category)
        );
        searchObject.fundraisingCategory = fundraisingCategory as SearchCategoryEnumType[];
      }
      if (search.companySize) {
        searchObject.companySize = search.companySize;
      }
      if (search.ngoSize) {
        searchObject.ngoSize = search.ngoSize;
      }
      if (search.ngos) {
        const ngos = searchLocalStageValue.ngos.filter((ngo) => search.ngos.some((i) => i === ngo.id!));
        searchObject.ngos = ngos as ISearchNgoReponse[];
      }
      if (search.mediaCreationTime) {
        searchObject.mediaCreationTime = search.mediaCreationTime;
      }
      if (search.locations) {
        const locations = searchLocalStageValue.locations.filter((location) =>
          search.locations.some((i) => i === location.id)
        );
        searchObject.locations = locations as IPlace[];
      }
      if (search.postType) {
        searchObject.postType = search.postType;
      }
      if (search.skills) {
        const skills = searchLocalStageValue.skills.filter((skill) => search.skills.some((i) => i === skill.id));
        searchObject.skills = skills as ISkil[];
      }
      if (search.universities) {
        const universities = searchLocalStageValue.universities.filter((university) =>
          search.universities.some((i) => i === university.id)
        );
        searchObject.universities = universities as ICollege[];
      }
      if (search.fundraisingType) {
        searchObject.fundraisingType = search.fundraisingType;
      }
      if (search.sortBy) {
        searchObject.sortBy = search.sortBy;
      }
      if (search.skills) {
        const skills = searchLocalStageValue.skills.filter((skill) => search.skills.some((i) => i === skill.id));
        searchObject.skills = skills as ISkil[];
      }
      if (search.searchedText) {
        searchObject.searchedText = search.searchedText;
      }
      dispatch(setConfirmiedSearch(searchObject));
      setTimeout(() => {
        setCanSendRequest(true);
      }, 10);
    } else {
      setCanSendRequest(true);
    }
  }, []);

  useEffect(() => {
    if (keyWords.length === 0) {
      getLastKeyWordQuery({ filter: { pageIndex: 0, pageSize: 5 } })
        .unwrap()
        .then((res) => {
          if (res?.lastKeywordQueryHandler?.listDto?.items) {
            dispatch(valuingAllSearchedKeyWord(res!.lastKeywordQueryHandler!.listDto!.items as ISearchedKeyWord[]));
          }
        })
        .catch((err) => {});
    }
    if (!recentlies) {
      getRecentlyRequest({ filter: { pageIndex: 0, pageSize: 5 } })
        .unwrap()
        .then((res) => {
          if (res?.lastSeenQueryHandler?.listDto?.items?.[0]) {
            const recentlySearchRes: IRecentlySearch = {
              fundRaisingPosts: res.lastSeenQueryHandler.listDto.items[0].fundRaisingPosts,
              hashtags: res.lastSeenQueryHandler.listDto.items[0].hashtags,
              ngos: res.lastSeenQueryHandler.listDto.items[0].ngos,
              people: res.lastSeenQueryHandler.listDto.items[0].people,
              posts: res.lastSeenQueryHandler.listDto.items[0].posts,
            };

            dispatch(setRecently(recentlySearchRes));
          }
        });
    }
  }, []);

  const checkList = (list: any[]) => (list.length > 0 ? true : false);

  const valuingQuery = () => {
    const retuerned: any = {};
    if (checkList(confirmedSearch.universities)) {
      retuerned.universities = confirmedSearch.universities.map((i) => i.id);
    }
    if (checkList(confirmedSearch.skills)) {
      retuerned.skills = confirmedSearch.skills.map((i) => i.id);
    }
    if (checkList(confirmedSearch.peoples)) {
      retuerned.peoples = confirmedSearch.peoples.map((i) => i.id);
    }
    if (checkList(confirmedSearch.ngoSize)) {
      retuerned.ngoSize = confirmedSearch.ngoSize;
    }
    if (checkList(confirmedSearch.ngos)) {
      retuerned.ngos = confirmedSearch.ngos.map((i) => i.id);
    }
    if (checkList(confirmedSearch.colleges)) {
      retuerned.colleges = confirmedSearch.colleges.map((i) => i.id);
    }
    if (checkList(confirmedSearch.industries)) {
      retuerned.industries = confirmedSearch.industries.map((i) => i.id);
    }
    if (confirmedSearch.mediaCreationTime) {
      retuerned.mediaCreationTime = confirmedSearch.mediaCreationTime;
    }
    if (confirmedSearch.companySize) {
      retuerned.companySize = confirmedSearch.companySize;
    }
    if (checkList(confirmedSearch.companyWorkeds)) {
      retuerned.companyWorkeds = confirmedSearch.companyWorkeds.map((i) => i.id);
    }
    if (checkList(confirmedSearch.locations)) {
      retuerned.locations = confirmedSearch.locations.map((i) => i.id);
    }
    if (checkList(confirmedSearch.fundraisingCategory)) {
      retuerned.fundraisingCategory = confirmedSearch.fundraisingCategory;
    }
    if (checkList(confirmedSearch.ngos)) {
      retuerned.ngos = confirmedSearch.ngos;
    }
    if (confirmedSearch.fundraisingType) {
      retuerned.fundraisingType = confirmedSearch.fundraisingType;
    }
    if (confirmedSearch.postType) {
      retuerned.postType = confirmedSearch.postType;
    }
    if (confirmedSearch.sortBy) {
      retuerned.sortBy = confirmedSearch.sortBy;
    }
    if (confirmedSearch.searchedText) {
      retuerned.searchedText = confirmedSearch.searchedText;
    }
    return retuerned;
  };

  const handleSearchedText = (keyword?: string) => {
    const value = keyword || searchedValueText;
    if (!query?.index?.[0]) {
      push(PATH_APP.search.all);
    }
    dispatch(setSearchedText(value));
    if (searchedValueText)
      addKeyWordMutation({ keyWord: { dto: { keyword: value } } })
        .unwrap()
        .then((res) => {
          if (res?.keywordCommandHandler?.listDto?.items) {
            if (keyWords.find((i) => i!.keyword!.trim() === value.trim())) {
              return;
            }
            dispatch(addKeyWord(res!.keywordCommandHandler!.listDto!.items[0]!));
          }
        })
        .catch((err) => {});
  };

  useEffect(() => {
    if (query?.index?.[0]) {
      setActiveTab(query?.index?.[0] as searchTabs);
    }
  }, [query.index]);

  const tabChanged = (tabname: searchTabs) => {
    setCanSendRequest(false);
    setTimeout(() => {
      setCanSendRequest(true);
    }, 50);
    dispatch(resetSearch());
    dispatch(resetAllSearched());

    replace(
      { pathname: `${PATH_APP.search.root}/${query!.index![0]}`, query: { search: JSON.stringify(valuingQuery()) } },
      undefined,
      {
        shallow: true,
      }
    );
  };

  useEffect(() => {
    if (activeTab) tabChanged(activeTab);
  }, [activeTab]);

  const removeKeyWordHandler = (keyWord: ISearchedKeyWord) => {
    dispatch(removeKeyWord(keyWord!.id!));
    removeKeyWordMutation({ filter: { dto: { id: keyWord.id } } })
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        dispatch(addKeyWord(keyWord));
      });
  };

  return (
    <Stack spacing={0.5} sx={{ height: '100%', overflow: 'hidden', bgcolor: 'common.white' }}>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1, bgcolor: 'common.white' }}
      >
        <TextField
          size="small"
          sx={{ flex: 1 }}
          value={searchedValueText}
          onChange={(e) => setSearchedValueText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchedText();
            }
          }}
          id="text-search"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => handleSearchedText()}>
                  <Icon name="Research" type="solid" size={24} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        {query?.index && (
          <Button onClick={() => push(PATH_APP.home.index)} variant="text" sx={{ color: 'grey.900' }}>
            Cancel
          </Button>
        )}
      </Stack>
      <>
        {query.index && <SearchBody nextPage={nextPage} searchType={query.index[0] as searchTabs} />}
        {!query.index && (
          <History
            keyWordRemoved={removeKeyWordHandler}
            keyWordChoosed={(keyWord) => handleSearchedText(keyWord.keyword)}
          />
        )}
      </>
      <SearchFilter />
    </Stack>
  );
}

export default SearchMain;
