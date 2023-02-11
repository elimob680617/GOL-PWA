import { LoadingButton } from '@mui/lab';
import { Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Icon } from 'src/components/Icon';
import { skillUpdated, userSkillSelector } from 'src/redux/slices/profile/userSkill-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { useDeletePersonSkillMutation } from 'src/_requests/graphql/profile/skills/mutations/deletePersonSkill.generated';

interface DeleteSkillProps {
  onChange: () => void;
}

export default function DeleteSkill(props: DeleteSkillProps) {
  const { onChange } = props;
  const [bottomSheetStatus, setBottomSheetStatus] = useState(true);
  // const {userState} = props
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const personskill = useSelector(userSkillSelector);
  const router = useRouter();
  const theme = useTheme();
  const [deletePersonSkill, { isLoading }] = useDeletePersonSkillMutation();
  // mutations !
  const handleDeleteSkill = async () => {
    const resDeleteDate: any = await deletePersonSkill({
      filter: {
        dto: {
          id: personskill?.id,
        },
      },
    });
    if (resDeleteDate?.data?.deletePersonSkill?.isSuccess) {
      enqueueSnackbar('The skill has been successfully deleted', { variant: 'success' });
      dispatch(skillUpdated({}));
      onChange();
      router.push('/profile/user/skill/skill-list');
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  // click on Diskard and go to list
  const handleDiscardSkill = () => {
    dispatch(skillUpdated({}));
    onChange();
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Skill?
          </Typography>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }} alignItems="start">
          <LoadingButton
            loading={isLoading}
            startIcon={<Icon name="trash" color="error.main" />}
            variant="text"
            color="inherit"
            onClick={handleDeleteSkill}
          >
            <Typography variant="body2" color="error">
              Delete Skill
            </Typography>
          </LoadingButton>
          <Button
            variant="text"
            color="inherit"
            startIcon={<Icon name="Close-1" color="grey.500" />}
            onClick={handleDiscardSkill}
          >
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
