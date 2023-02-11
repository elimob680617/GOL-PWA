import { Box, Button, CircularProgress, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { Icon } from 'src/components/Icon';
import { skillUpdated } from 'src/redux/slices/profile/userSkill-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useLazyGetPersonSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getPersonSkills.generated';
import DeleteSkill from './DeleteSkill';
import SearchSkill from './SearchSkill';

const NoResultStyle = styled(Stack)(({ theme }) => ({
  maxWidth: 164,
  maxHeight: 164,
  width: 164,
  height: 164,
  background: theme.palette.grey[100],
  borderRadius: '100%',
}));

export default function SkillList() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  // bottom sheet
  const [searchSkillBottomSheet, setSearchSkillBottomSheet] = useState(false);
  const [deleteSkillBottomSheet, setDeleteSkillBottomSheet] = useState(false);
  // query
  const [getSkills, { data, isFetching }] = useLazyGetPersonSkillsQuery();

  useEffect(() => {
    if (!searchSkillBottomSheet && !deleteSkillBottomSheet)
      getSkills({
        filter: {
          dto: {},
        },
      });
  }, [searchSkillBottomSheet, deleteSkillBottomSheet]);

  const personSkillData = data?.getPersonSkills?.listDto?.items;

  // navigate and send data to Redux
  const handleDeleteBottomSheet = (personSkill: any) => {
    dispatch(skillUpdated(personSkill));
    setDeleteSkillBottomSheet(true);
  };

  const handleNavigationEndorsement = (url: string, personSkill: any) => {
    dispatch(skillUpdated(personSkill));
    router.push(url);
  };
  return (
    <>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={2} direction="row" alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router.push(PATH_APP.user.profile)}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle1">Skills and Endorsements</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          {/* FIXME add primary variant to button variants */}
          {!!personSkillData?.length && (
            <Button variant="contained" onClick={() => setSearchSkillBottomSheet(true)}>
              <Typography variant="button">Add</Typography>
            </Button>
          )}
        </Stack>
      </Stack>
      <Divider />
      {isFetching ? (
        <CircularProgress sx={{ m: 8 }} />
      ) : !personSkillData?.length ? (
        <Stack sx={{ py: 6, minHeight: '390px' }} alignItems="center" justifyContent="center">
          <NoResultStyle alignItems="center" justifyContent="center">
            <Typography variant="subtitle1" sx={{ color: (theme) => 'text.secondary', textAlign: 'center' }}>
              No result
            </Typography>
          </NoResultStyle>
          <Box sx={{ mt: 3 }} />

          <Button
            onClick={() => setSearchSkillBottomSheet(true)}
            variant="text"
            startIcon={<Icon name="Plus" color="info.main" />}
          >
            <Typography color="info.main">Add Skills and Endorsements</Typography>
          </Button>
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {personSkillData?.map((item) => (
            <Box key={item?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack>
                  <Stack spacing={1} direction="row">
                    <Typography
                      variant="body2"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleNavigationEndorsement('endorsement-list', item)}
                    >
                      {item?.skill?.title}
                    </Typography>
                    {!!item?.endorsementsCount && <Typography color="green">{item?.endorsementsCount}</Typography>}
                  </Stack>
                  <AvatarGroup spacing="small" max={5} sx={{ flexDirection: 'row', pl: 2 }}>
                    {item?.people?.map((person, index) => (
                      <Avatar alt="Remy Sharp" src={person?.avatarUrl} key={item.id + index} />
                    ))}
                  </AvatarGroup>
                </Stack>
                <Box onClick={() => handleDeleteBottomSheet(item)}>
                  <Icon name="trash" color="text.primary" />
                </Box>
              </Stack>
              <Divider />
            </Box>
          ))}
        </Stack>
      )}
      <BottomSheet
        open={searchSkillBottomSheet}
        onDismiss={() => setSearchSkillBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2.5}
      >
        <SearchSkill
          onChange={() => {
            setSearchSkillBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={deleteSkillBottomSheet} onDismiss={() => setDeleteSkillBottomSheet(false)}>
        <DeleteSkill
          onChange={() => {
            setDeleteSkillBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}
