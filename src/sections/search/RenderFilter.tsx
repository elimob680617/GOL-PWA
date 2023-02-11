import { FC } from 'react';
import PeopleFilter from './filters/PeopleFilter';
import FundraisingFilter from './Fundraising/FundraisingFilter';
import NgoFilter from './ngo/NgoFilter';
import PeopleSidebar from './people/PeopleSidebar';
import PostFilter from './post/PostFilter';
import { searchTabs } from './SearchMain';

const RenderFilter: FC<{ activeFilter: searchTabs }> = ({ activeFilter }) => {
  const searchedFilters = {
    Fundraising: <FundraisingFilter />,
    Ngo: <NgoFilter />,
    People: <PeopleSidebar />,
    Post: <PostFilter />,
  };

  const conditionalRendering = (type: searchTabs) => searchedFilters[type];

  return <>{conditionalRendering(activeFilter)}</>;
};

export default RenderFilter;
