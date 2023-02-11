import { Box, IconButton, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { HorizanWrapper } from './history/History';
import Image from 'next/image';
import { useDispatch, useSelector } from 'src/redux/store';
import { getSearchedValues, setActiveFilter } from 'src/redux/slices/search';
import Link from 'next/link';
import { PATH_APP } from 'src/routes/paths';
import { useRouter } from 'next/router';
import { searchTabs } from './SearchMain';
import { Icon } from 'src/components/Icon';

const ItemStyle = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  marginRight: `${theme.spacing(3)}!important`,
  '&:last-child': {
    marginRight: '0!important',
  },
}));

const ItemButtonStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.neutral,
  width: 'fit-content',
  borderRadius: 1,
}));

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0),
}));

const SearchItemsLayout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const searchedText = useSelector(getSearchedValues).searchedText;
  const setFilter = (tabname: searchTabs) => {
    dispatch(setActiveFilter(tabname));
  };
  const { asPath } = useRouter();

  const isActive = (path: string) => path === asPath.split('/?')[0];

  const convertSearchedText = () => ({ search: JSON.stringify({ searchedText }) });

  return (
    <Stack sx={{ height: '100%' }} spacing={0.5}>
      <HorizanWrapper sx={{ bgcolor: 'common.white', p: 2 }}>
        <ItemStyle className="item">
          <ItemButtonStyle
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ p: 1, bgcolor: 'background.neutral', width: 'fit-content', borderRadius: 1 }}
          >
            <Typography noWrap variant="subtitle1" color="text.secondary">
              <Link href={PATH_APP.search.all}>All</Link>
            </Typography>
          </ItemButtonStyle>
        </ItemStyle>

        <ItemStyle className="item">
          <ItemButtonStyle
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ p: 1, bgcolor: 'background.neutral', width: 'fit-content', borderRadius: 1 }}
          >
            <Typography noWrap variant="subtitle1" color="text.secondary">
              <Link href={{ pathname: PATH_APP.search.people, query: convertSearchedText() }}>People</Link>
            </Typography>
            {isActive(PATH_APP.search.people) && (
              <IconButtonStyle onClick={() => setFilter('People')} color="primary">
                <Icon name="Filters" />
              </IconButtonStyle>
            )}
          </ItemButtonStyle>
        </ItemStyle>

        <ItemStyle className="item">
          <ItemButtonStyle
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ p: 1, bgcolor: 'background.neutral', width: 'fit-content', borderRadius: 1 }}
          >
            <Typography noWrap variant="subtitle1" color="text.secondary">
              <Link href={{ pathname: PATH_APP.search.ngo, query: convertSearchedText() }}>NGOs</Link>
            </Typography>
            {isActive(PATH_APP.search.ngo) && (
              <IconButtonStyle onClick={() => setFilter('Ngo')} color="primary">
                <Icon name="Filters" />
              </IconButtonStyle>
            )}
          </ItemButtonStyle>
        </ItemStyle>
        <ItemStyle className="item">
          <ItemButtonStyle
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ p: 1, bgcolor: 'background.neutral', width: 'fit-content', borderRadius: 1 }}
          >
            <Typography noWrap variant="subtitle1" color="text.secondary">
              <Link href={{ pathname: PATH_APP.search.post, query: convertSearchedText() }}>Posts</Link>
            </Typography>
            {isActive(PATH_APP.search.post) && (
              <IconButtonStyle onClick={() => setFilter('Post')} color="primary">
                <Icon name="Filters" />
              </IconButtonStyle>
            )}
          </ItemButtonStyle>
        </ItemStyle>
        <ItemStyle className="item">
          <ItemButtonStyle
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ p: 1, bgcolor: 'background.neutral', width: 'fit-content', borderRadius: 1 }}
          >
            <Typography noWrap variant="subtitle1" color="text.secondary">
              <Link href={{ pathname: PATH_APP.search.fundraising, query: convertSearchedText() }}>Fund Raising</Link>
            </Typography>
            {isActive(PATH_APP.search.fundraising) && (
              <IconButtonStyle onClick={() => setFilter('Fundraising')} color="primary">
                <Icon name="Filters" />
              </IconButtonStyle>
            )}
          </ItemButtonStyle>
        </ItemStyle>
        <ItemStyle className="item">
          <ItemButtonStyle
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ p: 1, bgcolor: 'background.neutral', width: 'fit-content', borderRadius: 1 }}
          >
            <Typography noWrap variant="subtitle1" color="text.secondary">
              <Link href={{ pathname: PATH_APP.search.hashtag, query: { searchedText } }}>Hashtags</Link>
            </Typography>
          </ItemButtonStyle>
        </ItemStyle>
      </HorizanWrapper>
      <Stack id="scrollableDiv" sx={{ height: 'calc(100% - 137px)', overflow: 'auto', bgcolor: 'common.white' }}>
        {children}
      </Stack>
    </Stack>
  );
};

export default SearchItemsLayout;
