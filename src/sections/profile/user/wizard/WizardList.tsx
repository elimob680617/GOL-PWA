import { Avatar, Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import {
  ArrowLeft,
  ArrowRight2,
  Briefcase,
  Camera,
  Gallery,
  Like1,
  Location,
  Math,
  TickCircle,
  UserTick,
} from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// import bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
// types
import { ProfileCompleteEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
// services !
import { useLazyProfileCompleteQuery } from 'src/_requests/graphql/profile/users/queries/profileComplete.generated';
// component for bottomSheet
import MainProfileCoverAvatarUser from '../owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser';
// --------------start project------------------

function WizardList() {
  const theme = useTheme();
  const router = useRouter();
  const { initialize, user } = useAuth();
  // bottom sheet   & state for edit photo
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  //services !
  const [profileComplete, { data, isFetching }] = useLazyProfileCompleteQuery();

  // useEffect for get data
  useEffect(() => {
    profileComplete({
      filter: {
        all: true,
      },
    });
  }, []);

  // useEffect for bottom sheet -------
  useEffect(() => {
    if (!profileCoverAvatar)
      profileComplete({
        filter: {
          all: true,
        },
      });
  }, [profileCoverAvatar]);

  const profileData = data?.profileComplete?.listDto?.items?.[0];
  // functions !
  function handleRoute(route: string) {
    localStorage.setItem('fromWizard', 'true');
    router.push(route);
  }
  function handleCoverPhoto() {
    if (!profileData?.coverPhoto) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('cover');
    }
  }
  function handleProfilePicture() {
    if (!profileData?.profilePicture) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('avatar');
    }
  }
  return (
    <>
      <Stack>
        <Stack sx={{ px: 2, pt: 3, pb: 2, gap: 1 }} direction="row" alignItems="center">
          <IconButton
            onClick={() => {
              initialize();
              router.push('/home');
            }}
          >
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Complete Your Profile
          </Typography>
        </Stack>
        <Divider />
        <Stack sx={{ mt: 2, px: 2 }} spacing={3} alignItems="center" justifyContent="space-between">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{ backgroundColor: 'grey.100', width: '100%', px: 1, borderRadius: 1, mb: 2 }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              {profileData?.completeProfilePercentage === 100 ? (
                <Box sx={{ my: 1.7 }}>
                  {/* <Icon name="Like" type="solid" color="primary.main" /> */}
                  <Like1 variant="Bold" color={theme.palette.primary.main} />
                </Box>
              ) : (
                <Box>
                  <CircularProgress
                    variant="determinate"
                    value={profileData?.completeProfilePercentage}
                    sx={{ my: 1, position: 'relative', zIndex: 10 }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    sx={{ my: 1, position: 'absolute', ml: -5, color: 'grey.300', zIndex: 1 }}
                  />
                </Box>
              )}
              <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                <Typography variant="subtitle1" color="primary.main">
                  {profileData?.completeProfilePercentage} %
                </Typography>
                <Typography variant="subtitle1" color="grey.500">
                  Completed
                </Typography>
              </Stack>
            </Stack>
            <Box>
              <Button size="small" variant="text" color="info" onClick={() => router.push(PATH_APP.user.profile)}>
                <Typography variant="button">Open My Profile</Typography>
              </Button>
            </Box>
          </Stack>
          {/*-------------------------- profile-Picture-------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.profilePicture ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={handleProfilePicture}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.profilePicture ? 'background.paper' : 'grey.100' }}
              >
                <Icon name="Profile-Photo" color={profileData?.profilePicture ? 'primary.light' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.profilePicture ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Profile Picture
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Upload Your Profile Picture
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    Profile Picture Uploaded
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.profilePicture ? (
                <IconButton sx={{ padding: 0 }}>
                  {/* <Icon type="solid" name="Approve" color="primary.light" /> */}
                  <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/*-------------------------- cover photo -------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.coverPhoto ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={handleCoverPhoto}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.coverPhoto ? 'background.paper' : 'grey.100' }}
              >
                <Gallery
                  size={24}
                  color={profileData?.coverPhoto ? theme.palette.primary.light : theme.palette.primary.main}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.coverPhoto ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Cover Photo
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Upload Your Cover Photo
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    Cover Photo Uploaded
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.coverPhoto ? (
                <IconButton sx={{ padding: 0 }}>
                  {/* <Icon type="solid" name="Approve" color="primary.light" /> */}
                  <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ padding: 0 }}
                  onClick={() => {
                    setProfileCoverAvatarBottomSheet(true);
                    setStatusPhoto('cover');
                  }}
                >
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* ---------------------------profile information ---------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor:
                profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'background.paper' : 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (profileData?.profileInformation !== ProfileCompleteEnum.Complete) {
                handleRoute(PATH_APP.profile.user.editProfile);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{
                  my: 1,
                  backgroundColor:
                    profileData?.profileInformation === ProfileCompleteEnum.Nothing ? 'grey.100' : 'background.paper',
                }}
              >
                {/* <Icon
                  name="account-info"
                  color={
                    profileData?.profileInformation === ProfileCompleteEnum.Complete ? 'primary.light' : 'primary.main'
                  }
                /> */}
                     <UserTick
                  size={24}
                  color={
                    profileData?.profileInformation === ProfileCompleteEnum.Complete
                      ? theme.palette.primary.light
                      : theme.palette.primary.main
                  }
                />
              </Avatar>
              <Stack spacing={0.5}>
                {profileData?.profileInformation === ProfileCompleteEnum.Complete ? (
                  <Typography variant="subtitle2" color="grey.500">
                    Profile Info Completed
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Profile Informations
                    </Typography>
                    {profileData?.profileInformation === ProfileCompleteEnum.Nothing ? (
                      <Typography variant="caption" color="grey.500">
                        Insert Your Profile Info
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="grey.500">
                        Complete Your Profile Info
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.profileInformation === ProfileCompleteEnum.Complete ? (
                <IconButton sx={{ padding: 0 }}>
                  {/* <Icon type="solid" name="Approve" color="primary.light" /> */}
                  <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/*------------------------------------- location--------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.location === ProfileCompleteEnum.Nothing ? 'background.paper' : 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (profileData?.location !== ProfileCompleteEnum.Complete) {
                handleRoute(PATH_APP.profile.user.publicDetails.List);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{
                  my: 1,
                  backgroundColor:
                    profileData?.location === ProfileCompleteEnum.Nothing ? 'grey.100' : 'background.paper',
                }}
              >
                <Icon
                  name="location"
                  color={profileData?.location === ProfileCompleteEnum.Complete ? 'primary.light' : 'primary.main'}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {profileData?.location === ProfileCompleteEnum.Complete ? (
                  <Typography variant="subtitle2" color="grey.500">
                    Location Info Completed
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Location
                    </Typography>
                    {profileData?.location === ProfileCompleteEnum.Nothing ? (
                      <Typography variant="caption" color="grey.500">
                        Insert Your Profile Info
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="grey.500">
                        Complete Your Location Info
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.location === ProfileCompleteEnum.Complete ? (
                <IconButton sx={{ padding: 0 }}>
                  {/* <Icon type="solid" name="Approve" color="primary.light" /> */}
                  <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* ------------------------------------experience------------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.experience ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.experience) {
                handleRoute(PATH_APP.profile.user.experience.list);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.experience ? 'background.paper' : 'grey.100' }}
              >
                <Briefcase
                  size={24}
                  color={profileData?.experience ? theme.palette.primary.light : theme.palette.primary.main}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.experience ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Experience
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Insert Your Experience Info
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    Experience Info Completed
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.experience ? (
                <IconButton sx={{ padding: 0 }}>
                  {/* <Icon type="solid" name="Approve" color="primary.light" /> */}
                  <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* -----------------------------------------education--------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.education ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.education) {
                handleRoute(PATH_APP.profile.user.publicDetails.List);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.education ? 'background.paper' : 'grey.100' }}
              >
                 <Math
                  size={24}
                  color={profileData?.education ? theme.palette.primary.light : theme.palette.primary.main}
                />
                {/* <Icon name="mortarboard" size={24} color={profileData?.education ? 'primary.light' : 'primary.main'} /> */}
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.education ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Education
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Insert Your Education Info
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    Education Info Completed
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.education ? (
                <IconButton sx={{ padding: 0 }}>
                     <TickCircle size={24} color={theme.palette.primary.light} variant="Bold" />
                  {/* <Icon type="solid" name="Approve" color="primary.light" /> */}
                </IconButton>
              ) : (
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
      {/*------------------------------- bottom sheet------------------ */}
      <BottomSheet open={profileCoverAvatar} onDismiss={() => setProfileCoverAvatarBottomSheet(false)}>
        <MainProfileCoverAvatarUser
          isAvatar={statusPhoto === 'avatar'}
          onCloseBottomSheet={() => {
            setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default WizardList;
