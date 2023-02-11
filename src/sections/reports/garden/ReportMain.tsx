import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, IconButton, Stack, Tab, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import Successful from './successful/Successful';
import Overview from './overview/Overview';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';

export type reportTabs = 'Overview' | 'Successful' | 'Finished' | 'Active' | 'Interrupted';
function ReportMain() {
  const { back, push, query } = useRouter();
  const [tabValue, setTabValue] = useState('');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    push(`${PATH_APP.report.garden}/${newValue}`);
  };
  useEffect(() => {
    if (query.garden[1]) {
      setTabValue(query.garden[1]);
    }
  }, [query.garden]);

  console.log(query);
  return (
    <Stack sx={{ bgcolor: 'background.neutral' }}>
      <Stack direction="row" alignItems="center" sx={{ bgcolor: 'background.paper' }} spacing={3} p={2} mb={1}>
        <IconButton onClick={() => back()}>
          <Icon name="left-arrow-1" />
        </IconButton>
        <Typography variant="subtitle1" color="text.primary">
          Application Report of GOL
        </Typography>
      </Stack>
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
          {/**********Overview*********/}
          <TabPanel value="overview">
            <Overview />
          </TabPanel>
          {/**********Successful*********/}
          <TabPanel value="successful">
            <Successful />
          </TabPanel>
          <TabPanel value="finished">Finished</TabPanel>
          <TabPanel value="active">Active</TabPanel>
          <TabPanel value="interrupted">Interrupted</TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}

export default ReportMain;
