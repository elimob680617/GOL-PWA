import { Button, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { Lock, More, Slash, UserRemove } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { AccountPrivacyEnum, ConnectionStatusEnum, FilterByEnum, RequestEnum } from 'src/@types/sections/serverTypes';
// import ThreeDotBottomSheet from 'src/sections/profile/components/ThreeDotOnView/ThreeDotBottomSheet';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';
import ProfileButtonChecker from '../../components/ProfileButtonChecker';
// import BlockProfile from '../../components/ThreeDotOnView/BlockProfile';

const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

interface UserButtonStatusViewProp {
  user: any;
  itemId?: string;
}
export default function ButtonStatusView(props: UserButtonStatusViewProp) {
  const { user, itemId } = props;
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const ID = router?.query?.id?.[0];

  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  const [openBlock, setOpenBlock] = React.useState(false);
  const [openReportProfile, setOpenReportProfile] = React.useState(false);

  const userIsVisible =
    user?.accountPrivacy === AccountPrivacyEnum.Public ||
    user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted;
  const userBlockStatus = user?.connectionDto?.meBlockedOther || user?.connectionDto?.otherBlockedMe;

  const [changeStatus] = useUpdateConnectionMutation();

  const handleBlock = async () => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId,
          actionType: RequestEnum.Block,
        },
      },
    });
    if (res?.data?.updateConnection?.isSuccess) {
      setOpenBlock(false);
    } else {
      setOpenBlock(false);
      enqueueSnackbar(`${res?.data?.updateConnection?.messagingKey}`, { variant: 'error' });
    }
  };

  const handleChangeStatus = async (actionType: RequestEnum) => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId,
          actionType,
        },
      },
    });
    if (res?.data?.updateConnection?.isSuccess) {
      console.log('Unblock');
    } else {
      enqueueSnackbar(`${res?.data?.updateConnection?.messagingKey}`, { variant: 'error' });
    }
  };

  return (
    <>
      {!user?.connectionDto?.otherBlockedMe ? (
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          mt={0.25}
          sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}
        >
          {!user?.connectionDto?.meBlockedOther ? (
            <>
              <ProfileButtonChecker
                itemId={user?.connectionDto?.itemId}
                itemType={FilterByEnum.Normal}
                meToOther={user?.connectionDto?.meToOtherStatus}
                otherToMe={user?.connectionDto?.otherToMeStatus}
                fullName={`${user?.personDto?.firstName} ${user?.personDto?.lastName}`}
              />
              <Button
                size="small"
                sx={{
                  width: 128,
                  height: 32,
                  px: 4.3,
                  py: 0.8,
                  borderColor: 'grey.300',
                  backgroundColor: 'background.paper',
                  ml: 2,
                }}
                variant="contained"
              >
                <Typography color="grey.900">Message</Typography>
              </Button>
            </>
          ) : (
            <Button
              sx={{ height: 32, width: 280 }}
              variant="contained"
              color="primary"
              onClick={() => handleChangeStatus(RequestEnum.UnBlock)}
            >
              <UserRemove size="24" />
              <Typography ml={1}>Unblock</Typography>
            </Button>
          )}
          <IconButton
            onClick={() => {
              setOpenSheet(true);
            }}
          >
            <More color={theme.palette.text.secondary} />
          </IconButton>
        </Stack>
      ) : (
        !user?.meReportedOther && (
          <>
            <Divider />
            <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
              <Slash color={theme.palette.grey[700]} />
              <Typography color="text.primary" variant="subtitle2">
                You have been blocked by this user.
              </Typography>
            </MessageBoxStyle>
            <Divider />
          </>
        )
      )}
      {!userIsVisible && !userBlockStatus && (
        <>
          <Divider />
          <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
            <Lock color={theme.palette.grey[700]} variant="Bold" />
            <Typography color="text.primary" variant="subtitle2">
              This Account is Private.
            </Typography>
          </MessageBoxStyle>
          <Divider />
        </>
      )}

      <BottomSheet open={openSheet} onDismiss={() => setOpenSheet(false)}>
        {/* <ThreeDotBottomSheet
          setOpenReportProfile={setOpenReportProfile}
          setOpenBlock={setOpenBlock}
          itemId={itemId}
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          fullName={user?.personDto?.fullName}
          isBlocked={user?.connectionDto?.meBlockedOther}
          isReported={user?.meReportedOther}
          isFollowing={user?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        /> */}
      </BottomSheet>
      <BottomSheet open={openBlock} onDismiss={() => setOpenBlock(!openBlock)}>
        {/* <BlockProfile onClose={setOpenBlock} handleBlock={handleBlock} fullName={user?.personDto?.fullName} /> */}
      </BottomSheet>
    </>
  );
}
