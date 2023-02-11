// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// icons
import { Add, Book1, Briefcase, Edit2, Heart, Location, LoginCurve, More, UserMinus } from 'iconsax-react';
// tools !
import Image from 'next/image';
import NextLink from 'next/link';
import { VerificationStatusEnum } from 'src/@types/sections/serverTypes';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// bottom sheets
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
// services !
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetUserEmailsQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserEmails.generated';
import { useLazyGetUserPhoneNumbersQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserPhoneNumbers.generated';
import { useLazyGetUserSocialMediasQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserSocialMedias.generated';
import { useLazyGetUserWebSitesQuery } from 'src/_requests/graphql/profile/contactInfo/queries/getUserWebSites.generated';
import { useLazyGetExperiencesQuery } from 'src/_requests/graphql/profile/experiences/queries/getExperiences.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getPersonSkills.generated';
// import components
import ConnectionOwnProfile from 'src/sections/profile/components/ConnectionOwnProfile';
import ProfilePostTabs from 'src/sections/profile/components/posts/ProfilePostTabs';
import getMonthName from 'src/utils/getMonthName';
import MainProfileChangePhotoUser from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileChangePhotoUser';
import MainProfileCoverAvatarUser from 'src/sections/profile/user/owner/userMain/addAvatarCoverPhoto/MainProfileCoverAvatarUser';
// ----------------------------------------------
// styles
const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: '358px',
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  // paddingBottom: theme.spacing(2),
  // paddingTop: theme.spacing(2),
  width: '100%',
  position: 'absolute',
  top: '120px',
  padding: theme.spacing(2),
  // paddingInline: theme.spacing(3),
  minHeight: 182,
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
}));

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));
const ExperienceDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,

  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  textAlign: 'left',
}));
const ExperienceImage = styled(Stack)(({ theme }) => ({
  maxHeight: '184px',
  minWidth: '328px',
  backgroundColor: theme.palette.grey[100],
}));

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

