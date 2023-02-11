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
import GoogleMapReact from 'google-map-react';
import { Location, LoginCurve } from 'iconsax-react';
import Image from 'next/image';
import reportMessage from 'public/icons/report-message.svg';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-spring-bottom-sheet/dist/style.css';
import { ConnectionStatusEnum } from 'src/@types/sections/serverTypes';
import MediaCarousel from 'src/components/mediaCarousel';
import ConnectionView from 'src/sections/profile/components/ConnectionView';
import PostView from 'src/sections/profile/components/PostView';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';
import { useLazyGetProjectsQuery } from 'src/_requests/graphql/profile/ngoProject/queries/getProject.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import RequestMessage from '../../components/RequestMessage';
import ButtonStatusView from './ButtonStatusView';
import ActiveCalendar from '/public/icons/mainNGO/active/calendar/24/Outline.svg';
import ActiveCity from '/public/icons/mainNGO/active/City/24/Outline.svg';
import ActiveNGO from '/public/icons/mainNGO/active/NGO/24/Outline.svg';

// --------------------
const CardStyle = styled(Card)(({ theme }) => ({
  minHeight: 282,
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
  position: 'relative',
}));

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
  marginTop: theme.spacing(1),
}));

const ProjectMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

const BioMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));
const BioBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
}));
const MapStyle = styled(Box)(({ theme }) => ({
  width: 328,
  height: 230,
}));
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);
const Marker = ({ lat, lng, text }) => <Box>{text}</Box>;

//////// Maedeh
// const BioStyle = styled(Stack)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: theme.spacing(1),
//   padding: theme.spacing(2),
// }));
// const ConnectionStyle = styled(Stack)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: theme.spacing(1),
//   padding: theme.spacing(2),
// }));
// const PostStyle = styled(Stack)(({ theme }) => ({
//   borderRadius: theme.spacing(1),
// }));

