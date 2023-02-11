// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import map !
import GoogleMapReact from 'google-map-react';
import { Add, Location, LoginCurve, More, UserMinus } from 'iconsax-react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import MediaCarousel from 'src/components/mediaCarousel';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
//import components
import ConnectionOwnProfile from 'src/sections/profile/components/ConnectionOwnProfile';
import ProfilePostTabs from 'src/sections/profile/components/posts/ProfilePostTabs';
import getMonthName from 'src/utils/getMonthName';
// services !
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetUserEmailsQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { useLazyGetProjectsQuery } from 'src/_requests/graphql/profile/ngoProject/queries/getProject.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import MainProfileChangePhotoNgo from './editCoverPhoto/MainProfileChangePhotoNgo';
import MainProfileCoverAvatarNgo from './editCoverPhoto/MainProfileCoverAvatarNgo';
import ActiveCalendar from '/public/icons/mainNGO/active/calendar/24/Outline.svg';
import ActiveCity from '/public/icons/mainNGO/active/City/24/Outline.svg';
import ActiveNGO from '/public/icons/mainNGO/active/NGO/24/Outline.svg';
import Calendar from '/public/icons/mainNGO/calendar/24/Group.svg';
import City from '/public/icons/mainNGO/City/24/Group 638.svg';
// import Camera from '/public/icons/camera.svg'
// icons
import NGO from '/public/icons/mainNGO/NGO/24/Group 167.svg';

// --------------------
const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '280px',
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

const Marker = ({ lat, lng, text }) => <Typography>{text}</Typography>;

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  paddingTop: theme.spacing(2),
  width: '100%',
  position: 'absolute',
  top: '120px',
  paddingInline: theme.spacing(3),
  minHeight: 182,
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
}));

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));
const ProjectDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,

  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));

const BioMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));
const BioBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  height: 38,
}));

const BioDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,

  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));
