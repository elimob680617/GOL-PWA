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
//component
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import useDebounce from 'src/utils/useDebounce';

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

function SearchCampaign(props) {
  const { id } = props;
  const { push, query } = useRouter();
  const [getCampaignInfo, { data: campaignInfoData }] = useLazyGetCampaignsInfoQuery();
  //...
  const campaignData = campaignInfoData?.getCampaignsInfo?.listDto?.items;
  //.............................................state

  const [campaignId, setCampaignId] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [openCampaign, setOpenCampaign] = useState(false);
  const [searchedText, setSearchedText] = useState<string>('');
  const [tabValue, setTabValue] = useState('');
  const debouncedValue = useDebounce<string>(searchedText, 500);

  //..................useEffect
  useEffect(() => {
    if (query.reports && query.reports[0]) {
      setTabValue(query.reports[0]);
      setCampaignId('');
      setOpenCampaign(false);
    }
    if (query.reports && query.reports[1]) {
      setCampaignId(query.reports[1]);
    }
  }, [query.reports, setOpenCampaign]);

  //.............................................useEffect
  useEffect(() => {
    if (query.reports && query.reports[0] && query.reports[0] === 'overview')
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,
          filterExpression: debouncedValue.length
            ? `campaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\")`
            : `ownerUserId == (\"${id}\")`,
        },
      });
    else if (query.reports && query.reports[0] && query.reports[0] === 'successful')
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,
          filterExpression: debouncedValue.length
            ? `campaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\") && CampaignStatus==\"SUCCESSFUL\"`
            : `ownerUserId == (\"${id}\") && CampaignStatus==\"SUCCESSFUL\"`,
        },
      });
    else if (query.reports && query.reports[0] && query.reports[0] === 'finished')
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,
          filterExpression: debouncedValue.length
            ? `campaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\") && CampaignStatus==\"FINISHED\"`
            : `ownerUserId == (\"${id}\") && CampaignStatus==\"FINISHED\"`,
        },
      });
    else if (query.reports && query.reports[0] && query.reports[0] === 'active')
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,
          filterExpression: debouncedValue.length
            ? `campaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\") && CampaignStatus==\"ACTIVE\"`
            : `ownerUserId == (\"${id}\") && CampaignStatus==\"ACTIVE\"`,
        },
      });
    else if (query.reports && query.reports[0] && query.reports[0] === 'interrupted')
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,
          filterExpression: debouncedValue.length
            ? `campaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\") && CampaignStatus==\"INTERRUPTED\"`
            : `ownerUserId == (\"${id}\") && CampaignStatus==\"INTERRUPTED\"`,
        },
      });
    else
      getCampaignInfo({
        filter: {
          pageIndex: 0,
          pageSize: 10,
          filterExpression: debouncedValue.length
            ? `campaignName.Contains(\"${debouncedValue}\") && ownerUserId == (\"${id}\") `
            : `ownerUserId == (\"${id}\") `,
        },
      });
  }, [campaignInfoData?.getCampaignsInfo?.isSuccess, debouncedValue, getCampaignInfo, id, query.reports]);

  useEffect(() => {
    if (campaignInfoData) {
      setCampaignId(campaignInfoData?.[0]?.campaignId as string);
    }
  }, [campaignInfoData]);

  useEffect(() => {
    if (campaignId) {
      push(`${PATH_APP.report.ngo}/${tabValue}/${campaignId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return (
    <>
      <Stack sx={{ bgcolor: 'background.paper' }}>
        <SelectCampaignStyle
          direction="row"
          spacing={2}
          onClick={() => {
            setOpenCampaign(true);
            setCampaignName('');
            setCampaignId('');
          }}
        >
          <Typography variant="body2" color={campaignName !== '' ? 'text.primary' : 'text.secondary'}>
            {campaignName !== '' ? campaignName : 'Select Campaign'}
          </Typography>
          <Icon name="down-arrow" color="grey.500" />
        </SelectCampaignStyle>
      </Stack>
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
                  <>
                    <InputAdornment position="start">
                      <Icon name="Research" color="grey.500" type="solid" />
                    </InputAdornment>
                  </>
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
                  label={campaign?.campaignName ? campaign?.campaignName : ('No name campaign.' as string)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </BottomSheet>
    </>
  );
}

export default SearchCampaign;
