import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, VFC } from 'react';
import DatePicker from 'src/components/DatePicker';
import { userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';

interface ExperienceDateDialogProps {
  isEndDate?: boolean;
  onChange: (value: Date) => void;
  startDate?:string;
  endDate?:string;
}

const ExperienceDate: VFC<ExperienceDateDialogProps> = (props) => {
  const { isEndDate = false, onChange  , startDate , endDate} = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router.push('/profile/user/experience/list');
  }, [experienceData, router]);

  const handleChange = (date: Date) => {
    onChange(date);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">{!isEndDate ? 'Start Date' : 'End Date'}</Typography>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          value={
            isEndDate
              ? endDate
                ? new Date(endDate)
                : new Date()
              : startDate
              ? new Date(startDate)
              : undefined
          }
          minDate={isEndDate && startDate ? new Date(startDate) : undefined}
          maxDate={!isEndDate && endDate ? new Date(endDate) : undefined}
          views={['month', 'year']}
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default ExperienceDate;
