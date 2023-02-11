import { useEffect, useState } from 'react';
//mui
import { Stack } from '@mui/material';
//icon
//rechart
//bottom sheet
import 'react-spring-bottom-sheet/dist/style.css';
//icon
//service
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';

import { useLazyGetCampaignsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignsInfo.generated';
import CampaignDetail from '../component/CampaignDetail';
import CampaignsSlider from '../component/CampaignsSlider';
import NoDataFound from '../component/NoDataFound';
import SortCampaigns from '../component/SortCampaigns';
//....................................................................style

//........................................................................

function Active(props) {
  const { id } = props;
  const { push, query } = useRouter();
  const [getCampaignsInfo, { data: campaignsInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignsData = campaignsInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state

  const [campaignId, setCampaignId] = useState('');
  const [tabValue, setTabValue] = useState('');
  const [campaignCounter, setCampaignCounter] = useState(0);

  //...........................................

  //.............................................useEffect
  useEffect(() => {
    getCampaignsInfo({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        filterExpression: `ownerUserId == (\"${id}\") && CampaignStatus==\"ACTIVE\"`,
      },
    });
  }, [getCampaignsInfo, id]);

  console.log('campaignsData', campaignsData);

  useEffect(() => {
    if (query.reports && query.reports[0]) {
      setTabValue(query.reports[0]);
      setCampaignId('');
    }
    if (query.reports && query.reports[1]) {
      setCampaignId(query.reports[1]);
    }
  }, [query.reports]);

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

  const sortValuesChange = (sortArray, orderValue) => {
    getCampaignsInfo({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        orderByFields: sortArray,
        orderByDescendings: orderValue,
        filterExpression: `ownerUserId == (\"${id}\") && CampaignStatus==\"ACTIVE\"`,
      },
    });
  };

  //....................................................................data Chart

  return (
    <Stack>
      {campaignsData?.length ? (
        <>
          <Stack>
            {!campaignId ? (
              <>
                <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                  <SortCampaigns sortValuesChange={sortValuesChange} />
                  <CampaignsSlider
                    campaignCounter={campaignCounter}
                    setCampaignCounter={setCampaignCounter}
                    campaignsData={campaignsData}
                  />
                </Stack>

                <CampaignDetail campaignId={campaignsData?.[campaignCounter]?.campaignId} />
              </>
            ) : (
              <CampaignDetail campaignId={campaignId} />
            )}
          </Stack>
        </>
      ) : (
        <NoDataFound />
      )}
    </Stack>
  );
}

export default Active;
