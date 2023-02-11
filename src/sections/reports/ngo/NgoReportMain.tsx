import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Stack, Tab } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import Active from './campaignsList/Active';
import Finished from './campaignsList/Finished';
import Interrupted from './campaignsList/Interrupted';
import Successful from './campaignsList/Successful';
import SearchCampaign from './component/SearchCampaign';
import Overview from './overview/Overview';

export type reportTabs = 'Overview' | 'Successful' | 'Finished' | 'Active' | 'Interrupted';
function NgoReportMain() {
  const { user } = useAuth();
  const { push, query } = useRouter();
  const [tabValue, setTabValue] = useState('overview');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    push(`${PATH_APP.report.ngo}/${newValue}`);
  };
  useEffect(() => {
    if (query.reports && query.reports[0]) {
      setTabValue(query.reports[0]);
    }
  }, [query.reports]);

  console.log(query);
  return (
    <Stack sx={{ bgcolor: 'background.neutral' }}>
      {/*...........................................TabList*/}
      <Box sx={{ width: '100%', typography: 'subtitle1' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              variant="scrollable"
              sx={{
                px: 2,
                py: 2,
                '& .MuiTabs-flexContainer': { gap: 3 },
                '& .MuiTabs-indicator': { display: 'none' },
                '& .Mui-selected': {
                  backgroundColor: 'background.neutral',
                  borderRadius: 1,
                  maxHeight: '34px !important',
                },
              }}
            >
              <Tab label="Overview" value="overview" style={{ minHeight: 34, height: 34 }} />
              <Tab label="Successful" value="successful" style={{ minHeight: 34, height: 34 }} />
              <Tab label="Finished" value="finished" style={{ minHeight: 34, height: 34 }} />
              <Tab label="Active" value="active" style={{ minHeight: 34, height: 34 }} />
              <Tab label="Interrupted" value="interrupted" style={{ minHeight: 34, height: 34 }} />
            </TabList>
          </Box>
          <SearchCampaign id={user?.id} />
          {/**********Overview*********/}

          <TabPanel value="overview">
            <Overview />
          </TabPanel>
          {/**********Successful*********/}
          <TabPanel value="successful">
            <Successful id={user?.id} />
          </TabPanel>
          <TabPanel value="finished">
            <Finished id={user?.id} />
          </TabPanel>
          <TabPanel value="active">
            <Active id={user?.id} />
          </TabPanel>
          <TabPanel value="interrupted">
            <Interrupted id={user?.id} />
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}

export default NgoReportMain;
