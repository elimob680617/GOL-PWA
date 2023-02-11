import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { ISkil } from 'src/@types/skill';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetSkillsQuery } from 'src/_requests/graphql/profile/skills/queries/getSkills.generated';

const ElipsesText = styled(Typography)(({ theme }) => ({
  //   position: 'relative',
  //   '&:focus, &:hover': {
  //     overflow: 'visible',
  //     color: 'transparent',
  //     '&:after': {
  //       content: 'attr(data-text)',
  //       overflow: 'visible',
  //       textOverflow: 'inherit',
  //       position: 'absolute',
  //       left: '0',
  //       top: '0',
  //       whiteSpace: 'normal',
  //       wordWrap: 'break-word',
  //       display: 'block',
  //       zIndex: 2,
  //       color: theme.palette.text.primary,
  //       maxWidth: 'min-content',
  //       backgroundColor: theme.palette.background.paper,
  //       boxShadow: '0 2px 4px 0 rgba(0,0,0,.28)',
  //       padding: theme.spacing(1),
  //       borderRadius: theme.spacing(1),
  //     },
  //   },
}));

interface ISkillFilterProps {
  selectedSkills: ISkil[];
  skillSelected: (skill: ISkil) => void;
  skillRemoved: (skill: ISkil) => void;
}

const SkillFilter: FC<ISkillFilterProps> = ({ selectedSkills, skillRemoved, skillSelected }) => {
  const [searchedValue, setSearchedValue] = useState<string | null>(null);
  const searchedSkillDebouncedValue = useDebounce<string>(searchedValue, 500);

  const [getSkills, { isFetching: gettingSkillLoading, data: skills }] = useLazyGetSkillsQuery();

  useEffect(() => {
    if (!searchedSkillDebouncedValue) return;
    getSkills({ filter: { dto: { title: searchedSkillDebouncedValue },pageIndex:1,pageSize:5 } });
  }, [searchedSkillDebouncedValue]);

  const checkChecked = (skill: ISkil) => selectedSkills.some((i) => i === skill);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="skill"
        placeholder="Skill"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/icons/Research/research.svg" width={24} height={24} alt="search" />
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedSkills.map((skill) => (
          <Chip
            key={`selected-skill-${skill.id}`}
            label={skill.title}
            onDelete={() => skillRemoved(skill)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>
      {gettingSkillLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!gettingSkillLoading && searchedSkillDebouncedValue && (
        <>
          {skills?.getSkills?.listDto?.items.map((skill) => (
            <Stack key={skill.id} alignItems="center" direction="row" spacing={1}>
              <Checkbox
                checked={checkChecked(skill)}
                onChange={() => (checkChecked(skill) ? skillRemoved(skill) : skillSelected(skill))}
              />
              <Avatar sx={{ width: 32, height: 32 }}>{skill.title[0]}</Avatar>
              <Tooltip title={skill.title}>
                <ElipsesText noWrap data-text={skill.title} variant="subtitle2" color="text.primary">
                  {skill.title}
                </ElipsesText>
              </Tooltip>
            </Stack>
          ))}
        </>
      )}

      {!searchedSkillDebouncedValue && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            Start typing to find your Skill
          </Typography>
        </Stack>
      )}

      {searchedSkillDebouncedValue && !gettingSkillLoading && skills?.getSkills?.listDto?.items.length === 0 && (
        <Stack sx={{ marginTop: '48px!important' }} alignItems="center" justifyContent="center ">
          <Typography variant="body2" color="grey.500">
            No Result Found
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default SkillFilter;
