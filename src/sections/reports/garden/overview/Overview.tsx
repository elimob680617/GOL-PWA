import { useEffect, useState } from 'react';
//mui
import {
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
//icon
import { Icon } from 'src/components/Icon';
//bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
//service
import { useLazyGetCampaignsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignsInfo.generated';
//next
import { useRouter } from 'next/router';
//component
import { PATH_APP } from 'src/routes/paths';
import useDebounce from 'src/utils/useDebounce';
import CampaignDetail from './CampaignDetail';
import Total from './Total';
import NoDataFound from '../component/NoDataFound';
//....................................................................
const SelectCampaignStyle = styled(Stack)(({ theme }) => ({
  height: 40,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2.5),
  margin: theme.spacing(2, 2.5),
  cursor: 'pointer',
}));

//........................................................................

function Overview() {
  const { push, query } = useRouter();
  const [getCampaignInfo, { data: campaignInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignData = campaignInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state
  const [openCampaign, setOpenCampaign] = useState(false);
  const [campaignId, setCampaignId] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [searchedText, setSearchedText] = useState<string>('');
  const [tabValue, setTabValue] = useState('');
  const debouncedValue = useDebounce<string>(searchedText, 500);
  //...........................................

  //..................useEffect
  useEffect(() => {
    if (query.garden[1]) {
      setTabValue(query.garden[1]);
      setCampaignId('');
      setOpenCampaign(false);
    }
    if (query.garden[2]) {
      setCampaignId(query.garden[2]);
    }
  }, [query.garden]);

  //.............................................useEffect
  useEffect(() => {
    getCampaignInfo({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        filterExpression: debouncedValue.length ? `campaignName.Contains(\"${debouncedValue}\")` : undefined,
      },
    });
  }, [debouncedValue, getCampaignInfo]);

  useEffect(() => {
    if (campaignInfoData) {
      setCampaignId(campaignInfoData?.[0]?.campaignId as string);
    }
  }, [campaignInfoData]);

  useEffect(() => {
    if (campaignId) {
      push(`${PATH_APP.report.garden}/${tabValue}/${campaignId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  //.........................
  // const searchCampaign = (searchValue) => {
  //   setSearchText(searchValue);
  // };
  //....................................................................data Chart

  return (
    <Stack>
      {/*...selectCampaign */}
      <Stack sx={{ bgcolor: 'background.paper' }}>
        <SelectCampaignStyle direction="row" spacing={2} onClick={() => setOpenCampaign(true)}>
          <Typography variant="body2" color={campaignName !== '' ? 'text.primary' : 'text.secondary'}>
            {campaignName !== '' ? campaignName : 'Select Campaign'}
          </Typography>
          <Icon name="down-arrow" color="grey.500" />
        </SelectCampaignStyle>
      </Stack>
      <Stack sx={{ bgcolor: 'background.neutral' }}>
        {!campaignId ? <Total /> : <CampaignDetail campaignId={campaignId} />}
        {/* <NoDataFound /> */}
      </Stack>

      {/*...BottomSheetCampaign */}
      <BottomSheet open={openCampaign} onDismiss={() => setOpenCampaign(!openCampaign)}>
        <Stack spacing={2} height={360}>
          <Typography variant="subtitle1" color="text.primary" px={2}>
            Select Campaign
          </Typography>
          <Divider />
          <Stack px={2}>
            <TextField
              fullWidth
              size="small"
              name="search"
              type="search"
              placeholder="Search"
              onChange={(e) => setSearchedText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon name="Research" color="grey.500" type="solid" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          {/*...RadioGroup */}
          <FormControl sx={{ overflow: 'scroll', px: 2 }}>
            <RadioGroup
              name="radio-buttons-group"
              value={campaignId}
              onChange={(e) => {
                setCampaignId(e.target.value);
                setCampaignName(e.target.id);
              }}
            >
              {campaignData?.map((campaign) => (
                <FormControlLabel
                  key={campaign?.campaignId}
                  value={campaign?.campaignId}
                  control={<Radio id={campaign?.campaignName} />}
                  label={campaign?.campaignName as string}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </BottomSheet>
    </Stack>
  );
}

export default Overview;
