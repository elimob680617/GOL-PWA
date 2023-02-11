// @mui
import { Circle } from '@mui/icons-material';
import { Avatar, Box, Stack, styled, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { DonorType } from 'src/@types/sections/serverTypes';

const ExplainStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  fontSize: '5px',
  margin: '0 0.5rem',
  display: 'flex',
  alignItems: 'center',
}));

interface DonorListProps {
  donors: DonorType[];
}
function DonorsList(props: DonorListProps) {
  const { donors } = props;
  const theme = useTheme();

  return (
    <>
      <Stack>
        {donors?.length ? (
          <Stack spacing={3} sx={{ marginTop: 3 }}>
            {donors?.map((item, index) => (
              <Stack key={index} sx={{ cursor: 'pointer' }} spacing={2} direction="row">
                <Avatar src={item.avatarUrl} sx={{ width: 48, height: 48 }} />
                <Stack spacing={0.5} justifyContent="center">
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" color={theme.palette.text.primary}>
                      {item?.fullName
                        ? item?.fullName
                        : item?.firstName || item?.lastName
                        ? `${item?.firstName} ${item?.lastName}`
                        : ' '}
                    </Typography>
                    <PostTitleDot>
                      <Circle fontSize="inherit" />
                    </PostTitleDot>
                    <Typography variant="caption" color={theme.palette.text.secondary}>
                      {/* {item.donateDate} */}
                    </Typography>
                  </Stack>

                  <ExplainStyle variant="caption">
                    {' '}
                    {item?.isMyConnection
                      ? 'Your connection'
                      : item?.mutualConnections
                      ? `${item?.mutualConnections} mutual connections`
                      : item?.isAnonymous
                      ? ''
                      : ''}
                  </ExplainStyle>
                </Stack>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 6 }} spacing={2}>
            <Box>
              <Image src="/icons/EmptyDialog.svg" width={227} height={227} alt="empty-dialog" />
            </Box>

            <Typography variant="h6" color={theme.palette.text.primary}>
              There is no Donor here
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );
}

export default DonorsList;
