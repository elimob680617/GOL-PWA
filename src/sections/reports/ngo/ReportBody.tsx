import { FC } from 'react';
//mui
//component
import Active from './campaignsList/Active';
import Finished from './campaignsList/Finished';
import Interrupted from './campaignsList/Interrupted';
import Successful from './campaignsList/Successful';
import { reportTabs } from './NgoReportMain';
import Overview from './overview/Overview';

const ReportBody: FC<{ reportType: reportTabs }> = ({ reportType }) => {
  const searchedBodies = {
    Overview: <Overview />,
    Successful: <Successful />,
    Finished: <Finished />,
    Active: <Active />,
    Interrupted: <Interrupted />,
  };

  const conditionalRendering = (type: reportTabs) => searchedBodies[type];

  return <> {conditionalRendering(reportType)} </>;
};

export default ReportBody;
