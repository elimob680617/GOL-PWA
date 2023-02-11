import { Avatar, Box, InputAdornment, Stack, TextField, Typography, useTheme } from '@mui/material';
import { Note } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import { PATH_HELP } from 'src/routes/paths';
import debounceFn from 'src/utils/debounce';
import { useLazyGetHelpArticlesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpArticlesQuery.generated';
import { useGetPopularHelpQueryQuery } from 'src/_requests/graphql/upload/queries/getPopularHelpQuery.generated';
import HelpFooter from './HelpFooter';

export default function HelpSearch(props) {
  const [searchBarData, setSearchBarData] = useState('');
  const { closeHelpCenter } = props;
  const theme = useTheme();
  const router = useRouter();
  // services !
  const [getHelpArticle, { data: articleData }] = useLazyGetHelpArticlesQueryQuery();
  const { data: popularArticleData, isLoading } = useGetPopularHelpQueryQuery({
    filter: { slug: 'en-US' },
  });

  const articleContents = articleData?.getHelpArticlesQuery?.listDto?.items;
  const popularArticles = popularArticleData?.getPopularHelpQuery?.listDto?.items;

  // useEffect for search article
  useEffect(() => {
    debounceFn(() => {
      getHelpArticle({
        filter: {
          ids: [],
          slug: 'en-US',
          pageSize: 1,
          pageIndex: 0,
          dto: { searchTerm: searchBarData },
        },
      });
    });
  }, [searchBarData]);

  // jsx----
  return (
    <Stack sx={{ px: 2, mb: 10.5, pt: 3, minHeight: 'calc(100vh - 386px)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, gap: 1 }}>
        <TextField
          onChange={(e) => setSearchBarData(e.target.value)}
          size="small"
          name="search"
          type="text"
          fullWidth
          autoFocus={true}
          inputProps={{ maxLength: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon name="Research" type="solid" color="grey.500" />
              </InputAdornment>
            ),
          }}
        />
        <Box onClick={() => closeHelpCenter()}>
          <Typography variant="button" color="grey.900">
            Cancel
          </Typography>
        </Box>
      </Stack>
      {!!searchBarData ? (
        <Stack>
          <Stack spacing={3}>
            {articleContents?.map((item) => (
              <Stack key={item.id} spacing={1} direction="row" justifyContent="start" alignItems="center">
                <Avatar alt="Profile Picture" sx={{ backgroundColor: 'background.neutral' }}>
                  <Note color={theme.palette.grey[700]} variant="Outline" />
                </Avatar>
                <Typography variant="body2" color="text.primary">
                  {item.title}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={3}>
          <Typography variant="subtitle2" color="text.primary">
            Papular Articles
          </Typography>
          {popularArticles?.map((item) => (
            <Stack
              key={item?.id}
              spacing={1}
              direction="row"
              justifyContent="start"
              alignItems="center"
              onClick={() => router.push(PATH_HELP.articles + `/${item?.id}`)}
            >
              <Avatar alt="Profile Picture" sx={{ backgroundColor: 'background.neutral' }}>
                <Note color={theme.palette.grey[700]} variant="Outline" />
              </Avatar>
              <Typography variant="body2" color="text.primary">
                {item.title}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
