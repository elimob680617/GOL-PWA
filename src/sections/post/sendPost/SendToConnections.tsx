import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FilterByEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import NotFound from 'src/components/notFound/NotFound';
import useAuth from 'src/hooks/useAuth';
import { basicSendPostSelector } from 'src/redux/slices/post/sendPost';
import { useSelector } from 'src/redux/store';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetFollowersQuery } from 'src/_requests/graphql/connection/queries/getFollowers.generated';
import { useLazyGetUserQuery } from 'src/_requests/graphql/post/create-post/queries/getUserQuery.generated';
import SendPostToUsers from './SentPostToUsers';
//icon
import { Icon } from 'src/components/Icon';

function SendToConnections() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [searchedText, setSearchedText] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchedText, 500);
  const ID = user?.id;
  const postSent = useSelector(basicSendPostSelector);
  const [getUsers, { isFetching: isFetchingUsers, data: usersData }] = useLazyGetUserQuery();
  const [getFollowers, { data: followersData, isFetching: isFetchingFollower }] = useLazyGetFollowersQuery();
  const followers = followersData?.getFollowers?.listDto?.items;
  const users = usersData?.getUserQuery?.listDto?.items;

  useEffect(() => {
    getFollowers({
      filter: { dto: { filterBy: FilterByEnum.All, searchText: '', userId: ID } },
    });
  }, [ID, getFollowers]);

  useEffect(() => {
    getFollowers({
      filter: { dto: { searchText: debouncedValue } },
    });
  }, [debouncedValue, getFollowers]);

  useEffect(() => {
    getUsers({ filter: { dto: { searchText: debouncedValue } } });
  }, [debouncedValue, getUsers]);

  const listOfTag: any[] = [];
  const listOfMention: any[] = [];
  const convertSlateValueToText = () => {
    let text = '';
    postSent?.text?.map((item: any, index: number) => {
      item.children &&
        item?.children.map &&
        item.children.map((obj: any) => {
          if (obj.type) {
            obj.type === 'tag' ? listOfTag.push(obj.id) : obj.type === 'mention' ? listOfMention.push(obj.id) : null;
          }
          obj.text
            ? (text += obj.text)
            : obj.type === 'tag'
            ? (text += `#${obj.title} `)
            : obj.type === 'mention'
            ? (text += `╣${obj.fullname}╠`)
            : (text += '');
        });
      if (index + 1 !== postSent?.text?.length) text += ' \\n';
    });
    return text;
  };

  return (
    <>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{ py: 2.25, px: 2, borderBottom: `1px solid ${theme.palette.grey[100]}` }}
      >
        <Stack direction={'row'} spacing={2.5} alignItems={'center'}>
          <IconButton
            onClick={() => {
              router.back();
              //   dispatch(resetSendPost());
            }}
            sx={{ padding: 0 }}
          >
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1">Send to</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Stack spacing={3} sx={{ p: 2 }} justifyContent="center">
          <Box sx={{ width: '100%' }}>
            <TextField
              value={searchedText}
              onChange={(e) => setSearchedText(e.target.value)}
              fullWidth
              size="small"
              placeholder="Search for People and NGO"
              InputProps={{
                endAdornment: searchedText && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchedText('')}>
                      <Icon name="Close" type="linear" color="grey.500" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {users?.length === 0 && !isFetchingUsers ? (
            <Box sx={{ marginTop: 8 }}>
              <NotFound img={'/images/peopleNotFound.svg'} text={'No connection found'} />
            </Box>
          ) : (
            <>
              <Stack spacing={2}>
                {isFetchingFollower ? (
                  <Stack alignItems="center" justifyContent="space-between" direction={'row'}>
                    <Typography variant="h6">Connections</Typography>
                    <CircularProgress size={16} />
                  </Stack>
                ) : (
                  <>
                    <Typography variant="h6">Connections</Typography>
                    {followers?.map((follower) => (
                      <>
                        <Stack
                          key={follower?.itemId}
                          direction={'row'}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack
                            sx={{ cursor: 'pointer' }}
                            direction={'row'}
                            alignItems="center"
                            spacing={2}
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
                              sx={{ width: 48, height: 48, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                            />
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                              {follower?.firstName || follower?.lastName}
                            </Typography>
                          </Stack>
                          <SendPostToUsers
                            userId={follower?.itemId}
                            text={`${convertSlateValueToText()} https://dev.aws.gardenoflove.co/post/post-details/${
                              postSent?.id
                            }`}
                          />
                        </Stack>
                        <Divider />
                      </>
                    ))}
                  </>
                )}
              </Stack>

              <Stack spacing={2}>
                {isFetchingUsers ? (
                  <Stack alignItems="center" justifyContent="space-between" direction={'row'}>
                    <Typography variant="h6">Suggestions</Typography>
                    <CircularProgress size={16} />
                  </Stack>
                ) : (
                  <>
                    <Typography variant="h6">Suggestions</Typography>
                    {users?.map((user) => (
                      <>
                        <Stack
                          key={user?.id}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (user?.userName === FilterByEnum.Normal) router.push(`/profile/user/view/${user?.id}`);
                            else if (user?.userName === FilterByEnum.Ngo) router.push(`/profile/ngo/view/${user?.id}`);
                          }}
                          direction={'row'}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack direction={'row'} alignItems="center" spacing={2}>
                            <Avatar
                              src={user?.avatarUrl || undefined}
                              variant={user?.userType === UserTypeEnum.Normal ? 'circular' : 'rounded'}
                              sx={{ width: 48, height: 48, backgroundColor: 'background.neutral', cursor: 'pointer' }}
                            />
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                              {user?.fullName}
                            </Typography>
                          </Stack>
                          <SendPostToUsers
                            userId={user?.id}
                            text={`${convertSlateValueToText()} https://dev.aws.gardenoflove.co/post/post-details/${
                              postSent?.id
                            }`}
                          />
                        </Stack>
                        <Divider />
                      </>
                    ))}
                  </>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default SendToConnections;
