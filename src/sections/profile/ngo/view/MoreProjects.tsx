import { Box, Button, CircularProgress, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { Add, ArrowLeft } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import {
  useGetProjectsQuery,
  useLazyGetProjectsQuery,
} from 'src/_requests/graphql/profile/ngoProject/queries/getProject.generated';
import { useGetMediasQuery } from 'src/_requests/graphql/profile/ngoProject/queries/getMedias.generated';
import { iteratorSymbol } from 'immer/dist/internal';
import MediaCarousel from 'src/components/mediaCarousel';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

const ProjectWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ProjectImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));

const ProjectBriefDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
}));
const ProjectMoreDescriptionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(1),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

function MoreProjects() {
  const router = useRouter();
  const theme = useTheme();
  const [isLoadMore, setIsLoadMore] = useState(true);
  const dispatch = useDispatch();

  // queries
  const [getProjects, { data, isFetching }] = useLazyGetProjectsQuery();
  const { data: mediaData, isFetching: mediaFetching } = useGetMediasQuery({
    filter: {
      all: true,
    },
  });

  useEffect(() => {
    getProjects({
      filter: { all: true },
    });
  }, []);

  const projects = data?.getProjects?.listDto?.items;
  const medias = mediaData?.getMedias?.listDto?.items;

  const showDifferenceExp = (year: number, month: number) => {
    if (year === 0 && month === 0) return null;
    let finalValue = '';

    if (year > 0) finalValue = `${year} Year${year > 1 ? 's' : ''}  `;
    if (month > 0) finalValue += `${month} Month${month > 1 ? 's' : ''}`;
    return <span>&#8226; {finalValue}</span>;
  };

  const handleSeeMoreClick = () => {
    setIsLoadMore(!isLoadMore);
  };

  return (
    <>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={2} direction="row" alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft color={theme.palette.text.primary} />
          </IconButton>
          <Typography variant="subtitle1">Project</Typography>
        </Stack>
      </Stack>
      <Divider />

      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        projects?.map((project, index) => (
          <Box key={project?.id}>
            <ProjectWrapperStyle spacing={1} direction="row">
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {project?.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {getMonthName(new Date(project?.startDate)) +
                    ' ' +
                    new Date(project?.startDate).getFullYear() +
                    ' - ' +
                    (project?.endDate
                      ? getMonthName(new Date(project?.endDate)) + ' ' + new Date(project?.endDate).getFullYear()
                      : 'Present')}{' '}
                  {showDifferenceExp(project?.dateDiff?.years, project?.dateDiff?.months)}
                </Typography>
                {project?.cityDto && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {project?.cityDto?.name}
                  </Typography>
                )}
                {project?.description && (
                  <>
                    {isLoadMore &&
                    (project?.description.length > 210 || project?.description.split('\n').length > 3) ? (
                      <>
                        <ProjectBriefDescriptionStyle variant="body2">
                          {project?.description.split('\n').map((str, i) => (
                            <p key={i}>{str}</p>
                          ))}
                        </ProjectBriefDescriptionStyle>
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
                {
                  project?.projectMedias.length > 0 && (
                    // project.projectMedias.map((item) => (
                    <Box maxHeight={152} maxWidth={271} mx={'auto'} mb={2} py={0} my={5}>
                      <MediaCarousel media={project?.projectMedias} dots height={184} width={328} />
                    </Box>
                  )
                  // ))
                }
              </Stack>
            </ProjectWrapperStyle>
            {index < projects?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </>
  );
}

export default MoreProjects;
