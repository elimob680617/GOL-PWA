import { Badge, Box, Divider, FormControl, FormControlLabel, RadioGroup, Typography, Radio } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { HeaderCampaignLanding, MenuItemCampaignLanding } from 'src/components/campaignLanding';
import DonationCards from 'src/components/campaignLanding/DonationCards';
import { Icon } from 'src/components/Icon';
import { useLazyGetDonatedReportQueryQuery } from 'src/_requests/graphql/history/queries/getDonatedReportQuery.generated';
import NoFounraising from 'public/icons/campaignLanding/Fundraising.svg';
import Image from 'next/image';

export const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));
const SortBox = styled('div')(({ theme }) => ({
  margin: 16,
  marginTop: 27,
  marginBottom: 27,
}));

function Donations() {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>('High paid');
  const [donations, setDonations] = useState([]);
  const [getDoners] = useLazyGetDonatedReportQueryQuery();
  useEffect(() => {
    getDoners({
      filter: {
        pageSize: 5,
        pageIndex: 1,
        orderByFields:
          sortValue === 'High Rated' ? ['rate'] : sortValue === 'Recent' ? ['raisedFundDateTime'] : ['raisedFund'],
        orderByDescendings: [true],
      },
    })
      .unwrap()
      .then((res) => {
        console.log(res.getDonatedReportQuery.listDto.items);
        setDonations(res.getDonatedReportQuery.listDto.items);
      });
  }, [getDoners, sortValue]);

  return (
    <Box>
      <HeaderCampaignLanding title="Campaign Landing" />
      <Box display={'flex'} sx={{ overflow: 'auto' }}>
        <MenuItemCampaignLanding active="donation" />
      </Box>
      <SortBox onClick={() => setOpenSort(true)}>
        <Typography variant="button">
          <SearchBadgeStyle color="error" variant="dot" invisible={sortValue === 'High paid'}>
            Sort By <Icon name="Sort2" />
          </SearchBadgeStyle>
        </Typography>
      </SortBox>
      <Box sx={{ maxWidth: '100%' }}>
        {donations.length !== 0 ? (
          donations.map((item) => <DonationCards key={item.id} data={item} />)
        ) : (
          <Box display={'flex'} justifyContent="center" flexWrap={'wrap'}>
            <Image src={NoFounraising} alt="NoFounraising" />
            <Typography variant="caption" color="grey.500" sx={{ width: '100%', textAlign: 'center' }}>
              You have not donated yet
            </Typography>
          </Box>
        )}
      </Box>
      <BottomSheet
        open={openSort}
        onDismiss={() => setOpenSort(!openSort)}
        header={
          <Typography variant="subtitle1" sx={{ p: 2 }}>
            Sort by
          </Typography>
        }
      >
        <Divider />
        <Typography variant="body2" sx={{ p: 2, pt: 0 }}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={sortValue}
              name="radio-buttons-group"
              onChange={(e) => {
                setSortValue(e.target.value);
                setOpenSort(false);
              }}
            >
              <FormControlLabel value="High paid" control={<Radio />} label="High paid" />
              <FormControlLabel value="Recent" control={<Radio />} label="Recent" />
              <FormControlLabel value="High Rated" control={<Radio />} label="High Rated" />
            </RadioGroup>
          </FormControl>
        </Typography>
      </BottomSheet>
    </Box>
  );
}

export default Donations;
