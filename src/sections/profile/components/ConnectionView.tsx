//mui
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Avatar, Box, Button, CircularProgress, Stack, Tab, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import NoConnectionIcon from 'public/icons/noConnection.svg';
import React, { FC, useEffect } from 'react';
//type
import { FilterByEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
//services
import { useLazyGetFollowersQuery } from 'src/_requests/graphql/connection/queries/getFollowers.generated';
import { useLazyGetFollowingsQuery } from 'src/_requests/graphql/connection/queries/getFollowings.generated';
//.............................................
interface UserConnection {
  // ID?: string;
  Name?: string;
}

const ContactsUsersStyle = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  gap: theme.spacing(0.5),
}));
const ConnectionContentStyle = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 20,
}));
const TabContentStyle = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxHeight: 190,
}));

const ConnectionView: FC<UserConnection> = (props) => {
  const { Name } = props;
  const router = useRouter();

  const ID = router?.query?.id?.[0];

  const [value, setValue] = React.useState('followers');

  const [getFollowers, { data: followersData, isFetching: isFetchingFollower }] = useLazyGetFollowersQuery();
  const [getFollowings, { data: followingsData, isFetching: isFetchingfollowing }] = useLazyGetFollowingsQuery();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (value === 'followers') {
      getFollowers({
        filter: { pageSize: 7, pageIndex: 0, dto: { filterBy: FilterByEnum.All, searchText: '', userId: ID } },
      });
    } else {
      getFollowings({
        filter: { pageSize: 7, pageIndex: 0, dto: { searchText: '', filterBy: FilterByEnum.All, userId: ID } },
      });
    }
  }, [ID, getFollowers, getFollowings, value]);

  const followers = followersData?.getFollowers?.listDto?.items;
  const followings = followingsData?.getFollowings?.listDto?.items;

  return (
    <>
      <Stack justifyContent="space-between" direction="row" sx={{ minHeight: 210 }}>
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                sx={{ '&>div>div': { justifyContent: 'space-around' } }}
              >
                <Tab label="Followers" value="followers" />
                <Tab label="Followings" value="followings" />
              </TabList>
            </Box>
            <TabPanel value="followers">
              {followersData?.getFollowers?.listDto?.count > 0 ? (
                <TabContentStyle>
                  {isFetchingFollower ? (
                    <Stack sx={{ py: 4 }} alignItems="center" justifyContent="center">
                      <CircularProgress />
                    </Stack>
                  ) : (
                    <ConnectionContentStyle>
                      {followers?.slice(0, 8).map((follower) => (
                        <ContactsUsersStyle
                          key={follower.itemId}
                          onClick={() => {
                            if (follower?.itemType === FilterByEnum.Normal)
                              router.push(`/profile/user/view/${follower?.itemId}`);
                            else if (follower?.itemType === FilterByEnum.Ngo)
                              router.push(`/profile/ngo/view/${follower?.itemId}`);
                          }}
                        >
                          <Avatar
                            src={follower?.avatarUrl || undefined}
                            variant={follower?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                            sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                          />
                          <Box sx={{ height: 18 }}>
                            <Typography variant="caption">{follower.firstName || follower.fullName}</Typography>
                          </Box>
                        </ContactsUsersStyle>
                      ))}
                    </ConnectionContentStyle>
                  )}
                </TabContentStyle>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 1,
                  }}
                >
                  <Image src={NoConnectionIcon} alt="" />
                  <Box sx={{ display: 'flex' }} mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      {Name} has no follower
                    </Typography>
                  </Box>
                </Box>
              )}
            </TabPanel>
            <TabPanel value="followings">
              {followingsData?.getFollowings?.listDto?.count > 0 ? (
                <TabContentStyle>
                  {isFetchingfollowing ? (
                    <Stack sx={{ py: 4 }} alignItems="center" justifyContent="center">
                      <CircularProgress />
                    </Stack>
                  ) : (
                    <ConnectionContentStyle>
                      {followings?.slice(0, 8).map((following) => (
                        <ContactsUsersStyle
                          key={following.itemId}
                          onClick={() => {
                            if (following?.itemType === FilterByEnum.Normal)
                              router.push(`/profile/user/view/${following?.itemId}`);
                            else if (following?.itemType === FilterByEnum.Ngo)
                              router.push(`/profile/ngo/view/${following?.itemId}`);
                          }}
                        >
                          <Avatar
                            src={following?.avatarUrl || undefined}
                            variant={following?.itemType === FilterByEnum.Normal ? 'circular' : 'rounded'}
                            sx={{ width: 80, height: 80, backgroundColor: 'background.neutral' }}
                          />
                          <Box sx={{ height: 18 }}>
                            <Typography variant="caption">{following.firstName || following.fullName}</Typography>
                          </Box>
                        </ContactsUsersStyle>
                      ))}
                    </ConnectionContentStyle>
                  )}
                </TabContentStyle>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 1,
                  }}
                >
                  <Image src={NoConnectionIcon} alt="" />
                  <Box sx={{ display: 'flex' }} mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      {Name} has no following
                    </Typography>
                  </Box>
                </Box>
              )}
            </TabPanel>
            {(followersData?.getFollowers?.listDto?.count > 0 ||
              followingsData?.getFollowings?.listDto?.count > 0) && (
                <NextLink href={`/connections/${value}/?userId=${ID}`} passHref>
                  <Button size="small" variant="outlined" sx={{ color: 'text.primary', width: '100%', marginTop: 2 }}>
                    <Typography variant="button" color="text.primary">
                      See all {value}
                    </Typography>
                  </Button>
                </NextLink>
              )}
            {/* {((followersData?.getFollowers?.listDto?.count > 7 && value === 'follower')||
                (followingsData?.getFollowings?.listDto?.count > 7 && value === 'following'))&& (
            )} */}
          </TabContext>
        </Box>
      </Stack>
    </>
  );
};

export default ConnectionView;
