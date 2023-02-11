import { Box, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import gardenOfLoveLogo from 'public/logo/logo.png';
import { useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import { PATH_HELP } from 'src/routes/paths';
import { useLazyGetHelpCategoriesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpCategoriesQuery.generated';
import HelpFooter from './HelpFooter';
import HelpSearch from './HelpSearch';

// ----------------------------------------------

export default function HelpItems() {
  const categoryItemsDataJson = localStorage.getItem('categoryItems');
  const categoryItemsData = JSON.parse(categoryItemsDataJson);
  const theme = useTheme();
  const router = useRouter();
  const [category, setCategory] = useState(categoryItemsData);
  const [searchArticles, setSearchArticles] = useState(false);

  // local Storage !!!

  // -------------

  useEffect(() => {
    if (router.query.categoryId) {
      setCategory(categoryItemsData?.subCategory.find((item) => item.id === router.query.categoryId));
    }
  }, [router.query]);

  // jsx of help center----------
  return (
    <Stack>
      <Box>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
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
      {searchArticles ? (
        <HelpSearch
          closeHelpCenter={() => {
            setSearchArticles(false);
          }}
        />
      ) : (
        <Stack>
          <Stack sx={{ minHeight: 'calc(100vh - 300px)' }}>
            <Stack spacing={2} sx={{ px: 2, my: 3 }}>
              <Typography variant="subtitle1" color="text.primary">
                {category?.title}
              </Typography>
              {category?.description && (
                <Typography variant="body1" color="text.primary">
                  {category?.description}
                </Typography>
              )}
            </Stack>
            <Stack spacing={2} sx={{ px: 2, mb: 11 }}>
              {category?.subCategory?.length > 0 ? (
                <>
                  {category?.subCategory?.map((item) => (
                    <Stack
                      key={item?.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ pl: 2, pr: 2, bgcolor: 'background.neutral', py: 1, borderRadius: 1 }}
                      onClick={() => router.push(`category/?categoryId=${item.id}`)}
                    >
                      <Typography variant="subtitle2" color="text.primary">
                        {item?.title}
                      </Typography>
                      <IconButton sx={{ p: 0 }}>
                        <ArrowRight2 variant="Outline" size="24" color={theme.palette.grey[500]} />
                      </IconButton>
                    </Stack>
                  ))}
                </>
              ) : (
                <>
                  {category?.articles?.map((item) => (
                    <Stack
                      key={item?.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ pl: 2, pr: 2, bgcolor: 'background.neutral', py: 1, borderRadius: 1 }}
                      onClick={() => router.push(PATH_HELP.articles + `/${item?.id}`)}
                    >
                      <Typography variant="subtitle2" color="text.primary">
                        {item?.title}
                      </Typography>
                      <IconButton sx={{ p: 0 }}>
                        <ArrowRight2 variant="Outline" size="24" color={theme.palette.grey[500]} />
                      </IconButton>
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </Stack>

          <HelpFooter />
        </Stack>
      )}
    </Stack>
  );
}