export default function Main() {
  // bottom sheet   & state for edit photo
  const [profileChangePhoto, setProfileChangePhotoBottomSheet] = useState(false);
  const [profileCoverAvatar, setProfileCoverAvatarBottomSheet] = useState(false);
  const [statusPhoto, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();
  const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  // -------------tools-----------------------------
  const { logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  // --------services------------------------------
  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [getSocialLinks, { data: socialMediaData, isFetching: isFetchingSocialMedia }] =
    useLazyGetUserSocialMediasQuery();
  const [getSkills, { data: skillsData, isFetching }] = useLazyGetPersonSkillsQuery();
  const [getExperiences, { data: experienceData, isFetching: isFetchingExprience }] = useLazyGetExperiencesQuery();
  const [getWebSites, { data: websitesData, isFetching: isFetchingWebsite }] = useLazyGetUserWebSitesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getUserEmails, { data: emailData, isFetching: isFetchingEmail }] = useLazyGetUserEmailsQuery();
  const [getUserPhoneNumbers, { data: phoneNumberData, isFetching: isFetchingPhoneNumber }] =
    useLazyGetUserPhoneNumbersQuery();

  useEffect(() => {
    // if (router.query.profile === 'user') {
    getUserDetail({ filter: { dto: {} } });
    getSocialLinks({ filter: { dto: { id: null } } });
    getSkills({ filter: { dto: {} } });
    getExperiences({ filter: { all: true, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] } });
    getWebSites({ filter: { all: true } });
    getCertificates({ filter: { dto: {} } });
    getUserEmails({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    getUserPhoneNumbers({ filter: { dto: { status: VerificationStatusEnum.Confirmed } } });
    // }
  }, [router.query]);
  // useEffect for bottom sheet on cover avatar photo
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
  const experiences = experienceData?.getExpriences?.listDto?.items;
  const skills = skillsData?.getPersonSkills?.listDto?.items;
  const user = userData?.getUser?.listDto?.items?.[0];
  const hometown = user?.personDto?.hometown;
  const currentCity = user?.personDto?.currnetCity;
  const relationship = user?.personDto?.relationship;
  const userExperience = user?.personDto?.experience;
  const currentExperiences = user?.personDto?.personCurrentExperiences;
  const university = user?.personDto?.personUniversities;
  const schools = user?.personDto?.personSchools;
  const emails = emailData?.getUserEmails?.listDto?.items;
  const phoneNumbers = phoneNumberData?.getUserPhoneNumbers?.listDto?.items;
  const hasPublicDetail =
    !!userExperience ||
    !!currentExperiences?.length ||
    !!university?.length ||
    !!schools?.length ||
    !!currentCity ||
    !!hometown ||
    !!relationship;

  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            <CardStyle>
              <CardMedia
                onClick={() => {
                  user?.personDto?.coverUrl
                    ? setProfileChangePhotoBottomSheet(true)
                    : setProfileCoverAvatarBottomSheet(true);
                  setStatusPhoto('cover');
                }}
                component="img"
                alt="Cover Image"
                height={'176px'}
                image={user?.personDto?.coverUrl || '/icons/empty_cover.svg'}
              />

              <CardContentStyle>
                <StackContentStyle>
                  <Avatar
                    onClick={() => {
                      user?.personDto?.avatarUrl
                        ? setProfileChangePhotoBottomSheet(true)
                        : setProfileCoverAvatarBottomSheet(true);
                      setStatusPhoto('avatar');
                    }}
                    alt={user?.personDto?.fullName}
                    src={user?.personDto?.avatarUrl || undefined}
                    sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                  >
                    <Image src="/icons/camera.svg" width={28} height={22} alt="avatar" />
                  </Avatar>

                  <Stack direction={'row'} spacing={0.5} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }} color="text.primary">
                        {user?.personDto?.firstName} {user?.personDto?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.userType}
                      </Typography>
                    </Stack>
                    <Box>
                      <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                        <Typography color={theme.palette.background.paper}>BGD</Typography>
                      </Box>
                    </Box>
                  </Stack>
                  {/* -------------------------{LOCATON AND HEADLINE} -----------------*/}
                  <Stack alignItems="flex-start">
                    <Typography sx={{ mt: 2 }}>
                      <Typography
                        color={theme.palette.text.primary}
                        sx={{
                          ...(!user?.personDto?.currnetCity?.city?.name && {
                            ml: 0,
                          }),
                        }}
                      >
                        {user?.personDto?.currnetCity?.city?.name || 'Your Location'}
                      </Typography>
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                      <Typography
                        color={theme.palette.text.primary}
                        sx={{
                          ...(!user?.personDto?.headline && {
                            ml: 0,
                          }),
                        }}
                      >
                        {user?.personDto?.headline || 'Your Headline'}
                      </Typography>
                    </Typography>
                  </Stack>
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
            {/* <Divider /> */}
          </Grid>
          <Grid item lg={12}>
            <Stack sx={{ backgroundColor: theme.palette.background.paper }}>
              {/* {BUTTONS} */}
              <Divider sx={{ mt: 1.25, mb: 1 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ borderRadius: 1, px: 2, py: 1 }}>
                <Stack direction="row" spacing={1.8}>
                  <NextLink href={PATH_APP.post.createPost.socialPost.index} passHref>
                    <Button size="small" startIcon={<Add color={theme.palette.background.paper} />} variant="contained">
                      <Typography>Add Post</Typography>
                    </Button>
                  </NextLink>
                  <NextLink href="user/edit-profile/edit" passHref>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: (theme) => theme.palette.text.secondary,
                      }}
                      startIcon={<Edit2 color={theme.palette.text.secondary} />}
                    >
                      <Typography color={theme.palette.text.primary}>Edit Profile</Typography>
                    </Button>
                  </NextLink>
                </Stack>
                <IconButton onClick={() => setLogoutBottomSheet(true)}>
                  <More color={theme.palette.text.secondary} />
                </IconButton>
              </Stack>
              <Divider sx={{ mt: 1, mb: 1.25 }} />
              {/*-------------------------------------------- {PUBLIC DETAILS}--------------------------------------- */}
              <Stack spacing={1} sx={{ borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" color={theme.palette.text.primary}>
                    Public Detalis
                  </Typography>
                  {hasPublicDetail && (
                    <NextLink href="user/public-details/list" passHref>
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
                        <Briefcase color={theme.palette.text.secondary} />
                      </IconButton>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        Occupation
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Book1 color={theme.palette.text.secondary} />
                      </IconButton>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        Education
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Location color={theme.palette.text.secondary} />
                      </IconButton>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        Current city
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Location color={theme.palette.text.secondary} />
                      </IconButton>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        Hometown
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton>
                        <Heart color={theme.palette.text.secondary} />
                      </IconButton>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        Relationship
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {currentExperiences?.map((experience) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }} key={experience.id}>
                        <IconButton>
                          <Briefcase color={theme.palette.text.secondary} />
                        </IconButton>
                        <Typography variant="body1" color={theme.palette.text.primary} component="span">
                          {experience?.title}
                          <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                            At {experience?.companyDto?.title}
                          </Typography>
                        </Typography>
                      </Box>
                    ))}

                    {university?.map((uni) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }} key={uni.id}>
                        <IconButton>
                          <Book1 color={theme.palette.text.secondary} />
                        </IconButton>
                        <Typography variant="body1" color={theme.palette.text.primary} component="span">
                          Studied {uni?.concentrationDto?.title}
                          <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                            at {uni?.collegeDto?.name} From {getMonthName(new Date(uni?.startDate))}{' '}
                            {new Date(uni?.startDate).getFullYear()} until{' '}
                            {uni?.endDate
                              ? getMonthName(new Date(uni?.endDate)) + ' ' + new Date(uni?.endDate).getFullYear()
                              : 'Present'}
                          </Typography>
                        </Typography>
                      </Box>
                    ))}
                    {schools?.map((school) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }} key={school.id}>
                        <IconButton>
                          <Book1 color={theme.palette.text.secondary} />
                        </IconButton>
                        <Typography variant="body1" color={theme.palette.text.primary} component="span">
                          Went to {school?.school?.title}
                          {school?.year && (
                            <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                              at {school?.year}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    ))}
                    {currentCity && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Location color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography variant="body1" color={theme.palette.text.primary} component="span">
                          Lives in
                          <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                            {currentCity?.city?.name}
                          </Typography>
                        </Typography>
                      </Box>
                    )}

                    {hometown && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                          <Location color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography variant="body1" color={theme.palette.text.primary} component="span">
                          From
                          <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                            {hometown?.city?.name}
                          </Typography>
                        </Typography>
                      </Box>
                    )}
                    {relationship && (
                      <Box>
                        <IconButton>
                          <Heart color={theme.palette.text.secondary} />
                        </IconButton>

                        <Typography
                          variant="subtitle2"
                          color={theme.palette.text.primary}
                          component="span"
                          sx={{ mr: 1 }}
                        >
                          {relationship?.relationshipStatus?.title}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton>
                    <LoginCurve color={theme.palette.text.primary} />
                  </IconButton>

                  <Typography variant="body1" color={theme.palette.text.primary} component="span">
                    Joined Garden of love at
                    {user?.personDto?.joinDateTime && (
                      <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                        {getMonthName(new Date(user?.personDto?.joinDateTime))}{' '}
                        {new Date(user?.personDto?.joinDateTime).getFullYear()}
                      </Typography>
                    )}
                  </Typography>
                </Box>
                {/* ))} */}

                {!hasPublicDetail && (
                  <Box>
                    <NextLink href="user/public-details/list" passHref>
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
              {/* -----------------------------------{EXPERIENCE} -------------------*/}
              <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                {experiences?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Experiences
                      </Typography>

                      <NextLink href="user/experience/list" passHref>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          Edit
                        </Typography>
                      </NextLink>
                    </Box>

                    {isFetchingExprience ? (
                      <CircularProgress size={20} />
                    ) : (
                      experiences?.slice(0, 1)?.map((experience, index) => (
                        <Box key={experience?.id}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                              {experience?.title} at {experience?.companyDto?.title}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color={theme.palette.text.secondary}>
                              {getMonthName(new Date(experience?.startDate)) +
                                ' ' +
                                new Date(experience?.startDate).getFullYear() +
                                ' - ' +
                                (experience?.endDate
                                  ? getMonthName(new Date(experience?.startDate)) +
                                    ' ' +
                                    new Date(experience?.startDate).getFullYear()
                                  : 'Present ')}
                              {showDifferenceExp(experience?.dateDiff?.years, experience?.dateDiff?.months)}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color={theme.palette.text.secondary}>
                              {experience?.cityDto?.name}
                            </Typography>
                          </Box>

                          <Stack>
                            <Box>
                              {experience?.description && (
                                <ExperienceDescriptionStyle variant="body2">
                                  {experience?.description.split('\n').map((str, i) => (
                                    <p key={i}>{str}</p>
                                  ))}
                                </ExperienceDescriptionStyle>
                              )}
                            </Box>
                            {experience?.mediaUrl && (
                              <ExperienceImage
                                alignItems="center"
                                justifyContent="center"
                                sx={{ mr: 1, borderRadius: 1 }}
                              >
                                <Image src={experience?.mediaUrl} width={328} height={184} alt="experience-picture" />
                              </ExperienceImage>
                            )}
                          </Stack>
                        </Box>
                      ))
                    )}
                    {experiences.length - 1 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                        <NextLink href="user/experience/list" passHref>
                          <Button variant="text" size="small">
                            See {experiences.length - 1} More Experiences
                          </Button>
                        </NextLink>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Experiences
                      </Typography>
                    </Box>
                    <Box>
                      <NextLink href="user/experience/list" passHref>
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
                          Add Experience
                        </Button>
                      </NextLink>
                    </Box>
                  </>
                )}
              </Stack>
              {/* ---------------------------------{CERTIFICATE}--------------------------------------- */}
              <Stack spacing={1} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                {certificates?.length ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        Certificate
                      </Typography>

                      <NextLink href="user/certificate/list" passHref>
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
                        <NextLink href="user/certificate/list" passHref>
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
                      <NextLink href="user/certificate/list" passHref>
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
              {/*---------------------------- {SKILL} ---------------------------------*/}
              <Stack spacing={2} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" color={theme.palette.text.primary}>
                    Skills and Endorsements
                  </Typography>
                  {!!skills?.length && (
                    <NextLink href={'user/skill/skill-list'} passHref>
                      <Typography variant="subtitle1" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        Edit
                      </Typography>
                    </NextLink>
                  )}
                </Box>
                {!!skills?.length ? (
                  <>
                    {skills?.slice(0, 3)?.map((skill) => (
                      <Box key={skill?.skill?.id}>
                        <Typography variant="body2" color={theme.palette.text.primary} sx={{ display: 'flex' }}>
                          {skill?.skill?.title}
                          <Typography variant="body2" sx={{ color: 'primary.main', pl: 1 }}>
                            {!!skill?.endorsementsCount && skill?.endorsementsCount}
                          </Typography>
                        </Typography>
                      </Box>
                    ))}
                    {skills?.length - 3 > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                        <NextLink href="user/skill/skill-list" passHref>
                          <Button variant="text" size="small">
                            See {skills.length - 3} More Skills and Endorsements
                          </Button>
                        </NextLink>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box>
                    <NextLink href="user/skill/skill-list" passHref>
                      <Button
                        fullWidth
                        size="small"
                        startIcon={<Add color={theme.palette.text.secondary} />}
                        variant="outlined"
                        sx={{ height: '40px', color: 'text.primary', borderColor: theme.palette.text.secondary }}
                      >
                        Add Skills and Endorsements
                      </Button>
                    </NextLink>
                  </Box>
                )}
              </Stack>
              {/*----------------------------------- {CONTACT INFO} ------------------------------------*/}
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

                      <NextLink href="user/contact-info/list" passHref>
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
                      <NextLink href="user/contact-info/list" passHref>
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
              {/* -----------------------------------followers ----------------------------------- */}
              <Stack sx={{ backgroundColor: theme.palette.background.paper, pt: 3, pb: 1 }}>
                <Box sx={{ px: 2 }}>
                  <ConnectionOwnProfile />
                </Box>
              </Stack>
              {/*---------------------------------- posts----------------------------------------------- */}
              <Stack sx={{ backgroundColor: theme.palette.background.paper, pt: 2, pb: 2 }}>
                <Box sx={{ px: 2 }}>
                  <ProfilePostTabs />
                </Box>
              </Stack>
              {/*---------------------------------- end sections --------------------------------  */}
            </Stack>
          </Grid>
        </Stack>
      </RootStyle>
      {/* ------------------------------------------bottom sheets---------------------------------- */}
      <BottomSheet open={profileChangePhoto} onDismiss={() => setProfileChangePhotoBottomSheet(false)}>
        <MainProfileChangePhotoUser
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
        <MainProfileCoverAvatarUser
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
              localStorage.removeItem('closeWizard');
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
