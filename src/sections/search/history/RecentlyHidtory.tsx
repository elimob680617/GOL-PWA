import { Stack } from '@mui/material';
import { FC } from 'react';
import { FilterByEnum } from 'src/@types/sections/serverTypes';
import { getRecently } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import RowRecently from '../recenties/RowRecently';
import { SubtitleStyleStyle } from './History';

const RecentlyHidtory: FC = () => {
  const recentlies = useSelector(getRecently);

  return (
    <Stack sx={{ p: 2 }} spacing={2}>
      <SubtitleStyleStyle variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Recently
      </SubtitleStyleStyle>

      {/* {
            recentlies.fundRaisingPosts.map(post=>)
          } */}

      {recentlies &&
        recentlies.hashtags &&
        recentlies.hashtags.map((hashtag) => (
          <RowRecently avatar="" name={hashtag.title} varient={FilterByEnum.Hashtag} key={hashtag.itemId} />
        ))}

      {recentlies &&
        recentlies.ngos &&
        recentlies.ngos.map((ngo) => (
          <RowRecently avatar="" name={ngo.fullName} varient={FilterByEnum.Ngo} key={ngo.itemId} />
        ))}

      {recentlies &&
        recentlies.people &&
        recentlies.people.map((people) => (
          <RowRecently
            avatar={people.avatarUrl}
            name={people.fullName}
            varient={FilterByEnum.Hashtag}
            key={people.itemId}
          />
        ))}

      {/* {recentlies.posts.map((post) => (
            <RowRecently
              avatar={people.avatarUrl}
              name={people.fullName}
              varient={FilterByEnum.Hashtag}
              key={people.itemId}
            />
          ))} */}
    </Stack>
  );
};

export default RecentlyHidtory;
