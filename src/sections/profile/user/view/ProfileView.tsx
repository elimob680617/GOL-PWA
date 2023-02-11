// @mui
import {
  Avatar,
  AvatarGroup,
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
import { Add, Book1, Briefcase, Heart, Location, LoginCurve, TickCircle } from 'iconsax-react';
import Image from 'next/image';
import reportMessage from 'public/icons/report-message.svg';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import companylogo from 'public/icons/experienceLogo.svg';
import { useEffect, useMemo, useState } from 'react';
import { AccountPrivacyEnum, ConnectionStatusEnum } from 'src/@types/sections/serverTypes';
import useAuth from 'src/hooks/useAuth';
import ConnectionView from 'src/sections/profile/components/ConnectionView';
import PostView from 'src/sections/profile/components/PostView';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetExperiencesQuery } from 'src/_requests/graphql/profile/experiences/queries/getExperiences.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import { useEndorsementSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/endorsementSkill.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getPersonSkills.generated';
import RequestMessage from '../../components/RequestMessage';
import ButtonStatusView from './ButtonStatusView';

const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: 282,
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  width: '100%',
  position: 'absolute',
  top: '120px',
  padding: theme.spacing(2),
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
  minWidth: '270px',
  backgroundColor: theme.palette.grey[100],
}));
const ExperienceLogoImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

