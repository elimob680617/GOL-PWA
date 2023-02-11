import { Box, CircularProgress, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import companylogo from 'public/companylogo/Vector.png';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Experience } from 'src/@types/sections/serverTypes';
import { experienceAdded } from 'src/redux/slices/profile/userExperiences-slice';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetExperiencesQuery } from 'src/_requests/graphql/profile/experiences/queries/getExperiences.generated';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

// const NoResultStyle = styled(Stack)(({ theme }) => ({
//   maxWidth: 164,
//   maxHeight: 164,
//   width: 164,
//   height: 164,
//   background: theme.palette.grey[100],
//   borderRadius: '100%',
// }));

const ExperienceWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const ExperienceListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

const ExperienceImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));

const ExperienceBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
}));
const ExperienceMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

function ExperienceListView() {
  const router = useRouter();
  const ID = router?.query?.id?.[0];
  const theme = useTheme();
  const [isSeeMore, setIsLoadMore] = useState<Record<string, boolean>>({});

  const [getExperiences, { data, isFetching }] = useLazyGetExperiencesQuery();

  useEffect(() => {
    getExperiences({
      filter: {
        dto: { userId: ID },
      },
    });
  }, []);

  const experiences = data?.getExpriences?.listDto?.items;
  // const handleRouting = (exp: Experience) => {
  //   dispatch(experienceAdded(exp));
  //   setTimeout(() => router.push(PATH_APP.profile.user.experience.add), 1);
  // };

  const handleSeeMoreClick = (key: string) => {
    setIsLoadMore({ ...isSeeMore, [key]: true });
  };

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (finalValue && month) finalValue += 'and ';
    if (month > 0) finalValue += ` ${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  return (
    // <Dialog fullWidth maxWidth="sm" open onClose={() => router.push(PATH_APP.profile.user.root)}>
    <ExperienceListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
          <ArrowLeft2 color={theme.palette.grey[500]} />
        </IconButton>
        <Typography variant="body1">Experience</Typography>
      </Stack>

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        experiences?.map((experience, index) => (
          <Box key={experience?.id}>
            <ExperienceWrapperStyle spacing={1} direction="row">
              {experience?.companyDto?.logoUrl ? (
                <ExperienceImage alignItems="center" justifyContent="center">
                  <Image src={experience?.companyDto?.logoUrl} width={32} height={32} alt={experience?.title + index} />
                </ExperienceImage>
              ) : (
                <ExperienceImage alignItems="center" justifyContent="center">
                  <Image src={companylogo} width={32} height={32} alt={experience?.title + index} />
                </ExperienceImage>
              )}
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {experience?.title} at {experience?.companyDto?.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {getMonthName(new Date(experience?.startDate)) +
                    ' ' +
                    new Date(experience?.startDate).getFullYear() +
                    ' - ' +
                    (experience?.endDate
                      ? getMonthName(new Date(experience?.endDate)) + ' ' + new Date(experience?.endDate).getFullYear()
                      : 'Present')}{' '}
                  {showDifferenceExp(experience?.dateDiff?.years, experience?.dateDiff?.months)}
                </Typography>
                {experience?.cityDto && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {experience?.cityDto?.name}
                  </Typography>
                )}
                {experience?.description && (
                  <>
                    {!isSeeMore[experience?.id] &&
                    (experience?.description.length > 210 || experience?.description.split('\n').length > 3) ? (
                      <>
                        <ExperienceBriefDescriptionStyle variant="body2">
                          {experience?.description.split('\n').map((str, i) => (
                            <p key={i}>{str}</p>
                          ))}
                        </ExperienceBriefDescriptionStyle>
                        <Typography
                          variant="body2"
                          color={theme.palette.info.main}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleSeeMoreClick(experience?.id)}
                        >
                          see more
                        </Typography>
                      </>
                    ) : (
                      <ExperienceMoreDescriptionStyle>
                        {experience?.description.split('\n').map((str, i) => (
                          <p key={i}>{str}</p>
                        ))}
                      </ExperienceMoreDescriptionStyle>
                    )}
                  </>
                )}
                {experience.mediaUrl && (
                  <Box maxHeight={152} maxWidth={271} mx={'auto'} mb={2} py={1}>
                    <img src={experience.mediaUrl} width={271} height={152} alt="" />
                  </Box>
                )}
              </Stack>
            </ExperienceWrapperStyle>
            {index < experiences?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </ExperienceListBoxStyle>
    // </Dialog>
  );
}

export default ExperienceListView;
