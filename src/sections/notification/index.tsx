import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { Icon } from 'src/components/Icon';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import NoNotif from 'public/icons/notification/noNotification.svg';
import { BirthdayCard, FoundRasingCard, GroupingCard, NotifCard, SecurityCard } from 'src/components/notification';

const Navbar = styled(Box)(({ theme }) => ({
  height: 56,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 8,
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
}));

const data = [
  {
    id: 1,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'masood Shaterabadi',
    userType: 'NGO',
    action: 'Follows you',
    time: '1h',
    status: true,
    activity: null,
    activityStatus: null,
  },
  {
    id: 2,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'sahand zamini',
    userType: 'NORMAL',
    action: 'Like your Photo',
    time: '2h',
    status: true,
    activity: false,
    activityStatus: true,
  },
  {
    id: 3,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'sahand zamini',
    userType: 'NORMAL',
    action: 'Added experience in ╣Charity Water╠',
    time: '2h',
    status: false,
    activity: false,
    activityStatus: false,
  },
  {
    id: 4,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'sahand zamini',
    userType: 'NORMAL',
    action: 'Unfollows you',
    time: '2h',
    status: true,
    activity: true,
    activityStatus: true,
  },
];
const securityData = [
  {
    id: 1,
    Icon: 'location',
    notification: 'You are logged in from a new location!',
    time: '1h',
  },
  {
    id: 2,
    Icon: 'mobile',
    notification: 'A new device has been added to your account!',
    time: '1h',
  },
  {
    id: 3,
    Icon: 'security',
    notification: 'Your password has been changed!',
    time: '1h',
  },
];
const GroupingData = [
  {
    id: 1,
    useAvatar: '',
    userName: 'Charity Water',
    userType: 'NGO',
    action: 'Added a new Video',
    time: '1h',
    status: false,
    cardType: 'video',
  },
  {
    id: 3,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Charity Water',
    userType: 'NGO',
    action: 'Added a new Video',
    time: '1h',
    status: true,
    cardType: 'video',
  },
  {
    id: 2,
    useAvatar: '',
    userName: 'Masood Shaterabadi',
    userType: 'USER',
    action: 'Added a new Photo',
    time: '1h',
    status: false,
    cardType: 'picture',
  },
  {
    id: 4,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Masood Shaterabadi',
    userType: 'USER',
    action: 'Added a new Photo',
    time: '1h',
    status: true,
    cardType: 'picture',
  },
];
const FoundData = [
  {
    id: 3,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Charity Water',
    userType: 'NGO',
    action: 'Donated to the ╣Global Giving campaign╠',
    time: '1h',
    status: true,
  },
  {
    id: 4,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Masood Shaterabadi',
    userType: 'USER',
    action: 'Donated $150 to the ╣Global Giving campaign╠',
    time: '1h',
    status: true,
  },
];
const birthdayData = [
  {
    id: 1,
    Icon: 'office-bag',
    notification: 'Ashkan Pordel is working for Company Moon NGO for the third year',
    time: '1h',
  },
  {
    id: 2,
    Icon: 'Building',
    notification: 'The fifth anniversary of the establishment of Company Moon Light company (23 April)',
    time: '1h',
  },
  {
    id: 3,
    Icon: 'Birthday',
    notification: `4 days left until Soheil najafi's birthday (23 April)`,
    time: '1h',
  },
];

interface ICardData {
    id?: number;
    useAvatar?: string;
    userName?: string;
    userType?: string;
    action?: string;
    time?: string;
    status?: boolean;
  }
function NotifSection() {
  const [open, setOpen] = useState<boolean>(false);
  const [sortMenu, setSortMenu] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardData[]>(data);

  const handleSortNotification = (e) => {
    if (e.target.value === 'Reads') {
      setCardData(data.filter((i) => i.status === false));
    } else if (e.target.value === 'Unreads') {
      setCardData(data.filter((i) => i.status === true));
    } else {
      setCardData(data);
    }
  };
  return (
    <Box sx={{ height: '100%' }}>
      <Navbar>
        <Typography variant="subtitle1">Notifications</Typography>
        <IconButton onClick={() => setOpen(!open)}>
          <Icon name="Menu" type="solid" />
        </IconButton>
      </Navbar>
      {cardData.length === 0 &&
      securityData.length === 0 &&
      GroupingData.length === 0 &&
      FoundData.length === 0 &&
      birthdayData.length === 0 ? (
        <Box sx={{ width: '100%', height: '100%' }} display="flex" justifyContent={'center'} alignItems={'center'}>
          <Box
            sx={{ width: '100%' }}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexWrap={'wrap'}
          >
            <Image src={NoNotif} alt="noNotif" />
            <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
              There is no notification
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          {cardData.map((item, index) => (
            <Box key={index}>
              <NotifCard CardData={item} />
              {item?.status ? null : <Divider />}
            </Box>
          ))}
          {securityData?.map((item, index) => (
            <Box key={index}>
              <SecurityCard item={item} />
            </Box>
          ))}
          {GroupingData?.map((item, index) => (
            <Box key={index}>
              <GroupingCard item={item} />
            </Box>
          ))}
          {FoundData?.map((item, index) => (
            <Box key={index}>
              <FoundRasingCard item={item} />
            </Box>
          ))}
          {birthdayData?.map((item, index) => (
            <Box key={index}>
              <BirthdayCard item={item} />
            </Box>
          ))}
        </Box>
      )}
      <BottomSheet
        open={open}
        onDismiss={() => {
          setOpen(false);
          setSortMenu(false);
        }}
      >
        {sortMenu ? (
          <Box>
            <Box display="flex" justifyContent={'space-between'} alignItems="center">
              <Typography variant="subtitle1" sx={{ p: 2 }}>
                Notification Category
              </Typography>
              <Button
                onClick={() => {
                  setSortMenu(false);
                  setOpen(false);
                }}
              >
                Done
              </Button>
            </Box>
            <Divider />
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="ShowAll"
                name="radio-buttons-group"
                onChange={handleSortNotification}
              >
                <Stack onClick={() => setSortMenu(true)}>
                  <Typography variant="body2" sx={{ p: 2, pb: 0 }}>
                    <FormControlLabel value="ShowAll" control={<Radio />} label="Show All" />
                  </Typography>
                </Stack>
                <Stack onClick={() => setSortMenu(true)}>
                  <Typography variant="body2" sx={{ p: 2, pb: 0 }}>
                    <FormControlLabel value="Reads" control={<Radio />} label="Reads" />
                  </Typography>
                </Stack>
                <Stack onClick={() => setSortMenu(true)}>
                  <Typography variant="body2" sx={{ p: 2 }}>
                    <FormControlLabel value="Unreads" control={<Radio />} label="Unreads" />
                  </Typography>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" sx={{ p: 2 }}>
              Notification Menu
            </Typography>
            <Divider />
            <Box>
              <Typography variant="body2" sx={{ p: 2 }}>
                <Icon name="Read-Notifications" />
                Mark all as read
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ p: 2 }}>
                <Icon name="Setting" />
                Notification Setting
              </Typography>
            </Box>
            <Stack onClick={() => setSortMenu(true)}>
              <Typography variant="body2" sx={{ p: 2 }}>
                <Icon name="Notifications-Category" />
                Notification Category
              </Typography>
            </Stack>
          </Box>
        )}
      </BottomSheet>
    </Box>
  );
}

export default NotifSection;
