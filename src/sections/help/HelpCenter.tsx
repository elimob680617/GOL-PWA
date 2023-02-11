import { Avatar, Box, Divider, Grid, InputAdornment, Stack, TextField, Typography, useTheme } from '@mui/material';
import { Note } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import iconProfileWizard from 'public/icons/wizard/wizard-profile-icon.png';
import gardenOfLoveLogo from 'public/logo/logo.png';
import { useEffect, useMemo, useState } from 'react';
import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';
import { PATH_HELP } from 'src/routes/paths';
import { useLazyGetHelpCategoriesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpCategoriesQuery.generated';
import { useLazyGetPopularHelpQueryQuery } from 'src/_requests/graphql/upload/queries/getPopularHelpQuery.generated';
import HelpFooter from './HelpFooter';
import HelpSearch from './HelpSearch';

export default function HelpCenter() {
  // tools !
  const router = useRouter();
  const theme = useTheme();
  // useState
  const [searchArticles, setSearchArticles] = useState(false);

  // services !!
  // query !
  const [getHelpCategoriesQuery, { data: categoryData, isFetching }] = useLazyGetHelpCategoriesQueryQuery();
  const [getHelpPopularArticle, { data: popularArticleData }] = useLazyGetPopularHelpQueryQuery();

  useEffect(() => {
    getHelpPopularArticle({
      filter: { slug: 'en-US' },
    });

    getHelpCategoriesQuery({
      filter: {
        dto: {},
      },
    });
  }, []);
  const helpCategoriesData = categoryData?.getHelpCategoriesQuery?.listDto?.items;
  const popularArticles = popularArticleData?.getPopularHelpQuery?.listDto?.items;
  // ------------------make tree for date
  const helpCategories = useMemo(() => {
    const parentCategories = helpCategoriesData?.filter((c) => c?.parentId === null);
    const result = parentCategories?.map((parent) => ({
      ...parent,
      subCategory: helpCategoriesData?.filter((category) => category?.parentId === parent?.id),
    }));
    return result;
  }, [helpCategoriesData]);

  // -------------

  // local storage !!
  function handleCategory(categoryItems) {
    localStorage.setItem('categoryItems', JSON.stringify(categoryItems));
    router.push(PATH_HELP.category);
  }

  //   ----------------start project design-----------------------
  return (
    <Box>
      <Stack sx={{ mb: 2, px: 2, pt: 3, gap: 2, position: 'sticky' }} direction="row" alignItems="center">
        <Logo />
        <Typography variant="subtitle1" color="text.primary">
          Help Center
        </Typography>
      </Stack>
      <Divider />
      <Stack>
        {searchArticles ? (
          <HelpSearch
            closeHelpCenter={() => {
              setSearchArticles(false);
            }}
          />
        ) : (
          // -----------------------------------------------
          <Stack sx={{ px: 2, mb: 3 }}>
            <Typography variant="body1" color="text.primary" sx={{ my: 3 }}>
              How can I help you?
            </Typography>
            <TextField
              onClick={() => {
                setSearchArticles(true);
              }}
              size="small"
              name="search"
              type="text"
              placeholder="Type key word to find answers"
              fullWidth
              inputProps={{ maxLength: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon name="Research" type="solid" color="grey.500" />
                  </InputAdornment>
                ),
              }}
            />
            <Grid container spacing={1} mt={4}>
              {helpCategories?.map((item) => (
                <Grid
                  item
                  xs={6}
                  key={item.id}
                  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <Box
                    onClick={() => handleCategory(item)}
                    sx={{
                      minHeight: 150,
                      border: 1,
                      borderColor: 'grey.100',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      p: 2,
                    }}
                  >
                    <Image src={iconProfileWizard} width={120} height={77} alt="#" />
                    <Typography align="center">{item?.title}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
        {!searchArticles && (
          <Stack spacing={2} sx={{ mx: 2, p: 2, mb: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.primary">
              Popular Articles
            </Typography>
            {popularArticles?.map((item) => (
              <Stack
                key={item?.id}
                spacing={1}
                direction="row"
                justifyContent="start"
                alignItems="center"
                onClick={() => router.push(PATH_HELP.articles + `/${item?.id}`)}
                sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1 }}
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
        <Box>
          <HelpFooter />
        </Box>
      </Stack>
    </Box>
  );
}
