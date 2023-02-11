import { Box, Button, CircularProgress, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Add, ArrowLeft2, TickCircle } from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useEndorsementSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/endorsementSkill.generated';
import { useLazyGetPersonSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getPersonSkills.generated';

const SkillListBoxStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

export default function SkillListView() {
  const router = useRouter();
  const ID = router?.query?.id?.[0];
  const theme = useTheme();
  const auth = useAuth();

  // query
  const [getSkills, { data, isFetching }] = useLazyGetPersonSkillsQuery();
  const [updateEmdorsmentSkill, { isLoading }] = useEndorsementSkillMutation();

  useEffect(() => {
    getSkills({
      filter: {
        dto: { id: ID },
      },
    });
  }, [ID, getSkills]);

  console.log(auth);

  const personSkillData = data?.getPersonSkills?.listDto?.items;
  const handleEndorse = async (data: any) => {
    const endorseRes: any = await updateEmdorsmentSkill({
      filter: {
        dto: {
          id: data,
        },
      },
    });
    if (endorseRes?.data?.endorsementSkill?.isSuccess) {
      getSkills({
        filter: {
          dto: { id: ID },
        },
      });
    }
  };

  return (
    <SkillListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={3} spacing={2}>
        <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
          <ArrowLeft2 color={theme.palette.grey[500]} />
        </IconButton>
        <Typography variant="body1">Skills and Endorsements</Typography>
      </Stack>
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress sx={{ m: 8 }} />
        </Stack>
      ) : (
        <Stack mt={1} sx={{ pb: 3 }}>
          {personSkillData?.map((skill) => (
            <Box key={skill?.id}>
              <Stack sx={{ px: 2, py: 2 }} direction="row" justifyContent="space-between">
                <Stack>
                  <Stack spacing={1} direction="row">
                    <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                      {skill?.skill?.title}
                    </Typography>
                    {!!skill?.endorsementsCount && (
                      <Typography color="primary.main">{skill?.endorsementsCount}</Typography>
                    )}
                  </Stack>
                  <Stack spacing={1} direction="row" alignItems="center">
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
                      {/* IF IT WAS ENDORSED BEFORE SET TICK ICON INSTEAD OF ADD */}

                      {!!skill?.people || skill?.people?.find((person) => person.id === auth.user.id) ? (
                        <TickCircle size={24} color={theme.palette.grey[700]} />
                      ) : (
                        <Add size={24} color={theme.palette.grey[700]} />
                      )}

                      <Typography ml={1}>
                        {skill?.people?.find((person) => person.id === auth.user.id) ? 'Endorsed' : 'Endorse'}
                      </Typography>
                    </Button>
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
                  </Stack>
                </Stack>
              </Stack>
              <Divider />
            </Box>
          ))}
        </Stack>
      )}
    </SkillListBoxStyle>
  );
}