export default function ProfileViewNgo() {
  const [isLoadMore, setIsLoadMore] = useState(true);
  const router = useRouter();
  const _Id = router?.query?.id?.[0];
  const theme = useTheme();

  // bottom sheet   & state for edit photo
  const [, setProfileChangePhotoBottomSheet] = useState(false);
  const [, setProfileCoverAvatarBottomSheet] = useState(false);
  const [, setStatusPhoto] = useState<'cover' | 'avatar' | undefined>();

  // services
  const [getUserDetail, { data: userData, isFetching: userFetching }] = useLazyGetUserDetailQuery();
  const [getCertificates, { data: certificateData, isFetching: isFetchingCertificate }] = useLazyGetCertificatesQuery();
  const [getProjects, { data: projectData, isFetching: isFetchingProject }] = useLazyGetProjectsQuery();

  // useEffect for services
  const ngo = userData?.getUser?.listDto?.items?.[0];
  const userBlockStatus = ngo?.connectionDto?.meBlockedOther || ngo?.connectionDto?.otherBlockedMe;
  // const ngoIsVisible =
  //   ngo?.accountPrivacy === AccountPrivacyEnum.Public ||
  //   ngo?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;

  useEffect(() => {
    if (_Id) {
      getUserDetail({ filter: { dto: { id: _Id } } });
      if (!userBlockStatus && !ngo?.meReportedOther) {
        getProjects({
          filter: { dto: { userId: _Id }, orderByDescendings: [true], orderByFields: ['CreatedDateTime'] },
        });
        getCertificates({ filter: { dto: { userId: _Id } } });
      }
    }
  }, [_Id, getCertificates, getProjects, getUserDetail, ngo?.meReportedOther, userBlockStatus]);

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
  const locatedIn = ngo?.organizationUserDto?.place?.description;
  const size = ngo?.organizationUserDto?.numberRange;
  const EstablishedDate = ngo?.organizationUserDto?.establishmentDate;
  const category = ngo?.organizationUserDto?.groupCategory;
  const emails = ngo?.contactInfoEmails;
  const phoneNumbers = ngo?.contactInfoPhoneNumbers;
  const socialLinks = ngo?.contactInfoSocialLinks;
  const websites = ngo?.contactInfoWebSites;
  const hasContactInfo = !!emails?.length || !!phoneNumbers?.length || !!websites?.length || !!socialLinks?.length;
  const hasPublicDetail = !!category || !!size || !!EstablishedDate || !!locatedIn;

  // -----------------------------------------
  // functions !!
  const handleSeeMoreClick = () => {
    setIsLoadMore(!isLoadMore);
  };

  return (
    <>
      <RootStyle>
        <Stack sx={{ width: '100%' }}>
          <Grid item lg={12}>
            {/* HAS REQUEST MODE CONDITION */}
            {ngo?.connectionDto?.otherToMeStatus === ConnectionStatusEnum.Requested && (
              <RequestMessage fullName={ngo?.organizationUserDto?.fullName} itemId={ngo?.connectionDto?.itemId} />
            )}
            {/* HAS BEEN REPORTED */}
            {ngo?.meReportedOther && (
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
                  {ngo?.organizationUserDto?.fullName} is reported by you.
                </Typography>
              </Stack>
            )}
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
                    variant="rounded"
                    alt={ngo?.organizationUserDto?.fullName}
                    src={ngo?.organizationUserDto?.avatarUrl || undefined}
                    sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                  >
                    <Image src="/icons/camera.svg" width={28} height={22} alt="avatar" />
                  </Avatar>
                  <Stack direction={'row'} spacing={0.5} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography gutterBottom variant="subtitle1" sx={{ mt: 1 }} color="text.primary">
                        {ngo?.organizationUserDto?.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {!!ngo?.userType && 'NGO'}
                      </Typography>
                    </Stack>
                    <Box>
                      <Box sx={{ backgroundColor: 'secondary.main', padding: '16px 8px', borderRadius: 1 }}>
                        <Typography color="background.paper">BGD</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </StackContentStyle>
              </CardContentStyle>
            </CardStyle>
          </Grid>
          <Grid item lg={12}>
            <Stack spacing={0.25}>
              {/* =================================={BUTTONS}============================= */}
              <ButtonStatusView ngo={ngo} itemId={ngo?.connectionDto?.itemId} />
              {/* =================================={CONTENT OF PROFILE}============================= */}
              {/* BLOCK MODE CONDITION */}
              {!userBlockStatus && !ngo?.meReportedOther ? (
                <>
                  {/*============================= Bio =================== */}
                  {!ngo?.organizationUserDto?.bio ? (
                    <></>
                  ) : (
                    <Stack sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Bio
                        </Typography>
                      </Stack>
                      <Box>
                        {isLoadMore &&
                        (ngo?.organizationUserDto?.bio.length > 210 ||
                          ngo?.organizationUserDto?.bio.split('\n').length > 3) ? (
                          <>
                            <BioBriefDescriptionStyle variant="body2">
                              {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                                <p key={i}>{str}</p>
                              ))}
                            </BioBriefDescriptionStyle>
                            <Typography
                              variant="body2"
                              color={theme.palette.info.main}
                              sx={{ cursor: 'pointer' }}
                              onClick={handleSeeMoreClick}
                            >
                              see more
                            </Typography>
                          </>
                        ) : (
                          <BioMoreDescriptionStyle>
                            {ngo?.organizationUserDto?.bio.split('\n').map((str, i) => (
                              <p key={i}>{str}</p>
                            ))}
                          </BioMoreDescriptionStyle>
                        )}
                      </Box>
                    </Stack>
                  )}
                  {/* ============================{PUBLIC DETAILS} =======================*/}
                  <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                    {!hasPublicDetail ? (
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
                    ) : (
                      <>
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
                                  <Box style={{ height: 230, width: 328 }}>
                                    <GoogleMapReact
                                      bootstrapURLKeys={{ key: 'AIzaSyAeD8NNyr1bEJpjKnSHnKJQfj5j8Il7ct8' }}
                                      defaultCenter={{
                                        lat: ngo?.organizationUserDto?.lat,
                                        lng: ngo?.organizationUserDto?.lng,
                                      }}
                                      defaultZoom={13}
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
                      </>
                    )}
                  </Stack>
                  {/* =============================={Projects} ==============================*/}
                  {projects?.length ? (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Projects
                        </Typography>
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
                                {project?.description && (
                                  <>
                                    {isLoadMore &&
                                    (project?.description.length > 210 ||
                                      project?.description.split('\n').length > 3) ? (
                                      <>
                                        <ProjectDescriptionStyle variant="body2">
                                          {project?.description.split('\n').map((str, i) => (
                                            <p key={i}>{str}</p>
                                          ))}
                                        </ProjectDescriptionStyle>
                                        <Typography
                                          variant="body2"
                                          color={theme.palette.info.main}
                                          sx={{ cursor: 'pointer' }}
                                          onClick={handleSeeMoreClick}
                                        >
                                          see more
                                        </Typography>
                                      </>
                                    ) : (
                                      <ProjectMoreDescriptionStyle>
                                        {project?.description.split('\n').map((str, i) => (
                                          <p key={i}>{str}</p>
                                        ))}
                                      </ProjectMoreDescriptionStyle>
                                    )}
                                  </>
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
                          <NextLink href={`project/${_Id}`} passHref>
                            <Button variant="text" size="small">
                              See {projects.length - 1} More Projects
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </Stack>
                  ) : (
                    <></>
                  )}
                  {/* =============================={CERTIFICATE} ===========================*/}
                  {certificates?.length ? (
                    <Stack spacing={1} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" color={theme.palette.text.primary}>
                          Certificate
                        </Typography>
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
                                <NextLink
                                  href={'https://' + certificate?.credentialUrl.replace('https://', '')}
                                  passHref
                                >
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
                          <NextLink href={`certificate/${_Id}`} passHref>
                            <Button variant="text" size="small">
                              See {certificates.length - 1} More Certificate
                            </Button>
                          </NextLink>
                        </Box>
                      )}
                    </Stack>
                  ) : (
                    <></>
                  )}
                  {/* =============================={CONTACT INFO}======================== */}
                  {!!hasContactInfo && (
                    <Stack spacing={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" color={theme.palette.text.primary}>
                            Contact Info
                          </Typography>
                        </Box>
                        {!!emails?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              Email
                            </Typography>
                            {userFetching ? (
                              <CircularProgress size={20} />
                            ) : (
                              emails?.slice(0, 2)?.map((email) => (
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
                        )}
                        {!!phoneNumbers?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              Phone Number
                            </Typography>
                            {userFetching ? (
                              <CircularProgress size={20} />
                            ) : (
                              phoneNumbers?.slice(0, 2)?.map((phone) => (
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
                        )}
                        {!!socialLinks?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              Social Links
                            </Typography>
                            {userFetching ? (
                              <CircularProgress size={20} />
                            ) : (
                              socialLinks?.slice(0, 5)?.map((social) => (
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
                        )}
                        {!!websites?.length && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ pl: 1, color: 'primary.main', pb: 1 }}>
                              Website
                            </Typography>
                            {userFetching ? (
                              <CircularProgress size={20} />
                            ) : (
                              websites?.slice(0, 2)?.map((webSite) => (
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
                        )}
                      </>
                      {((emails && emails?.length > 2) ||
                        (phoneNumbers && phoneNumbers?.length > 2) ||
                        (socialLinks && socialLinks?.length > 5) ||
                        (websites && websites?.length > 2)) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                          <Button variant="text" size="small" onClick={() => router.push(`contact-info/${_Id}`)}>
                            See All Contact Info
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  )}
                  {/*================================= Followers =============================*/}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 1, pb: 1 }}>
                    <Box sx={{ px: 2 }}>
                      <ConnectionView Name={ngo?.organizationUserDto?.fullName} />
                    </Box>
                  </Stack>
                  {/*================================= post =============================*/}
                  <Stack sx={{ backgroundColor: 'background.paper', pt: 1, pb: 2 }}>
                    <Box sx={{ px: 2 }}>
                      <PostView Name={ngo?.organizationUserDto?.fullName} />
                    </Box>
                  </Stack>
                  {/* ------------------------------- ENd sections----------------------------------------- */}
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
