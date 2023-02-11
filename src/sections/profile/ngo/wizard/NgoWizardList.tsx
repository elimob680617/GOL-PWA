import { Avatar, Box, Button, CircularProgress, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, ArrowRight2, Briefcase, Camera, Gallery, Like1, Location, Math, TickCircle } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
// types
import { ProfileCompleteEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
// services !
// component for bottomSheet
import MainProfileCoverAvatarNgo from 'src/sections/profile/ngo/owner/ngoMain/editCoverPhoto/MainProfileCoverAvatarNgo';
import { useLazyOrganizationProfileCompleteQuery } from 'src/_requests/graphql/profile/users/queries/organizationProfileComplete.generated';
// --------------start project------------------

export default function NgoWizardList() {
  const theme = useTheme();
  const router = useRouter();
  // bottom sheet   & state for edit photo
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  //services !
  const [organizationProfileComplete, { data, isFetching }] = useLazyOrganizationProfileCompleteQuery();

  // useEffect for get data
  useEffect(() => {
    organizationProfileComplete({
      filter: {
        all: true,
      },
    });
  }, []);

  // useEffect for bottom sheet -------
  useEffect(() => {
    if (!profileCoverAvatar)
      organizationProfileComplete({
        filter: {
          all: true,
        },
      });
  }, [profileCoverAvatar]);

  const profileData = data?.organizationProfileComplete?.listDto?.items?.[0];

  // functions !
  function handleRoute(route: string) {
    localStorage.setItem('fromWizardNgo', 'true');
    router.push(route);
  }
  function handleNgoLogo() {
    if (!profileData?.ngoLogo) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('avatar');
    }
  }
  function handleCoverPhoto() {
    if (!profileData?.coverPhoto) {
      setProfileCoverAvatarBottomSheet(true);
      setStatusPhoto('cover');
    }
  }
  return (
    <>
      <Stack>
        <Stack sx={{ px: 2, pt: 3, pb: 2, gap: 1 }} direction="row" alignItems="center">
          <IconButton onClick={() => router.push('/home')}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            Complete Your Profile
          </Typography>
        </Stack>
        <Divider />
        <Stack sx={{ mt: 2, px: 2, mb: 2 }} spacing={3} alignItems="center" justifyContent="space-between">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{ backgroundColor: 'grey.100', width: '100%', px: 1, borderRadius: 1, mb: 2 }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
              {profileData?.completeProfilePercentage === 100 ? (
                <Box sx={{ my: 1.7 }}>
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
              <Button size="small" variant="text" color="info" onClick={() => router.push(PATH_APP.profile.ngo.root)}>
                <Typography variant="button">Open My Profile</Typography>
              </Button>
            </Box>
          </Stack>
          {/*-------------------------- Ngo Logo-------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.ngoLogo ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={handleNgoLogo}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.ngoLogo ? 'background.paper' : 'grey.100' }}
              >
                <Icon name="Profile-Photo" color={profileData?.ngoLogo ? 'primary.light' : 'primary.main'} />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.ngoLogo ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Your NGO Logo
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Upload Your Official Logo Here
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    Your NGO Logo Uploaded
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.ngoLogo ? (
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
                      Related Picture to Your Category
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
                <IconButton sx={{ padding: 0 }}>
                  <Icon name="right-arrow-1" color="grey.500" />
                </IconButton>
              )}
            </Box>
          </Stack>
          {/* ---------------------------Bio ---------------- */}

          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.bio ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.bio) {
                handleRoute(PATH_APP.profile.ngo.bio);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.bio ? 'background.paper' : 'grey.100' }}
              >
                <Briefcase
                  size={24}
                  color={profileData?.bio ? theme.palette.primary.light : theme.palette.primary.main}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.bio ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Add Bio
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Insert Your Bio
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    Bio added
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.bio ? (
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
          {/*----------------------------- certificate----------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.certificate ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.certificate) {
                handleRoute(PATH_APP.profile.ngo.certificate.list);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.certificate ? 'background.paper' : 'grey.100' }}
              >
                <Briefcase
                  size={24}
                  color={profileData?.certificate ? theme.palette.primary.light : theme.palette.primary.main}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.certificate ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Add Certificate
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Add your certificate
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    Certificate added
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.certificate ? (
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
          {/* -----------------------------Public details--------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor:
                profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'background.paper' : 'grey.100',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (profileData?.profileDetails !== ProfileCompleteEnum.Complete) {
                handleRoute(PATH_APP.profile.ngo.publicDetails.list);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{
                  my: 1,
                  backgroundColor:
                    profileData?.profileDetails === ProfileCompleteEnum.Nothing ? 'grey.100' : 'background.paper',
                }}
              >
                <Location
                  size={24}
                  color={
                    profileData?.profileDetails === ProfileCompleteEnum.Complete
                      ? theme.palette.primary.light
                      : theme.palette.primary.main
                  }
                />
                {/* <Icon
                  name="account-info"
                  color={
                    profileData?.profileDetails === ProfileCompleteEnum.Complete ? 'primary.light' : 'primary.main'
                  }
                /> */}
              </Avatar>
              <Stack spacing={0.5}>
                {profileData?.profileDetails === ProfileCompleteEnum.Complete ? (
                  <Typography variant="subtitle2" color="grey.500">
                    Public Details Completed
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Public Details
                    </Typography>
                    {profileData?.profileDetails === ProfileCompleteEnum.Nothing ? (
                      <Typography variant="caption" color="grey.500">
                        Insert Your public Details
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="grey.500">
                        Complete Your Public Details
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.profileDetails === ProfileCompleteEnum.Complete ? (
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

          {/* ------------------------------------project------------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.projects ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.projects) {
                handleRoute(PATH_APP.profile.ngo.project.list);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.projects ? 'background.paper' : 'grey.100' }}
              >
                <Briefcase
                  size={24}
                  color={profileData?.projects ? theme.palette.primary.light : theme.palette.primary.main}
                />
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.projects ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      project
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Insert Your project Info
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    project Info Completed
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.projects ? (
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

          {/*---------------------- Website link--------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.webSiteLinks ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.webSiteLinks) {
                handleRoute(PATH_APP.profile.ngo.contactInfo.list);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.webSiteLinks ? 'background.paper' : 'grey.100' }}
              >
                <Math
                  size={24}
                  color={profileData?.webSiteLinks ? theme.palette.primary.light : theme.palette.primary.main}
                />
                {/* <Icon name="mortarboard" color={profileData?.webSiteLinks ? 'primary.light' : 'primary.main'} /> */}
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.webSiteLinks ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Website Link
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Insert Your website Info
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    website Info Completed
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.webSiteLinks ? (
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
          {/* -----------------------------------------------phoneNumber--------------------------------------- */}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              backgroundColor: profileData?.phoneNumber ? 'grey.100' : 'background.paper',
              border: 1,
              borderColor: 'grey.300',
              width: '100%',
              px: 2,
              borderRadius: 2,
            }}
            onClick={() => {
              if (!profileData?.phoneNumber) {
                handleRoute(PATH_APP.profile.ngo.contactInfo.list);
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Avatar
                alt="Profile Picture"
                sx={{ my: 1, backgroundColor: profileData?.phoneNumber ? 'background.paper' : 'grey.100' }}
              >
                <Math
                  size={24}
                  color={profileData?.phoneNumber ? theme.palette.primary.light : theme.palette.primary.main}
                />
                {/* <Icon name="mortarboard" color={profileData?.phoneNumber ? 'primary.light' : 'primary.main'} /> */}
              </Avatar>
              <Stack spacing={0.5}>
                {!profileData?.phoneNumber ? (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      phone Number
                    </Typography>
                    <Typography variant="caption" color="grey.500">
                      Insert Your phone Number Info
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="grey.500">
                    phone Number Info Completed
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Box>
              {profileData?.phoneNumber ? (
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
        </Stack>
      </Stack>
      {/*------------------------------------ bottom sheet ------------------ */}
      <BottomSheet open={profileCoverAvatar} onDismiss={() => setProfileCoverAvatarBottomSheet(false)}>
        <MainProfileCoverAvatarNgo
          isAvatar={statusPhoto === 'avatar'}
          onCloseBottomSheet={() => {
            setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}