export default function ProfileViewNormalUser() {
  const auth = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const _Id = router?.query?.id?.[0];

  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [getExperiences, { data: experienceData, isFetching: isFetchingExprience }] = useLazyGetExperiencesQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getSkills, { data: skillsData, isFetching: isFetchingSkill }] = useLazyGetPersonSkillsQuery();
  const [updateEmdorsmentSkill] = useEndorsementSkillMutation();

  const user = userData?.getUser?.listDto?.items?.[0];

  const userBlockStatus = user?.connectionDto?.meBlockedOther || user?.connectionDto?.otherBlockedMe
  const userIsVisible =
    user?.accountPrivacy === AccountPrivacyEnum.Public ||
    user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;

  useEffect(() => {
    if (_Id) {
      getUserDetail({ filter: { dto: { id: _Id } } });
      if (userIsVisible && !userBlockStatus && !user?.meReportedOther) {
        getSkills({ filter: { dto: { id: _Id } } });
        getExperiences({
          filter: { dto: { userId: _Id }, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] },
        });
        getCertificates({ filter: { dto: { userId: _Id } } });
      }
    }
  }, [
    _Id,
    userIsVisible,
    userBlockStatus,
    getUserDetail,
    user?.meReportedOther,
    getSkills,
    getExperiences,
    getCertificates,
  ]);

  const handleEndorse = async (data: any) => {
    const endorseRes: any = await updateEmdorsmentSkill({
      filter: {
        dto: {
          id: data,
        },
      },
    });
    if (endorseRes?.data?.endorsementSkill?.isSuccess) {
      getSkills({ filter: { dto: { id: _Id } } });
    }
  };

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
  const hometown = user?.personDto?.hometown;
  const currentCity = user?.personDto?.currnetCity;
  const relationship = user?.personDto?.relationship;
  const userExperience = user?.personDto?.experience;
  const currentExperiences = user?.personDto?.personCurrentExperiences;
  const university = user?.personDto?.personUniversities;
  const schools = user?.personDto?.personSchools;
  const emails = user?.contactInfoEmails;
  const phoneNumbers = user?.contactInfoPhoneNumbers;
  const socialMedias = user?.contactInfoSocialLinks;
  const websites = user?.contactInfoWebSites;
  const hasPublicDetail =
    !!userExperience ||
    !!currentExperiences?.length ||
    !!university?.length ||
    !!schools?.length ||
    !!currentCity ||
    !!hometown ||
    !!relationship;
  const hasContactInfo = !!emails?.length || !!phoneNumbers?.length || !!socialMedias?.length || !!websites?.length;

  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            {/* HAS REQUEST MODE CONDITION */}
            {user?.connectionDto?.otherToMeStatus === ConnectionStatusEnum.Requested && (
              <RequestMessage
                fullName={user?.personDto?.firstName || user?.personDto?.fullName}
                itemId={user?.connectionDto?.itemId}
              />
            )}
            {user?.meReportedOther && (
              <Stack
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.spacing(1),
                  padding: theme.spacing(2),
                }}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Image src={reportMessage} alt="" />
                <Typography color="text.secondary" variant="subtitle2">
                  {user?.personDto?.firstName} is reported by you.
                </Typography>
              </Stack>
            )}
            <CardStyle>
              <CardMedia
                component="img"
                alt="Cover Image"
                height={'176px'}
                image={user?.personDto?.coverUrl || '/icons/empty_cover.svg'}
              />
              <CardContentStyle>
                <StackContentStyle>
                  <Avatar
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
                        {!!user?.userType && 'Normal User'}
                      </Typography>
                    </Stack>

                    {userIsVisible && !userBlockStatus && !user?.meReportedOther && (
                      <Box>
                        <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                          <Typography color="background.paper">BGD</Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                  {/* LOCATON AND HEADLINE */}
                  {userIsVisible && !userBlockStatus && !user?.meReportedOther && (
                    <Stack alignItems="flex-start">
                      <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                        {/* handle when current City Exists */}
                        <Typography color={theme.palette.text.primary}>
                          {user?.personDto?.currnetCity?.city?.name}
                        </Typography>
                      </Button>
                      {/* handle when headline Exists */}
                      <Button size="small" variant="text" sx={{ minWidth: 'unset !important' }}>
                        <Typography color={theme.palette.text.primary}>{user?.personDto?.headline}</Typography>
                      </Button>
                    </Stack>
                  )}
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
          </Grid>
          <Grid item lg={12}>
            <Stack spacing={0.25}>
              {/* PRIVACY AND BLOCK MODE CONDITION */}
              {/* =================================={BUTTONS}============================= */}
              <ButtonStatusView user={user} itemId={user?.connectionDto?.itemId} />
              {/* PRIVACY AND BLOCK MODE CONDITION */}
              {userIsVisible && !userBlockStatus && !user?.meReportedOther ? (
                <>
                  {/*-------------------------------------------- {PUBLIC DETAILS}--------------------------------------- */}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {hasPublicDetail && (
                      <>
                        {currentExperiences?.map((experience) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }} key={experience.id}>
                            <IconButton>
                              <Briefcase color={theme.palette.text.primary} />
                            </IconButton>
                            <Typography variant="body2" color={theme.palette.text.primary} component="span">
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
                              <Book1 color={theme.palette.text.primary} />
                            </IconButton>
                            <Typography variant="body2" color={theme.palette.text.primary} component="span">
                              Studied {uni?.concentrationDto?.title}
                              <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                                at {uni?.collegeDto?.name} From {getMonthName(new Date(uni?.startDate))}
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
                              <Book1 color={theme.palette.text.primary} />
                            </IconButton>
                            <Typography variant="body2" color={theme.palette.text.primary} component="span">
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
                              <Location color={theme.palette.text.primary} />
                            </IconButton>

                            <Typography variant="body2" color={theme.palette.text.primary} component="span">
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
                              <Location color={theme.palette.text.primary} />
                            </IconButton>

                            <Typography variant="body2" color={theme.palette.text.primary} component="span">
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
                              <Heart color={theme.palette.text.primary} />
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

                      <Typography variant="body2" color={theme.palette.text.primary} component="span">
                        Joined Garden of love at
                        {user?.personDto?.joinDateTime && (
                          <Typography component="span" variant="subtitle2" sx={{ ml: 0.5 }}>
                            {getMonthName(new Date(user?.personDto?.joinDateTime))}{' '}
                            {new Date(user?.personDto?.joinDateTime).getFullYear()}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* -----------------------------------{EXPERIENCE} -------------------*/}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {experiences?.length ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" color={theme.palette.text.primary}>
                            Experiences
                          </Typography>
                        </Box>

                        {isFetchingExprience ? (
                          <CircularProgress size={20} />
                        ) : (
                          experiences?.slice(0, 1)?.map((experience, index) => (
                            <Box key={experience?.id} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                              <Box>
                                {experience?.companyDto?.logoUrl ? (
                                  <ExperienceLogoImage alignItems="center" justifyContent="center">
                                    <Image
                                      src={experience?.companyDto?.logoUrl}
                                      width={32}
                                      height={32}
                                      alt={experience?.title + index}
                                    />
                                  </ExperienceLogoImage>
                                ) : (
                                  <ExperienceLogoImage alignItems="center" justifyContent="center">
                                    <Image src={companylogo} width={32} height={32} alt={experience?.title + index} />
                                  </ExperienceLogoImage>
                                )}
                              </Box>
                              <Stack>
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
                                    <ExperienceImage sx={{ mr: 1, borderRadius: 1, mt: 2 }}>
                                      <Image
                                        src={experience?.mediaUrl}
                                        width={'100%'}
                                        height={'100%'}
                                        alt="experience-picture"
                                      />
                                    </ExperienceImage>
                                  )}
                                </Stack>
                              </Stack>
                            </Box>
                          ))
                        )}

                        {experiences.length - 1 > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <NextLink href={`exprience/${_Id}`} passHref>
                              <Button variant="text" size="small">
                                See {experiences.length - 1} More Experiences
                              </Button>
                            </NextLink>
                          </Box>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    <Divider />
                  </Stack>

                  {/* ---------------------------------{CERTIFICATE}--------------------------------------- */}
                  {!!certificates?.length && (
                    <Stack
                      spacing={1}
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 1,
                        p: 2,
                      }}
                    >
                      <>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Certificate
                        </Typography>

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
                                  <NextLink
                                    href={'https://' + certificate?.credentialUrl.replace('https://', '')}
                                    passHref
                                  >
                                    <Link target={'_blank'} underline="none">
                                      <Button
                                        size="small"
                                        color="inherit"
                                        variant="outlined"
                                        sx={{
                                          borderColor: 'text.primary',
                                          color: 'text.primary',
                                          mt: 1,
                                          mb: 1,
                                        }}
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
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              pt: 1,
                            }}
                          >
                            <NextLink href={`certificate/${_Id}`} passHref>
                              <Button variant="text" size="small">
                                See {certificates.length - 1} More Certificate
                              </Button>
                            </NextLink>
                          </Box>
                        )}
                      </>
                      <Divider />
                    </Stack>
                  )}

                  {/*---------------------------- {SKILL} ---------------------------------*/}
                  {!!skills?.length && (
                    <Stack
                      spacing={2}
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 1,
                        p: 2,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.primary">
                        Skills
                      </Typography>
                      {isFetchingSkill ? (
                        <CircularProgress size={20} />
                      ) : (
                        <>
                          {skills?.slice(0, 3)?.map((skill) => (
                            <Box key={skill?.skill?.id}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body2" mr={1} color="text.primary" sx={{ display: 'flex' }}>
                                  {skill?.skill?.title}
                                  {/* SHOW NUMBER OF ENDORSMENT PEAPLE */}
                                </Typography>
                                {!!skill?.endorsementsCount && (
                                  <Typography sx={{ color: 'primary.main' }}>{skill?.endorsementsCount}</Typography>
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  sx={{
                                    color: theme.palette.grey[900],
                                    borderColor: theme.palette.grey[300],
                                    py: 0.5,
                                    px: 2.8,
                                    mt: 1,
                                  }}
                                  onClick={() => handleEndorse(skill?.id as any)}
                                >
                                  {skill?.people?.find((person) => person?.id === auth?.user?.id) ? (
                                    <TickCircle size={24} color={theme.palette.grey[700]} />
                                  ) : (
                                    <Add size={24} color={theme.palette.grey[700]} />
                                  )}
                                  <Typography ml={1}>
                                    {skill?.people?.find((person) => person?.id === auth?.user?.id)
                                      ? 'Endorsed'
                                      : 'Endorse'}
                                  </Typography>
                                </Button>
                                {/* SHOW ENDORSMENT PEAPLE HERE */}
                                <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2, ml: 1 }}>
                                  {skill?.people?.map((person, index) => (
                                    <Avatar
                                      alt="Remy Sharp"
                                      src={person?.avatarUrl}
                                      key={skill.id + index}
                                      sx={{ width: 24, height: 24 }}
                                    />
                                  ))}
                                </AvatarGroup>
                                <></>
                              </Box>
                            </Box>
                          ))}
                          {skills?.length - 3 > 0 && (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                pt: 1,
                              }}
                            >
                              <NextLink href={`skill/${_Id}`} passHref>
                                <Button variant="text" size="small">
                                  See {skills.length - 3} More Skills and Endorsements
                                </Button>
                              </NextLink>
                            </Box>
                          )}
                        </>
                      )}
                    </Stack>
                  )}

                  {/*----------------------------------- {CONTACT INFO} ------------------------------------*/}
                  {hasContactInfo && (
                    <Stack
                      spacing={2}
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 1,
                        p: 2,
                      }}
                    >
                      <>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Contact Info
                        </Typography>
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Email
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            emails?.map((email) => (
                              <Typography
                                variant="body2"
                                color={theme.palette.text.primary}
                                sx={{ pl: 1 }}
                                key={email?.id}
                              >
                                {email?.email}
                              </Typography>
                            ))
                          )}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Phone Number
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            phoneNumbers?.map((phone) => (
                              <Typography
                                variant="body2"
                                color={theme.palette.text.primary}
                                sx={{ pl: 1 }}
                                key={phone?.id}
                              >
                                {phone?.phoneNumber}
                              </Typography>
                            ))
                          )}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                            Social Links
                          </Typography>
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            socialMedias?.map((social) => (
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
                          {userFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            websites?.map((webSite) => (
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
                        {(emails?.length > 2 ||
                          phoneNumbers?.length > 2 ||
                          socialMedias?.length > 5 ||
                          websites?.length > 2) && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <NextLink href={`contact-info/${_Id}`} passHref>
                              <Button variant="text" size="small">
                                Show All Contact Info
                              </Button>
                            </NextLink>
                          </Box>
                        )}
                      </>
                    </Stack>
                  )}
                  
                  {/* -----------------------------------followers ----------------------------------- */}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 3, pb: 1 }}>
                    <Box sx={{ px: 2 }}>
                      <ConnectionView Name={user?.personDto?.firstName} />
                    </Box>
                  </Stack>
                  {/*---------------------------------- posts----------------------------------------------- */}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 2, pb: 2 }}>
                    <Box sx={{ px: 2 }}>
                      <PostView Name={user?.personDto?.firstName} />
                    </Box>
                  </Stack>
                </>
              ) : (
                <>
                  <Stack sx={{ backgroundColor: 'background.paper', height: '100vh' }} />
                </>
              )}
            </Stack>
          </Grid>
        </Stack>
      </RootStyle>
    </>
  );
}
