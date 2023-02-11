// @mui
import { Box, CircularProgress, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { ArrowLeft2 } from 'iconsax-react';
import { useRouter } from 'next/router';
// components
import React, { useEffect } from 'react';
import { VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import { useLazyGetUserEmailsQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserWebSites.generated';

const ContactsListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function ContactInfoView() {
  const theme = useTheme();
  const router = useRouter();
  const ID = router?.query?.id?.[0];

  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();

  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();

  const [getUserSocialMedias, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();

  const [getUserWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();

  useEffect(() => {
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed, userId: ID } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed, userId: ID } } });
    getUserSocialMedias({ filter: { dto: { userId: ID } } });
    getUserWebSites({ filter: { dto: { userId: ID } } });
  }, []);

  console.log('query is:', router?.query);

  return (
    <>
      <ContactsListBoxStyle>
        <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
          <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
            <ArrowLeft2 color={theme.palette.grey[500]} />
          </IconButton>
          <Typography variant="subtitle1">Contact Info</Typography>
        </Stack>

        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color={theme.palette.primary.main}>
            Email
          </Typography>

          {isFetchingEmail ? (
            <CircularProgress size={20} />
          ) : (
            emailData?.getUserEmails?.listDto?.items?.map((email) => (
              <Typography variant="body2" mb={1} color="text.primary" key={email?.id}>
                {email?.email}
              </Typography>
            ))
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color={theme.palette.primary.main}>
            Phone Number
          </Typography>

          {isFetchingPhoneNumber ? (
            <CircularProgress size={22} />
          ) : (
            phoneNumberData?.getUserPhoneNumbers?.listDto?.items?.map((number) => (
              <Typography variant="body2" mb={1} color="text.primary" key={number?.id}>
                {number?.phoneNumber}
              </Typography>
            ))
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color={theme.palette.primary.main}>
            Social Link
          </Typography>

          {isFetchingSocialMedia ? (
            <CircularProgress size={20} />
          ) : (
            socialMediaData?.getUserSocialMedias?.listDto?.items?.map((socialLink) => (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1} key={socialLink?.id}>
                  <Typography variant="body2" color={theme.palette.text.secondary} key={socialLink?.id} sx={{ ml: 1 }}>
                    {socialLink?.socialMediaDto.title}:
                  </Typography>
                  <Typography variant="body2" color="text.primary" key={socialLink?.id} sx={{ ml: 1 }}>
                    {socialLink?.userName}
                  </Typography>
                </Box>
              </>
            ))
          )}
        </Stack>
        <Divider />
        <Stack spacing={2} my={2}>
          <Typography variant="subtitle2" color={theme.palette.primary.main}>
            Website
          </Typography>
          {isFetchingWebsite ? (
            <CircularProgress size={22} />
          ) : (
            websitesData?.getUserWebSites?.listDto?.items?.map((website) => (
              <Typography variant="body2" mb={1} color="text.primary" key={website?.id}>
                {website?.webSiteUrl}
              </Typography>
            ))
          )}
        </Stack>
        <Divider />
      </ContactsListBoxStyle>
    </>
  );
}