const ProjectImage = styled(Stack)(({ theme }) => ({
  maxHeight: '90px',
  minWidth: '128px',
  backgroundColor: theme.palette.grey[100],
}));
const MapStyle = styled(Box)(({ theme }) => ({
  height: 230,
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

//

export default function MainNGO() {
  const [isLoadMore, setIsLoadMore] = useState(true);
  const router = useRouter();
  const theme = useTheme();
  const { logout } = useAuth();
  // bottom sheet   & state for edit photo
  const [profileChangePhoto, setProfileChangePhotoBottomSheet] = useState(false);
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  // services
  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [getSocialLinks, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();
  const [getWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();
  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();
  const [getProjects, { data: projectData, isFetching: isFetchingProject }] = useLazyGetProjectsQuery();
  // useEffect for services
  useEffect(() => {
    getUserDetail({ filter: { dto: {} } });
    getSocialLinks({ filter: { dto: { id: null } } });
    getProjects({ filter: { all: true, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
    getWebSites({ filter: { all: true } });
    getCertificates({ filter: { dto: {} } });
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
  }, [router.query]);
  // useEffect for bottom sheet
  useEffect(() => {
    if (!profileChangePhoto && !profileCoverAvatar) getUserDetail({ filter: { dto: {} } });
  }, [profileChangePhoto, profileCoverAvatar]);

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const certificates = certificateData?.getCertificates?.listDto?.items;
  const projects = projectData?.getProjects?.listDto?.items;
  const emails = emailData?.getUserEmails?.listDto?.items;
  const phoneNumbers = phoneNumberData?.getUserPhoneNumbers?.listDto?.items;
  // ------------------------------------------------------
  const ngo = userData?.getUser?.listDto?.items?.[0];
  const locatedIn = ngo?.organizationUserDto?.place?.description;
  const size = ngo?.organizationUserDto?.numberRange;
  const EstablishedDate = ngo?.organizationUserDto?.establishmentDate;
  const category = ngo?.organizationUserDto?.groupCategory;
  const bioText = ngo?.organizationUserDto?.bio;
  const hasPublicDetail = !!category || !!size || !!locatedIn;
  // -----------------------------------------
  // functions !!
  const handleClick = () => setIsLoadMore(!isLoadMore);
  const handleSeeMoreClick = () => {
    setIsLoadMore(!isLoadMore);
  };
  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            <CardStyle>
              <CardMedia
                onClick={() => {
                  ngo?.organizationUserDto?.coverUrl
                    ? setProfileChangePhotoBottomSheet(true)
                    : setProfileCoverAvatarBottomSheet(true);
                  setStatusPhoto('cover');
                }}
                component="img"
                alt="Cover Image"
                height={'176px'}
                image={ngo?.organizationUserDto?.coverUrl || '/icons/empty_cover.svg'}
              />

              <CardContentStyle>
                <StackContentStyle>
                  <Avatar
                    onClick={() => {
                      ngo?.organizationUserDto?.avatarUrl
                        ? setProfileChangePhotoBottomSheet(true)
                        : setProfileCoverAvatarBottomSheet(true);
                      setStatusPhoto('avatar');
                    }}
                    alt={ngo?.organizationUserDto?.fullName}
                    src={ngo?.organizationUserDto?.avatarUrl || undefined}
                    sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                    variant="rounded"
                  >
                    <Image src="/icons/camera.svg" width={28} height={22} alt="avatar" />
                  </Avatar>
                  <Stack direction={'row'} spacing={0.5} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }} color="text.primary">
                        {ngo?.organizationUserDto?.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ngo?.userType}
                      </Typography>
                    </Stack>
                    <Box>
                      <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                        <Typography color={theme.palette.background.paper}>BGD</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
          </Grid>
          {/* =================================={BUTTONS}============================= */}
          <Grid item lg={12}>
            <Stack spacing={0.25}>
              <Stack
                direction="row"
                justifyContent="space-between"
                mt={0.25}
                sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, px: 2, py: 2 }}
              >
                <NextLink href={PATH_APP.post.createPost.socialPost.index} passHref>
                  <Button
                    size="small"
                    sx={{ width: '100%' }}
                    startIcon={<Add color={theme.palette.background.paper} />}
                    variant="contained"
                  >
                    <Typography>Add Post</Typography>
                  </Button>
                </NextLink>

                <IconButton onClick={() => setLogoutBottomSheet(true)}>
                  <More color={theme.palette.text.secondary} />
                </IconButton>
              </Stack>
              {/*===================================== Bio =================== */}

              <Stack
                spacing={1}
                sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, px: 2, py: 2 }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" color={theme.palette.text.primary}>
                    Bio
                  </Typography>
                  {ngo?.organizationUserDto?.bio && (
                    <NextLink href={PATH_APP.profile.ngo.bio + `/${ngo?.organizationUserDto?.id}`} passHref>
                      <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        Edit
                      </Typography>
                    </NextLink>
                  )}
                </Stack>
                {!ngo?.organizationUserDto?.bio ? (
                  <NextLink href={PATH_APP.profile.ngo.bio} passHref>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: (theme) => theme.palette.text.secondary,
                      }}
                      startIcon={<Add color={theme.palette.text.secondary} />}
                    >
                      <Typography color={theme.palette.text.primary}>Add Bio</Typography>
                    </Button>
                  </NextLink>
                ) : (
                  <>
                    {isLoadMore &&
                    (ngo?.organizationUserDto?.bio.length > 180 ||
                      ngo?.organizationUserDto?.bio.trim().split('\n').length > 3) ? (
                      <>
                        <BioBriefDescriptionStyle>
                          {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                            <Typography variant="body2" style={{ marginBottom: 0 }} key={i}>
                              {str}
                            </Typography>
                          ))}
                        </BioBriefDescriptionStyle>
                        <Typography
                          variant="body2"
                          color={'info.main'}
                          sx={{ cursor: 'pointer' }}
                          onClick={handleSeeMoreClick}
                        >
                          see more
                        </Typography>
                      </>
                    ) : (
                      <BioMoreDescriptionStyle>
                        {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                          <Typography variant="body2" style={{ marginBottom: 0, minHeight: 18 }} key={i}>
                            {str}
                          </Typography>
                        ))}
                      </BioMoreDescriptionStyle>
                    )}
                  </>
                )}
              </Stack>
              {/*------------------------------ analytics-------------- */}
              <Stack
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  py: 1,
                }}
              >
                <Box sx={{ px: 2 }}>
                  <Typography variant="subtitle1" color={theme.palette.text.primary}>
                    Analytics
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Box>
                      <Typography color={theme.palette.text.primary}>0</Typography>
                      <Typography color={theme.palette.text.secondary}>Profile Views</Typography>
                    </Box>
                    <Box>
                      <Typography color={theme.palette.text.primary}>0</Typography>
                      <Typography color={theme.palette.text.secondary}>Post views</Typography>
                    </Box>
                    <Box>
                      <Typography color={theme.palette.text.primary}>0</Typography>
                      <Typography color={theme.palette.text.secondary}>Search appernce</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
              {/* ==============================={PUBLIC DETAILS} ================================*/}
              <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" color={theme.palette.text.primary}>
                    Public Detalis
                  </Typography>
                  {hasPublicDetail && (
                    <NextLink href={PATH_APP.profile.ngo.publicDetails.list} passHref>
                      <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        Edit
                      </Typography>
                    </NextLink>
                  )}
                </Box>
                {!hasPublicDetail ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Image src={NGO} alt="ngo" />
                      </IconButton>

                      <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                        NGO Category
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Image src={NGO} alt="ngo" />
                      </IconButton>

                      <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                        NGO Size
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Image src={Calendar} alt="calendar" />
                      </IconButton>

                      <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                        Date of Establishment
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Image src={City} alt="city" />
                      </IconButton>

                      <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                        Located in
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {category && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}
                        key={category.id}
                      >
                        <IconButton>
                          <Image src={ActiveNGO} alt="ngo" />
                        </IconButton>
                        <Typography variant="subtitle2" color={theme.palette.text.primary}>
                          NGO Category
                        </Typography>
                        <Typography variant="subtitle2" color={theme.palette.text.primary}>
                          {category.title}
                        </Typography>
                      </Box>
                    )}

                    {size && (
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                        <IconButton>
                          <Image src={ActiveNGO} alt="ngo" />
                        </IconButton>
                        <Typography variant="subtitle2" color={theme.palette.text.primary}>
                          NGO Size
                        </Typography>
                        <Typography variant="subtitle2" color={theme.palette.text.primary}>
                          {size?.desc}
                        </Typography>
                      </Box>
                    )}
                    {EstablishedDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                        <IconButton>
                          <Image src={ActiveCalendar} alt="ngo" />
                        </IconButton>
                        <Typography variant="subtitle2" color={theme.palette.text.primary}>
                          Date of Establishment
                        </Typography>
                        <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mr: 1 }}>
                          {getMonthName(new Date(EstablishedDate))} {new Date(EstablishedDate).getFullYear()}
                        </Typography>
                      </Box>
                    )}
                    {locatedIn && (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
                          <IconButton>
                            <Image src={ActiveCity} alt="ngo" />
                          </IconButton>
                          <Typography variant="subtitle2" color={theme.palette.text.primary}>
                            Located in
                          </Typography>
                          <Typography variant="subtitle2" color={theme.palette.text.primary}>
                            {!!ngo?.organizationUserDto?.address && `${ngo?.organizationUserDto?.address}, `}
                            {locatedIn}
                          </Typography>
                        </Box>
                        {/* ----------------map---------- */}
                        {ngo?.organizationUserDto?.lat && (
                          <MapStyle>
                            <Box style={{ height: 230 }}>
                              <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                                defaultCenter={{
                                  lat: ngo?.organizationUserDto?.lat,
                                  lng: ngo?.organizationUserDto?.lng,
                                }}
                                defaultZoom={11}
                              >
                                <Marker
                                  lat={ngo?.organizationUserDto?.lat}
                                  lng={ngo?.organizationUserDto?.lng}
                                  text={<Location size="28" color={theme.palette.error.main} variant="Bold" />}
                                />
                              </GoogleMapReact>
                            </Box>
                          </MapStyle>
                        )}
                      </>
                    )}
                  </>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton>
                    <LoginCurve color={theme.palette.text.primary} />
                  </IconButton>

                  <Typography variant="body1" color={theme.palette.text.primary} component="span">
                    Joined Garden of love at
                    {ngo?.organizationUserDto?.joinDateTime && (
                      <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                        {getMonthName(new Date(ngo?.organizationUserDto?.joinDateTime))}{' '}
                        {new Date(ngo?.organizationUserDto?.joinDateTime).getFullYear()}
                      </Typography>
                    )}
                  </Typography>
                </Box>
                {/* ))} */}

                {!hasPublicDetail && (
                  <Box>
                    <NextLink href={PATH_APP.profile.ngo.publicDetails.list} passHref>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{ height: '40px', color: 'text.primary', borderColor: theme.palette.text.secondary }}
                        startIcon={<Add color={theme.palette.text.secondary} />}
                      >
                        Add Public Details
                      </Button>
                    </NextLink>
                  </Box>
                )}
              </Stack>
              {/* =============================={Projects} ==============================*/}
              <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                {projects?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Projects
                      </Typography>

                      <NextLink href={PATH_APP.profile.ngo.project.list} passHref>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          Edit
                        </Typography>
                      </NextLink>
                    </Box>

                    {isFetchingProject ? (
                      <CircularProgress size={20} />
                    ) : (
                      projects?.slice(0, 1)?.map((project, index) => (
                        <Box key={project?.id}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                              {project?.title}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color={theme.palette.text.secondary}>
                              {getMonthName(new Date(project?.startDate)) +
                                ' ' +
                                new Date(project?.startDate).getFullYear() +
                                ' - ' +
                                (project?.endDate
                                  ? getMonthName(new Date(project?.startDate)) +
                                    ' ' +
                                    new Date(project?.startDate).getFullYear()
                                  : 'Present ')}
                              {showDifferenceExp(project?.dateDiff?.years, project?.dateDiff?.months)}
                            </Typography>
                          </Box>
                          {project?.cityDto?.name && (
                            <Box>
                              <Typography variant="caption" color={theme.palette.text.secondary}>
                                {project?.cityDto?.name}
                              </Typography>
                            </Box>
                          )}
                          <Stack>
                            <Box>
                              {project?.description && (
                                <ProjectDescriptionStyle variant="body2">
                                  {project?.description.split('\n').map((str, i) => (
                                    <p key={i}>{str}</p>
                                  ))}
                                </ProjectDescriptionStyle>
                              )}
                            </Box>
                            {project?.projectMedias.length > 0 && (
                              <Box sx={{ py: 2 }}>
                                <MediaCarousel media={project?.projectMedias} dots height={184} width={328} />
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      ))
                    )}
                    {projects.length - 1 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <NextLink href={PATH_APP.profile.ngo.project.list} passHref>
                          <Button variant="text" size="small">
                            See {projects.length - 1} More Projects
                          </Button>
                        </NextLink>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Projects
                      </Typography>
                    </Box>
                    <Box>
                      <NextLink href={PATH_APP.profile.ngo.project.list} passHref>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{
                            height: '40px',
                            color: 'text.primary',
                            mt: 1,
                            borderColor: theme.palette.text.secondary,
                          }}
                          startIcon={<Add color={theme.palette.text.secondary} />}
                        >
                          Add Project
                        </Button>
                      </NextLink>
                    </Box>
                  </>
                )}
              </Stack>
              {/* =========================================={CERTIFICATE} ==============================*/}
              <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                {certificates?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Certificate
                      </Typography>

                      <NextLink href={PATH_APP.profile.ngo.certificate.list} passHref>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          Edit
                        </Typography>
                      </NextLink>
                    </Box>
                    {isFetchingCertificate ? (
                      <CircularProgress size={20} />
                    ) : (
                      certificates.slice(0, 1).map((certificate) => (
                        <Box key={certificate?.id}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                              {certificate?.certificateName?.title}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color={theme.palette.text.secondary}>
                              {certificate.issueDate &&
                                `Issued ${getMonthName(new Date(certificate?.issueDate))}
                  ${new Date(certificate?.issueDate).getFullYear()}`}

                              {certificate?.issueDate && bull}

                              {certificate?.expirationDate
                                ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                                    certificate?.expirationDate
                                  ).getFullYear()} `
                                : !certificate?.credentialDoesExpire && ' No Expiration Date'}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                            Issuing organization: {certificate.issuingOrganization.title}
                          </Typography>
                          {certificate?.credentialID && (
                            <Box>
                              <Typography variant="caption" color={theme.palette.text.secondary}>
                                Credential ID {certificate?.credentialID}
                              </Typography>
                            </Box>
                          )}
                          {certificate?.credentialUrl && (
                            <Box>
                              <NextLink href={'https://' + certificate?.credentialUrl.replace('https://', '')} passHref>
                                <Link target={'_blank'} underline="none">
                                  <Button
                                    size="small"
                                    color="inherit"
                                    variant="outlined"
                                    sx={{ borderColor: 'text.primary', color: 'text.primary', mt: 1, mb: 1 }}
                                  >
                                    <Typography variant="body2">see certificate</Typography>
                                  </Button>
                                </Link>
                              </NextLink>
                            </Box>
                          )}
                        </Box>
                      ))
                    )}
                    {certificates.length - 1 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                        <NextLink href={PATH_APP.profile.ngo.certificate.list} passHref>
                          <Button variant="text" size="small">
                            See {certificates.length - 1} More Certificate
                          </Button>
                        </NextLink>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Certificate
                      </Typography>
                    </Box>
                    <Box>
                      <NextLink href={PATH_APP.profile.ngo.certificate.list} passHref>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ height: '40px', color: 'text.primary', borderColor: theme.palette.text.secondary }}
                          startIcon={<Add color={theme.palette.text.secondary} />}
                        >
                          Add Certificate
                        </Button>
                      </NextLink>
                    </Box>
                  </>
                )}
              </Stack>

              {/* ============================================{CONTACT INFO}======================== */}
              <Stack spacing={2} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                {!!emails?.length ||
                !!phoneNumbers?.length ||
                !!socialMediaData?.getUserSocialMedias?.listDto?.items?.length ||
                !!websitesData?.getUserWebSites?.listDto?.items?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Contact Info
                      </Typography>

                      <NextLink href={PATH_APP.profile.ngo.contactInfo.list} passHref>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          Edit
                        </Typography>
                      </NextLink>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        Email
                      </Typography>
                      {isFetchingEmail ? (
                        <CircularProgress size={20} />
                      ) : (
                        emails?.map((email) => (
                          <Typography variant="body2" color={theme.palette.text.primary} sx={{ pl: 1 }} key={email?.id}>
                            {email?.email}
                          </Typography>
                        ))
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        Phone Number
                      </Typography>
                      {isFetchingPhoneNumber ? (
                        <CircularProgress size={20} />
                      ) : (
                        phoneNumbers?.map((phone) => (
                          <Typography variant="body2" color={theme.palette.text.primary} sx={{ pl: 1 }} key={phone?.id}>
                            {phone?.phoneNumber}
                          </Typography>
                        ))
                      )}
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        Social Links
                      </Typography>
                      {isFetchingSocialMedia ? (
                        <CircularProgress size={20} />
                      ) : (
                        socialMediaData?.getUserSocialMedias?.listDto?.items?.map((social) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }} key={social?.id}>
                            {/* <img src={`/icons/socials/${social?.socialMediaDto?.title}.svg`} width={24} height={24}/> */}
                            <Typography variant="body2" color={theme.palette.text.secondary} sx={{ pl: 1 }}>
                              {social?.socialMediaDto?.title}
                            </Typography>
                            <Typography variant="body2" color={theme.palette.text.primary} sx={{ pl: 1 }}>
                              {social?.userName}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                        Website
                      </Typography>
                      {isFetchingWebsite ? (
                        <CircularProgress size={20} />
                      ) : (
                        websitesData?.getUserWebSites?.listDto?.items?.map((webSite) => (
                          <Typography
                            variant="body2"
                            color={theme.palette.text.primary}
                            sx={{ pl: 1 }}
                            key={webSite?.id}
                          >
                            {webSite?.webSiteUrl}
                          </Typography>
                        ))
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Contact Info
                      </Typography>
                    </Box>
                    <Box>
                      <NextLink href={PATH_APP.profile.ngo.contactInfo.list} passHref>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<Add color={theme.palette.text.secondary} />}
                          sx={{
                            height: '40px',
                            color: 'text.primary',
                            mt: 1,
                            borderColor: theme.palette.text.secondary,
                          }}
                        >
                          Add Contact Info
                        </Button>
                      </NextLink>
                    </Box>
                  </>
                )}
              </Stack>
              {/*================================= Followers =============================*/}
              <Stack sx={{ backgroundColor: theme.palette.background.paper, pt: 3, pb: 1 }}>
                <Box sx={{ px: 2 }}>
                  <ConnectionOwnProfile />
                </Box>
              </Stack>
              {/*================================= post =============================*/}

              <Stack sx={{ backgroundColor: theme.palette.background.paper, pt: 2, pb: 2 }}>
                <Box sx={{ px: 2 }}>
                  <ProfilePostTabs />
                </Box>
              </Stack>
              {/* ------------------------------- ENd sections----------------------------------------- */}
            </Stack>
          </Grid>
        </Stack>
      </RootStyle>
      {/*============================= bottomSheets================================ */}
      <BottomSheet open={profileChangePhoto} onDismiss={() => setProfileChangePhotoBottomSheet(false)}>
        <MainProfileChangePhotoNgo
          isProfilePhoto={statusPhoto === 'avatar'}
          onClose={() => {
            setProfileChangePhotoBottomSheet(false);
          }}
          onUpload={() => {
            setProfileChangePhotoBottomSheet(false);
            setProfileCoverAvatarBottomSheet(true);
          }}
        />
      </BottomSheet>
      <BottomSheet open={profileCoverAvatar} onDismiss={() => setProfileCoverAvatarBottomSheet(false)}>
        <MainProfileCoverAvatarNgo
          isAvatar={statusPhoto === 'avatar'}
          onCloseBottomSheet={() => {
            setProfileCoverAvatarBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={logoutBottomSheet} onDismiss={() => setLogoutBottomSheet(false)}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={() => {
              localStorage.removeItem('closeWizardNgo');
              logout();
            }}
          >
            <UserMinus size="16" color={theme.palette.error.main} />
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              Log Out
            </Typography>
          </Stack>
        </Box>
      </BottomSheet>
    </>
  );
}
