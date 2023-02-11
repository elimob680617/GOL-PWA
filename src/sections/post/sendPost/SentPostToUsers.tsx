import { Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { resetSendPost } from 'src/redux/slices/post/sendPost';
import { dispatch } from 'src/redux/store';
import { useCreateMessageByUserNameMutation } from 'src/_requests/graphql/chat/mutations/createMessageByUserName.generated';

function SendPostToUsers(props) {
  const { userId, text } = props;
  const [createMessageByUserName, { isLoading, isSuccess }] = useCreateMessageByUserNameMutation();
  const sendPostHandler = async () => {
    const { data }: any = await createMessageByUserName({
      message: { dto: { toUserId: userId, text: text, readMessage: false } },
    });
    // Router.push(`/chat/${data?.createMessageByUserName?.listDto?.items[0]?.roomId}`);
    if (data?.createMessageByUserName?.listDto?.items[0]?.roomId) {
      dispatch(resetSendPost());
    }
  };
  return (
    <>
      {!isSuccess ? (
        <LoadingButton
          variant="contained"
          sx={{ height: 32 }}
          onClick={sendPostHandler}
          loading={isLoading}
          size="small"
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>Send</Box>
        </LoadingButton>
      ) : (
        <Button disabled variant="secondary" sx={{ height: 32 }} size="small">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>Sent</Box>
        </Button>
      )}
    </>
  );
}

export default SendPostToUsers;
