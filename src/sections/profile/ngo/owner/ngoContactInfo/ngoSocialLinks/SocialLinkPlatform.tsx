import { Box, CircularProgress, Divider, IconButton, Stack, Typography } from '@mui/material';
import { Image } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SocialMedia } from 'src/@types/sections/serverTypes';
import { userSocialMediasSelector } from 'src/redux/slices/profile/userSocialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useGetSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getSocialMedias.generated';

interface SocialLinkPlatformProps {
  onChange: (value: { id: string; title?: string; logoUrl?: string }) => void;
}

function SocialLinkPlatform(props: SocialLinkPlatformProps) {
  const { onChange } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  useEffect(() => {
    if (!personSocialMedia) router.push(PATH_APP.profile.ngo.contactInfo.list);
  }, [personSocialMedia, router]);

  const { data, isFetching } = useGetSocialMediasQuery({
    filter: {
      all: true,
    },
  });

  const handleSelectPlatform = (social: SocialMedia) => {
    onChange(social);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          Select Platform
        </Typography>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        {isFetching ? (
          <CircularProgress size={20} />
        ) : (
          data?.getSocialMedias?.listDto?.items?.map((item) => (
            <Box
              key={item?.id}
              onClick={() => handleSelectPlatform(item as SocialMedia)}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.primary">
                <IconButton sx={{ mr: 1 }}>
                  <Image size="16" variant="Linear" />
                </IconButton>
                {item?.title}
              </Typography>
            </Box>
          ))
        )}
      </Stack>
    </Stack>
  );
}

export default SocialLinkPlatform;
