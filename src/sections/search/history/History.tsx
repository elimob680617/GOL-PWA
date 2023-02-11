import { Avatar, Box, Button, IconButton, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Image from 'next/image';
import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';
import { bottomNavbar } from 'src/config';
import { getRecently, getSearchedLastKeyWords, ISearchedKeyWord } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import RowRecently from '../recenties/RowRecently';
import { FilterByEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';

export const SubtitleStyleStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const HorizanWrapper = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  whiteSpace: 'nowrap',
  '& .item': {
    display: 'inline-block',
    marginRight: theme.spacing(1),
    '&:last-child': {
      marginRight: 0,
    },
  },
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

interface IExploreStyleProps {
  background: string;
}

const ExploreStyle = styled(Box)<IExploreStyleProps>(({ theme, background }) => ({
  height: 100,
  width: 100,
  background: `url(${background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  borderRadius: theme.spacing(1),
}));

const ClickableStyle = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
}));

const History: FC<{
  keyWordChoosed: (keyWord: ISearchedKeyWord) => void;
  keyWordRemoved: (keyWord: ISearchedKeyWord) => void;
}> = ({ keyWordChoosed, keyWordRemoved }) => {
  const keyWords = useSelector(getSearchedLastKeyWords);

  return (
    <>
      <Stack sx={{ height: `calc(100% - ${bottomNavbar.height}px)`, overflowY: 'auto' }} spacing={0.5}>
        <Stack sx={{ p: 2 }} spacing={2}>
          <SubtitleStyleStyle variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Keywords
          </SubtitleStyleStyle>
          <HorizanWrapper>
            {keyWords.map((keyWord, index) => (
              <Box key={keyWord.id} className="item">
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ p: 1, bgcolor: 'background.neutral', width: 'fit-content', borderRadius: 1, maxWidth: 148 }}
                >
                  <ClickableStyle onClick={() => keyWordChoosed(keyWord)}>
                    <Icon name="clock, History" color="grey.500" type="linear" />
                  </ClickableStyle>
                  <ClickableStyle sx={{ overflow: 'hidden' }} onClick={() => keyWordChoosed(keyWord)}>
                    <Typography noWrap variant="body2" color="text.primary">
                      {keyWord.keyword}
                    </Typography>
                  </ClickableStyle>

                  <IconButton onClick={() => keyWordRemoved(keyWord)}>
                    <Icon name="Close" size={20} />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </HorizanWrapper>
        </Stack>
      </Stack>
      <Box sx={{ marginTop: '0!important' }}>
        <MainBottomNavigationBar />
      </Box>
    </>
  );
};

export default History;
