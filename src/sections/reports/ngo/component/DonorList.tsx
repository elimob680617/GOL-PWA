import React, { useEffect } from 'react';
//mui
import { IconButton, Stack, Typography } from '@mui/material';
//icon
import { Icon } from 'src/components/Icon';
//service
import { useRouter } from 'next/router';
import { useLazyGetCampaignDonorsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignDonorsInfo.generated';
//..............................................................

function DonorList() {
  const router = useRouter();
  const [getCampaignDonorsInfo, { data: CampaignDonorsInfoData }] = useLazyGetCampaignDonorsInfoQuery();
  const campaignDonors = CampaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.items;
  //.............................................useEffect
  const idCampaign = localStorage.getItem('idCampaign');
  console.log('i', idCampaign);
  useEffect(() => {
    getCampaignDonorsInfo({
      filter: { pageIndex: 0, pageSize: 900, dto: { campaignId: idCampaign } },
    });
  }, [getCampaignDonorsInfo, idCampaign]);

  return (
    <Stack sx={{ bgcolor: 'background.neutral', height: '100%' }}>
      <Stack direction="row" alignItems="center" sx={{ bgcolor: 'background.paper' }} spacing={2.5} p={2}>
        <IconButton
          onClick={() => {
            router.back();
            localStorage.removeItem('idCampaign');
          }}
          sx={{ p: 0 }}
        >
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1" color="text.primary">
          Donors List
        </Typography>
      </Stack>
      <Stack spacing={2} p={2}>
        {campaignDonors?.map((item, index) => (
          <Stack
            key={index}
            justifyContent="space-between"
            direction="row"
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            p={2}
            width="100%"
          >
            <Stack direction="row" gap={2}>
              <Stack
                width={61}
                height={36}
                alignItems="center"
                justifyContent="center"
                sx={{ bgcolor: 'background.neutral', borderRadius: 1 }}
              >
                {index + 1}
              </Stack>
              <Stack>
                <Typography variant="body2" color="text.primary">
                  ${item.raisedFund}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.raisedFundDateTime}
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={1} direction="row" alignItems="center">
              <Icon name="star" type="solid" color="grey.300" />
              <Typography variant="caption" color="text.secondary">
                Rated: {item.rate}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default DonorList;
