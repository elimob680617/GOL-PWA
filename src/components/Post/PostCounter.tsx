import { AvatarGroup, Avatar, Typography, Button, Stack } from '@mui/material';
import { FC } from 'react';
import { styled } from '@mui/material/styles';

interface IPostCounter {
  counter?: any;
  lastpersonName?: any;
  lastpersonsData?: any;
  Comments?: string;
  type: boolean;
  endorseTitle?: string;
}

const PostCounterEndorseCTA = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem',
}));
const PostCounter: FC<IPostCounter> = ({ counter, lastpersonName, lastpersonsData, Comments, type, endorseTitle }) => (
  <Stack alignItems="center" justifyContent="space-between" direction="row">
    <Stack spacing={0.5} direction="row" alignItems="center">
      <AvatarGroup max={4} total={0}>
        {lastpersonsData?.map((item: any) => (
          <Avatar key={item.id} sx={{ width: 16, height: 16 }} alt={item.fullName} src={item.avatarUrl} />
        ))}
      </AvatarGroup>
    </Stack>
    {/* {type ? ( */}
    {counter !== 1 ? (
      <Typography variant="button">{lastpersonsData[0]?.fullName} liked this post</Typography>
    ) : (
      <Typography variant="button">
        {lastpersonsData[0]?.fullName} and {counter} others liked this post
      </Typography>
    )}
    {/* // ) : (
    //   <PostCounterEndorseCTA>
    //     <div>{endorseTitle}</div>
    //     <Button
    //       variant="outlined"
    //       sx={{ borderColor: '#C8D3D9', borderRadius: '8px', width: '5.37rem', height: '2.5rem', color: '#354752' }}
    //     >
    //       <Typography variant="button">Endorse</Typography>
    //     </Button>
    //   </PostCounterEndorseCTA>
    // )} */}
  </Stack>
);

export default PostCounter;
