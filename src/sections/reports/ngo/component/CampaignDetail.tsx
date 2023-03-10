import { FC, useEffect } from 'react';
//mui
import { Box, Stack, styled, Typography } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
//icon
import { Icon } from 'src/components/Icon';
//service
import { useRouter } from 'next/router';
import { useLazyGetCampaignDetailsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignDetailsInfo.generated';
//...........................................................
//..style
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
}));
const TotalItemStyle = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
  marginRight: theme.spacing(3),
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  width: '100%',
}));

const CampaignDetail: FC<{ campaignId: string }> = ({ campaignId }) => {
  const { push } = useRouter();
  const [getCampaignDetailsInfo, { data: campaignDetailsInfoData }] = useLazyGetCampaignDetailsInfoQuery();
  const campaignDetailsInfo = campaignDetailsInfoData?.getCampaignDetailsInfo?.listDto?.items?.[0];
  const raisedMoneyNum = Number(campaignDetailsInfo?.raisedFund);
  const targetNum = Number(campaignDetailsInfo?.target);
  //..................useEffect
  useEffect(() => {
    if (campaignId) {
      getCampaignDetailsInfo({ filter: { dto: { campaignId: campaignId } } });
    }
  }, [campaignId, getCampaignDetailsInfo]);
  //.............
  const handelRouteDonorList = () => {
    localStorage.setItem('idCampaign', campaignId);
    push('/campaigns/reports/donorList');
  };

  return (
    <>
      <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, m: 2 }}>
        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 3 }}>
          {campaignDetailsInfo?.campaignName ? campaignDetailsInfo?.campaignName : '-'}
        </Typography>
        {!!campaignDetailsInfo?.raisedFund ? (
          <>
            <Typography variant="subtitle2" color="primary.main" sx={{ mb: 2 }}>
              ${campaignDetailsInfo?.raisedFund?.toLocaleString()} raised of $
              {campaignDetailsInfo?.target?.toLocaleString()}
            </Typography>

            {!(campaignDetailsInfo?.raisedFund === campaignDetailsInfo?.target) ? (
              <BorderLinearProgress
                variant="determinate"
                value={(raisedMoneyNum / targetNum) * 100}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            ) : (
              <BorderLinearProgress
                variant="determinate"
                value={(raisedMoneyNum / targetNum) * 100}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    bgcolor: 'warning.dark',
                  },
                }}
              />
            )}
          </>
        ) : (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="primary.main">
              $0 raised of $999,999,999
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={0}
              sx={{
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  backgroundColor: 'primary.main',
                },
              }}
            />
          </Stack>
        )}

        <Stack direction={'row'} mt={4} mb={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.primary">
            {!!campaignDetailsInfo?.donors ? `${campaignDetailsInfo?.donors} people donated.` : ' No donation.'}
          </Typography>
          <Box sx={{ bgcolor: 'background.neutral', p: 1, borderRadius: 0.5 }}>
            <Typography variant="subtitle2" color="primary.dark">
              {campaignDetailsInfo?.daysLeft}
            </Typography>
          </Box>
        </Stack>
        <Stack direction={'row'} sx={{ alignItems: 'center' }} mb={3}>
          {!!campaignDetailsInfo?.numberOfRates && !!campaignDetailsInfo?.numberOfRates ? (
            <>
              <Icon name="star" type="solid" color="secondary.main" />
              <Typography variant="subtitle2" color="warning.dark" sx={{ mr: 0.5, ml: 0.5 }}>
                {campaignDetailsInfo?.averageRate}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, ml: 0.5 }}>
                ({campaignDetailsInfo?.numberOfRates} Rated)
              </Typography>
            </>
          ) : (
            <>
              <Icon name="star" type="solid" />
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, ml: 0.5 }}>
                (No rate)
              </Typography>
            </>
          )}
        </Stack>

        {/*.....................donorList */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onClick={handelRouteDonorList}
          sx={{ mb: 3 }}
        >
          <Typography variant="button" color="info.main">
            Donors List
          </Typography>
          <Box sx={{ cursor: 'pointer' }}>
            <Icon name="right-arrow-1" color="info.main" />
          </Box>
        </Stack>

        {/*.....................itemsTotal */}
        <Stack spacing={2}>
          {/*...Engagement */}
          <TotalItemStyle>
            <Stack direction="row" spacing={1}>
              <Icon name="engagement-percent" color="grey.500" />
              <Typography variant="body2" color="text.primary">
                Engagement Precentage
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.engagementPercent}
            </Typography>
          </TotalItemStyle>
          {/*...Impression */}
          <TotalItemStyle>
            <Stack direction="row" spacing={1}>
              <Icon name="impression" color="grey.500" />
              <Typography variant="body2" color="text.primary">
                Impression
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.impression}
            </Typography>
          </TotalItemStyle>
          {/*...Likes */}
          <TotalItemStyle>
            <Stack direction="row" spacing={1}>
              <Icon name="heart" color="grey.500" />
              <Typography variant="body2" color="text.primary">
                Likes
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfLikes}
            </Typography>
          </TotalItemStyle>
          {/*...Comments */}
          <TotalItemStyle>
            <Stack direction="row" spacing={1}>
              <Icon name="comment" color="grey.500" />
              <Typography variant="body2" color="text.primary">
                Comments
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfComments}
            </Typography>
          </TotalItemStyle>
          {/*...Saved */}
          <TotalItemStyle>
            <Stack direction="row" spacing={1}>
              <Icon name="Save" color="grey.500" />
              <Typography variant="body2" color="text.primary">
                Saved
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfSaved}
            </Typography>
          </TotalItemStyle>
          {/*...Shared */}
          <TotalItemStyle>
            <Stack direction="row" spacing={1}>
              <Icon name="Reshare" color="grey.500" />
              <Typography variant="body2" color="text.primary">
                Shared
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="text.primary">
              {campaignDetailsInfo?.numberOfReshared}
            </Typography>
          </TotalItemStyle>
        </Stack>
      </Stack>
    </>
  );
};

export default CampaignDetail;
