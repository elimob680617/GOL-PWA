import { Button, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { More, Slash, UserRemove } from 'iconsax-react';
import Link from 'next/link';
import React from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { ConnectionStatusEnum, FilterByEnum, RequestEnum } from 'src/@types/sections/serverTypes';
// import ThreeDotBottomSheet from 'src/sections/profile/components/ThreeDotOnView/ThreeDotBottomSheet';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';
import ProfileButtonChecker from '../../components/ProfileButtonChecker';
// import BlockProfile from '../../components/ThreeDotOnView/BlockProfile';

const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

interface NgoButtonStatusViewProp {
  ngo: any;
  itemId?: string;
}

export default function ButtonStatusView(props: NgoButtonStatusViewProp) {
  const { ngo, itemId } = props;
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  const [openBlock, setOpenBlock] = React.useState(false);
  const [openReportProfile, setOpenReportProfile] = React.useState(false);
  const theme = useTheme();
  const [changeStatus, { isLoading }] = useUpdateConnectionMutation();
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
    if (res.data.updateConnection.isSuccess) {
      console.log('Unblock');
    }
  };

  return (
    <>
      {!ngo?.connectionDto?.otherBlockedMe ? (
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          mt={0.25}
          sx={{ backgroundColor: 'background.paper', borderRadius: 1, px: 2, py: 2 }}
        >
          {!ngo?.connectionDto?.meBlockedOther ? (
            <>
              <ProfileButtonChecker
                fullName={ngo?.organizationUserDto?.fullName}
                itemId={ngo?.connectionDto?.itemId}
                itemType={FilterByEnum.Ngo}
                meToOther={ngo?.connectionDto?.meToOtherStatus}
                otherToMe={ngo?.connectionDto?.otherToMeStatus}
              />
              <Link href="#" passHref>
                <Button
                  size="large"
                  variant="outlined"
                  sx={{
                    width: 128,
                    height: 32,
                    px: 4.3,
                    py: 0.8,
                    borderColor: 'grey.300',
                    backgroundColor: 'background.paper',
                    ml: 2,
                    // '@media (max-width:425px)': {
                    //   mt: 2,
                    //   ml: 0,
                    // },
                  }}
                >
                  <Typography sx={{ ml: 1.5 }} color="grey.900">
                    Message
                  </Typography>
                </Button>
              </Link>
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
            sx={{ ml: 3 }}
            onClick={() => {
              setOpenSheet(true);
            }}
          >
            <More color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
      ) : (
        <>
          {ngo?.connectionDto?.otherBlockedMe && (
            <>
              <MessageBoxStyle direction="row" alignItems="center" spacing={1}>
                <Slash color={theme.palette.grey[700]} />
                <Typography color="text.primary" variant="subtitle2">
                  You have been blocked by this user.
                </Typography>
              </MessageBoxStyle>
            </>
          )}
        </>
      )}
      <BottomSheet open={openSheet} onDismiss={() => setOpenSheet(!openSheet)}>
        {/* <ThreeDotBottomSheet
          itemId={itemId}
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          fullName={ngo?.organizationUserDto?.fullName}
          isBlocked={ngo?.connectionDto?.meBlockedOther}
          setOpenBlock={setOpenBlock}
          setOpenReportProfile={setOpenReportProfile}
          isReported={ngo?.meReportedOther}
          isFollowing={ngo?.connectionDto?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        /> */}
      </BottomSheet>
      <BottomSheet open={openBlock} onDismiss={() => setOpenBlock(!openBlock)}>
        {/* <BlockProfile onClose={setOpenBlock} handleBlock={handleBlock} fullName={ngo?.organizationUserDto?.fullName} /> */}
      </BottomSheet>
    </>
  );
}
