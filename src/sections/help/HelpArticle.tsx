import { Avatar, Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Dislike, Like1, Note, TickCircle } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import gardenOfLoveLogo from 'public/logo/logo.png';
import { useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import { PATH_HELP } from 'src/routes/paths';
import { useSetIsUsefulArticleCommandMutation } from 'src/_requests/graphql/upload/mutations/setIsUsefulArticleCommand.generated';
// services !!
import { useLazyGetHelpArticlesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpArticlesQuery.generated';
import { useLazyGetHelpRelatedArticlesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpRelatedArticlesQuery.generated';
// components !!
import HelpFooter from './HelpFooter';
import HelpSearch from './HelpSearch';

// -----------------start -----------------------------
export default function HelpArticle() {
  // tolls !!!
  const router = useRouter();
  const theme = useTheme();
  // state for show thanks comment !
  const [showThanks, setShowThanks] = useState(false);
  const [searchArticles, setSearchArticles] = useState(false);

  const id = router?.query?.id?.[0];
  // ---services --------
  //queries !
  const [getHelpArticlesQuery, { data, isFetching }] = useLazyGetHelpArticlesQueryQuery();
  const [getHelpRelatedArticlesQuery, { data: relatedArticleData, isFetching: relatedArticleLoading }] =
    useLazyGetHelpRelatedArticlesQueryQuery();
  // mutations !
  // mutation !
  const [setIsUsefulArticleCommand, { isLoading: likeLoading }] = useSetIsUsefulArticleCommandMutation();
  // useEffects!!
  useEffect(() => {
    getHelpArticlesQuery({ filter: { ids: ['065c28fa-1a9c-473e-8632-26ef56960736'] } });
  }, []);
  const HelpArticlesData = data?.getHelpArticlesQuery?.listDto?.items?.[0];

  useEffect(() => {
    getHelpRelatedArticlesQuery({
      filter: { dto: { id: '61010e7f-6fc0-4179-9bd7-659aaf8dc176' } },
    });
  }, []);
  const helpRelatedArticle = relatedArticleData?.getHelpRelatedArticlesQuery?.listDto?.items;
  // mutation !!--------
  // functions !
  const handleLikeArticle = async (likeValue: boolean) => {
    const resData: any = await setIsUsefulArticleCommand({
      article: {
        dto: { articleId: '61010e7f-6fc0-4179-9bd7-659aaf8dc176', isUseful: likeValue },
      },
    });
    if (resData?.data?.setIsUsefulArticleCommand?.isSuccess) {
      setShowThanks(true);
    }
  };
  //---- jsx---
  return (
    <>
      <Box>
        <Stack sx={{ mb: 2, px: 2, pt: 3, gap: 2 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <Image src={gardenOfLoveLogo} />
            <Typography variant="subtitle1" color="text.primary">
              Help Center
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ gap: 3 }}>
            <Box
              onClick={() => {
                setSearchArticles(true);
              }}
            >
              <Icon name="Research" type="solid" color="grey.500" />
            </Box>

            <Icon name="Menu" type="solid" color="grey.500" />
          </Stack>
        </Stack>
        <Divider />
      </Box>

      <Stack>
        {searchArticles ? (
          <HelpSearch
            closeHelpCenter={() => {
              setSearchArticles(false);
            }}
          />
        ) : (
          <>
            <Stack spacing={2} justifyContent="center" sx={{ px: 2, mt: 3 }}>
              <Typography variant="subtitle1" color="text.primary">
                {HelpArticlesData?.title}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {HelpArticlesData?.content}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 3, mx: 2, py: 1, border: 1, borderColor: 'grey.100', borderRadius: 2 }}>
              {showThanks ? (
                <Stack spacing={1} alignItems="center">
                  <TickCircle size={24} color={theme.palette.success.main} variant="Bold" />
                  <Typography align="center" color="success.main" variant="subtitle2">
                    Thanks for letting us know
                  </Typography>
                </Stack>
              ) : (
                <>
                  <Typography variant="body2" color="text.primary" sx={{ pl: 2 }}>
                    Was this helpful?
                  </Typography>
                  <Stack direction="row" alignItems="center" sx={{ px: 1, gap: 1 }}>
                    <Button
                      color="inherit"
                      sx={{ bgcolor: 'grey.100' }}
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => handleLikeArticle(true)}
                    >
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Like1 color={theme.palette.grey[500]} variant="Outline" />
                        <Typography variant="button" color="text.primary">
                          Yes
                        </Typography>
                      </Box>
                    </Button>
                    <Button
                      color="inherit"
                      sx={{ bgcolor: 'grey.100' }}
                      fullWidth
                      variant="contained"
                      onClick={() => handleLikeArticle(false)}
                    >
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Dislike color={theme.palette.grey[500]} variant="Outline" />
                        <Typography variant="button" color="text.primary">
                          No
                        </Typography>
                      </Box>
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
            {helpRelatedArticle?.length > 0 && (
              <Stack sx={{ px: 2 }}>
                <Typography variant="subtitle1" color="text.primary">
                  Related Articles
                </Typography>
                <Stack spacing={3} sx={{ mt: 3, mb: 6 }}>
                  {helpRelatedArticle?.map((item) => (
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
                        {item?.title}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            )}
          </>
        )}
        <Box>
          <HelpFooter />
        </Box>
      </Stack>
    </>
  );
}
