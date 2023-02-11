import { useEffect, useState } from 'react';
//mui
import {
  Badge,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
//icon
import { Icon } from 'src/components/Icon';
//rechart
//bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
//service
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetCampaignDetailsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignDetailsInfo.generated';
import { useLazyGetCampaignsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignsInfo.generated';

//....................................................................style
const SelectCampaignStyle = styled(Stack)(({ theme }) => ({
  height: 40,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(1),
  paddingRight: theme.spacing(2.5),
  paddingLeft: theme.spacing(2),
  margin: theme.spacing(2, 2.5),
  cursor: 'pointer',
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
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
}));
const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));
//........................................................................

function Successful() {
  const { push, query } = useRouter();

  const [getCampaignInfo, { data: campaignInfoData }] = useLazyGetCampaignsInfoQuery();
  const [getCampaignDetailsInfo, { data: campaignDetailsInfoData }] = useLazyGetCampaignDetailsInfoQuery();

  //.............................................state
  const [openCampaign, setOpenCampaign] = useState(false);
  const [openSortCampaign, setOpenSortCampaign] = useState(false);
  const [campaignId, setCampaignId] = useState('');
  const [searchedText, setSearchedText] = useState<string>('');
  const [campaignName, setCampaignName] = useState('');
  const [tabValue, setTabValue] = useState('');
  const [sortValue, setSortValue] = useState<string[]>(['raisedFund']);
  const [orderValue, setOrderValue] = useState<boolean[]>([false]);
  const debouncedValue = useDebounce<string>(searchedText, 500);
  const [campaignCounter, setCampaignCounter] = useState(0);
  //...........................................
  const campaignDetailsInfo = campaignDetailsInfoData?.getCampaignDetailsInfo?.listDto?.items?.[campaignCounter];
  //...
  const campaignData = campaignInfoData?.getCampaignsInfo?.listDto?.items;
  const raisedMoneyNum = Number(campaignDetailsInfo?.raisedFund);
  const targetNum = Number(campaignDetailsInfo?.target);

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
  //...
  useEffect(() => {
    getCampaignInfo({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        filterExpression: debouncedValue.length ? `campaignName.Contains(\"${debouncedValue}\")` : undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  //...
  useEffect(() => {
    if (campaignId) {
      getCampaignDetailsInfo({ filter: { dto: { campaignId: campaignId } } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);
  //...
  useEffect(() => {
    if (campaignId) {
      push(`${PATH_APP.report.garden}/${tabValue}/${campaignId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);
  //..............................
  const handelSort = (e) => {
    const sortArray = [];
    sortArray.push(e.target.value);
    setSortValue(sortArray);
    getCampaignInfo({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        orderByFields: sortArray,
        orderByDescendings: orderValue,
      },
    });
  };
  const handelOrder = (e) => {
    const orderArray = [];
    if (e.target.value === 'false') {
      orderArray.push(false);
    } else {
      orderArray.push(true);
    }
    setOrderValue(orderArray);
    getCampaignInfo({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        orderByFields: sortValue,
        orderByDescendings: orderArray as boolean[],
      },
    });
  };
  console.log('id', campaignId);

  const handelRouteDonorList = () => {
    localStorage.setItem('idCampaign', campaignId);
    push('/report/donorList');
  };

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
        {/*...sortCampaign */}
        <Stack sx={{ bgcolor: 'background.neutral' }} p={2}>
          <Stack pt={1} pb={3} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" gap={1}>
              <Typography variant="h6" color="text.primary">
                Campaigns:
              </Typography>
              <SearchBadgeStyle
                color="error"
                variant="dot"
                invisible={sortValue[0] === 'raisedFund' && orderValue[0] === false}
              >
                <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenSortCampaign(true)}>
                  <Icon name="Sort2" />
                </Box>
              </SearchBadgeStyle>
            </Stack>
            <Stack direction="row" gap={5}>
              {campaignCounter === 0 ? (
                <IconButton disabled onClick={() => setCampaignCounter(campaignCounter - 1)}>
                  <Icon name="left-arrow" color="grey.300" />
                </IconButton>
              ) : (
                <IconButton onClick={() => setCampaignCounter(campaignCounter - 1)}>
                  <Icon name="left-arrow" />
                </IconButton>
              )}
              {campaignCounter === campaignData?.length ? (
                <IconButton disabled onClick={() => setCampaignCounter(campaignCounter + 1)}>
                  <Icon name="right-arrow-1" color="grey.300" />
                </IconButton>
              ) : (
                <IconButton onClick={() => setCampaignCounter(campaignCounter + 1)}>
                  <Icon name="right-arrow-1" />
                </IconButton>
              )}
            </Stack>
          </Stack>
          {/*...................donor */}
          <>
            <Stack sx={{ bgcolor: 'background.paper', borderTopRightRadius: 8, borderTopLeftRadius: 8, p: 2 }}>
              <Typography variant="subtitle1" color="text.primary" sx={{ mb: 3 }}>
                {campaignDetailsInfo?.campaignName}
              </Typography>
              {!!campaignDetailsInfo?.raisedFund ? (
                <>
                  <Typography variant="subtitle2" color="secondary.main" sx={{ mb: 2 }}>
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
                          backgroundColor: 'secondary.main',
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
                  <Typography variant="subtitle2" color="secondary.main">
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
                  <Typography variant="subtitle2" color="secondary.dark">
                    {campaignDetailsInfo?.daysLeft}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={'row'} sx={{ alignItems: 'center' }} mb={3}>
                {!!campaignDetailsInfo?.numberOfRates && !!campaignDetailsInfo?.numberOfRates ? (
                  <>
                    <Icon name="star" type="solid" color="secondary.main" />
                    <Typography variant="subtitle2" color="secondary.main" sx={{ mr: 0.5, ml: 0.5 }}>
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
            </Stack>
            {/* <DonorsListDialog  open={openDonorsDialog} onClose={() => setOpenDonorsDialog(false)} /> */}
          </>
          {/*.....................donorList */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ bgcolor: 'background.paper', p: 2 }}
          >
            <Typography variant="button" color="info.main">
              Donors List
            </Typography>
            <Box sx={{ cursor: 'pointer' }} onClick={handelRouteDonorList}>
              <Icon name="right-arrow-1" color="info.main" />
            </Box>
          </Stack>
          {/*.....................itemsTotal */}
          <Stack
            sx={{ bgcolor: 'background.paper', borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }}
            p={2}
            spacing={2}
          >
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
      </Stack>
      {/* bottomSheet Select Campaign */}
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
                  label={campaign?.campaignName ? campaign?.campaignName : ('No name campaign.' as string)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </BottomSheet>
      {/* bottomSheet Sort Campaign */}
      <BottomSheet open={openSortCampaign} onDismiss={() => setOpenSortCampaign(!openSortCampaign)}>
        <Stack spacing={2} height={360}>
          <Typography variant="subtitle1" color="text.primary" px={2}>
            Sort by
          </Typography>
          <Divider />
          {/*...RadioGroup Sort by*/}
          <FormControl sx={{ px: 2 }}>
            <RadioGroup name="radio-buttons-group-sortBy" defaultValue={sortValue} onChange={handelSort}>
              <FormControlLabel value="raisedFund" control={<Radio />} label="Raised Fund" />
              <FormControlLabel value="updateDate" control={<Radio />} label="Date" />
              <FormControlLabel value="campaignName" control={<Radio />} label="Name" />
              <FormControlLabel value="target" control={<Radio />} label="Target" />
            </RadioGroup>
          </FormControl>
          <Typography variant="subtitle1" color="text.primary" px={2}>
            Order by
          </Typography>
          {/*...RadioGroup Order by*/}
          <FormControl sx={{ px: 2 }}>
            <RadioGroup name="radio-buttons-group-orderBy" defaultValue={orderValue} onChange={handelOrder}>
              <FormControlLabel value={false} control={<Radio />} label="Ascending" />
              <FormControlLabel value={true} control={<Radio />} label="Descending" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </BottomSheet>
    </Stack>
  );
}
export default Successful;
