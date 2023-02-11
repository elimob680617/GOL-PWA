import { useEffect, useState } from 'react';
//mui
import { Stack } from '@mui/material';
//icon
//bottom sheet
import 'react-spring-bottom-sheet/dist/style.css';
//service
import { useLazyGetCampaignsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignsInfo.generated';
//component
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import CampaignDetail from '../component/CampaignDetail';
import Total from './Total';
import NoDataFound from '../component/NoDataFound';
//....................................................................

//........................................................................

function Overview() {
  const { push, query } = useRouter();
  const [getCampaignsInfo, { data: campaignsInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignsData = campaignsInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state

  const [campaignId, setCampaignId] = useState('');

  const [tabValue, setTabValue] = useState('');

  //..................useEffect
  useEffect(() => {
    if (query.reports && query.reports[0]) {
      setTabValue(query.reports[0]);
      setCampaignId('');
    }
    if (query.reports && query.reports[1]) {
      setCampaignId(query.reports[1]);
    }
  }, [query.reports]);

  //.............................................useEffect

  useEffect(() => {
    if (campaignsInfoData) {
      setCampaignId(campaignsInfoData?.[0]?.campaignId as string);
    }
  }, [campaignsInfoData]);

  useEffect(() => {
    if (campaignId) {
      push(`${PATH_APP.report.ngo}/${tabValue}/${campaignId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  //....................................................................data Chart

  return (
    <>
      {!campaignsData?.length ? (
        <Stack>
          {!campaignId ? (
            <Total />
          ) : (
            <Stack>
              <CampaignDetail campaignId={campaignId} />
            </Stack>
          )}
        </Stack>
      ) : (
        <NoDataFound />
      )}
    </>
  );
}

export default Overview;
