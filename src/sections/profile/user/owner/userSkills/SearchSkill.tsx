import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { useDispatch } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useCreatePersonSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/createPersonSkill.generated';
import { useCreateSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/createSkill.generated';
import { useLazyGetSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getSkills.generated';

interface SearchSkill {
  onChange: () => void;
}

export default function SearchSkill(props: SearchSkill) {
  const { onChange } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const [getSkills, { data: getSkillsData, isFetching }] = useLazyGetSkillsQuery();
  const [createSkill, { isLoading: createLoading }] = useCreateSkillMutation();
  const [createPersonSkill, { isLoading: personSkillLoading }] = useCreatePersonSkillMutation();

  // Query
  const handleChangeInputSearch = (val: string) => {
    // is typing status
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    // Query
    if (val.length > 2)
      debounceFn(() =>
        getSkills({
          filter: {
            dto: {
              title: val,
            },
          },
        })
      );
  };

  // mutations!
  const handleChange = async (value: any & { inputValue?: string }) => {
    if (value.inputValue) {
      const resData: any = await createSkill({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (resData?.data?.createSkill?.isSuccess) {
        const newSkillId = resData?.data?.createSkill?.listDto?.items?.[0];
        await createPersonSkill({
          filter: {
            dto: {
              skillId: newSkillId.id,
            },
          },
        });
      }
    } else {
      await createPersonSkill({
        filter: {
          dto: {
            skillId: value.id,
          },
        },
      });
    }
    onChange();
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Skill
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <AutoCompleteAddable
            autoFocus
            loading={isFetching}
            onInputChange={(ev, val) => handleChangeInputSearch(val)}
            onChange={(ev, val) => handleChange(val)}
            options={getSkillsData?.getSkills?.listDto?.items || []}
            placeholder="Skill Name"
          />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              {!isTyping && (
                <Typography color="text.secondary" variant="body2">
                  Start typing to find your Skill Name
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
