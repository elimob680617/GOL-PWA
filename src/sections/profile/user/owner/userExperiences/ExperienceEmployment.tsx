import { Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { EmploymentTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';

interface EmploymentProps {
  onChange: (value: EmploymentTypeEnum) => void;
}

function ExperienceEmployment(props: EmploymentProps) {
  const { onChange } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router.push('/profile/user/experience/list');
  }, [experienceData, router]);

  const handleSelectEmployment = (emp: keyof typeof EmploymentTypeEnum) => {
    onChange(EmploymentTypeEnum[emp]);
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2" color="text.primary">
              Employment Type
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Stack
            spacing={1.5}
            direction="row"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleSelectEmployment('FullTime' as keyof typeof EmploymentTypeEnum)}
          >
            <Icon name="Full-Time" color="grey.700" />
            <Typography variant="body2">Full Time</Typography>
          </Stack>
          <Stack
            spacing={1.5}
            direction="row"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleSelectEmployment('PartTime' as keyof typeof EmploymentTypeEnum)}
          >
            <Icon name="Part-time" color="grey.700" /> <Typography variant="body2">Part Time</Typography>
          </Stack>
          <Stack
            spacing={1.5}
            direction="row"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleSelectEmployment('Freelance' as keyof typeof EmploymentTypeEnum)}
          >
            <Icon name="Freelancer" color="grey.700" /> <Typography variant="body2">Freelance</Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default ExperienceEmployment;
