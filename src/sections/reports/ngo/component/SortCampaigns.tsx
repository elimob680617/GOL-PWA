import { useEffect, useState } from 'react';
//mui
import {
  Badge,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Typography,
} from '@mui/material';
//icon
import { Icon } from 'src/components/Icon';
//bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));

interface ISortChangeProps {
  sortValuesChange: (sort: string[], order: boolean[]) => void;
}

function SortCampaigns(props: ISortChangeProps) {
  const { sortValuesChange } = props;
  const [sortValue, setSortValue] = useState<string[]>(['raisedFund']);
  const [orderValue, setOrderValue] = useState<boolean[]>([true]);
  const [openSortCampaign, setOpenSortCampaign] = useState(false);

  //..............................
  //.............................................useEffect
  useEffect(() => {
    sortValuesChange(sortValue, orderValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderValue, sortValue]);

  const handelSort = (e) => {
    const sortArray = [];
    sortArray.push(e.target.value);
    setSortValue(sortArray);
    setOpenSortCampaign(false);
  };
  const handelOrder = (e) => {
    const orderArray = [];
    if (e.target.value === 'false') {
      orderArray.push(false);
    } else {
      orderArray.push(true);
    }
    setOrderValue(orderArray);
    setOpenSortCampaign(false);
  };

  return (
    <>
      <Stack sx={{ bgcolor: 'background.neutral' }} p={2}>
        <Stack pt={1} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" gap={1}>
            <Typography variant="h6" color="text.primary">
              Campaigns:
            </Typography>

            <SearchBadgeStyle
              color="error"
              variant="dot"
              invisible={sortValue[0] === 'raisedFund' && orderValue[0] === true}
            >
              <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenSortCampaign(true)}>
                <Icon name="Sort2" />
              </Box>
            </SearchBadgeStyle>
          </Stack>
        </Stack>
      </Stack>
      {/* bottomSheet Sort Campaign */}
      <BottomSheet open={openSortCampaign} onDismiss={() => setOpenSortCampaign(!openSortCampaign)}>
        <Stack spacing={2} height={360}>
          <Typography variant="subtitle1" color="text.primary" px={2}>
            Sort by
          </Typography>
          <Divider />
          {/*...RadioGroup Sort by*/}
          <FormControl sx={{ overflow: 'scroll', px: 2 }}>
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
          <FormControl sx={{ overflow: 'scroll', px: 2 }}>
            <RadioGroup name="radio-buttons-group-orderBy" defaultValue={orderValue} onChange={handelOrder}>
              <FormControlLabel value={false} control={<Radio />} label="Ascending" />
              <FormControlLabel value={true} control={<Radio />} label="Descending" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </BottomSheet>
    </>
  );
}

export default SortCampaigns;
