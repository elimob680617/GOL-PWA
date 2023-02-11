import { Divider, FormControl, FormControlLabel, Stack, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';

interface AudienceProps {
  onChange: (value: AudienceEnum) => void;
  audience: AudienceEnum;
}

export default function SelectAudienceCertificate(props: AudienceProps) {
  const { onChange, audience } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const userCertificate = useSelector(userCertificateSelector);
  const theme = useTheme();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router.back();
  }, [userCertificate, router]);

  function changeAudienceHandler(e) {
    onChange(e.target.value);
  }
  return (
    <Stack spacing={2} sx={{ pt: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          Privacy
        </Typography>
      </Stack>
      <Divider />
      <Stack>
        <FormControl sx={{ mb: 2 }}>
          <RadioGroup
            onChange={changeAudienceHandler}
            value={audience}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            <FormControlLabel value={AudienceEnum.Public} control={<Radio />} label={'Public'} sx={{ ml: 1, mt: 1 }} />
            <FormControlLabel
              value={AudienceEnum.Private}
              control={<Radio />}
              label={'Private'}
              sx={{ ml: 1, mt: 1 }}
            />
            <FormControlLabel value={AudienceEnum.OnlyMe} control={<Radio />} label={'Only me'} sx={{ ml: 1, mt: 1 }} />
            <FormControlLabel
              value={AudienceEnum.SpecificFollowes}
              control={<Radio />}
              label={'Specific followers'}
              sx={{ ml: 1, mt: 1 }}
            />
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
              Select Specific followers as your audience
            </Typography>

            <FormControlLabel
              value={AudienceEnum.ExceptFollowes}
              control={<Radio />}
              label={'All followers except'}
              sx={{ ml: 1, mt: 1 }}
            />
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
              Select followers that you dont want as an audience
            </Typography>
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}
