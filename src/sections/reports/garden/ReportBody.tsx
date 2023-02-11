import { FC } from 'react';
//mui
import { Typography } from '@mui/material';
//component
import Overview from './overview/Overview';
import { reportTabs } from './ReportMain';
import Successful from './successful/Successful';

const ReportBody: FC<{ reportType: reportTabs }> = ({ reportType }) => {
  const searchedBodies = {
    Overview: <Overview />,
    Successful: <Successful />,
    Finished: <Typography>Finished,</Typography>,
    Active: <Typography>Active,</Typography>,
    Interrupted: <Typography>Interrupted,</Typography>,
  };

  const conditionalRendering = (type: reportTabs) => searchedBodies[type];

  return <> {conditionalRendering(reportType)} </>;
};

export default ReportBody;
