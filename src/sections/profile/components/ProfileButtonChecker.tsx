import { LoadingButton } from '@mui/lab';
import { Box, Button, ButtonProps, Divider, Icon, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { CloseCircle, TickCircle, UserAdd, UserMinus } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { FC, ReactNode, useLayoutEffect, useState, useEffect } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { ConnectionStatusEnum, ConnectionStatusType, FilterByEnum, FollowedItemTypeEnum, RequestEnum } from 'src/@types/sections/serverTypes';
import { useFollowMutation } from 'src/_requests/graphql/connection/mutations/follow.generated';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';

interface ProfileButtonCheckerProps {
  meToOther?: ConnectionStatusEnum | ConnectionStatusType;
  otherToMe?: ConnectionStatusEnum | ConnectionStatusType;
  itemType: FilterByEnum;
  itemId: string;
  fullName: string;
}

const ProfileButtonChecker: FC<ProfileButtonCheckerProps> = (props) => {
  const { meToOther, otherToMe, fullName, itemId, itemType } = props;
  const [changeStatus, { isLoading: updateLoading }] = useUpdateConnectionMutation();
  const [followUser, { isLoading: followLoading }] = useFollowMutation();

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const _Id = router?.query?.id?.[0];
  const theme = useTheme();
  const [buttonStatus, setButtonStatus] = useState(false);
  const [buttonAtt, setButtonAtt] = useState<{
    variant: ButtonProps['variant'];
    text: string;
    px: number;
    py: number;
    backgroundColor: string;
    borderColor: string;
    startIcon?: ReactNode;
    actionType?: RequestEnum;
  }>({
    variant: 'contained',
    text: 'Follow',
    px: 2.9,
    py: 0.5,
    backgroundColor: '',
    borderColor: '',
    startIcon: <UserAdd />,
  });
  const [connectionState, setConnectionState] = useState<{
    otherToMe: ConnectionStatusEnum | ConnectionStatusType | undefined;
    meToOther: ConnectionStatusEnum | ConnectionStatusType | undefined;
  }>({
    otherToMe: undefined,
    meToOther: undefined,
  });

  useEffect(() => {
    setConnectionState({
      otherToMe,
      meToOther,
    });
  }, [meToOther, otherToMe]);

  useLayoutEffect(() => {
    switch (connectionState.meToOther) {
      case ConnectionStatusEnum.Accepted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: 'gray.100',
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case ConnectionStatusEnum.Muted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: 'gray.100',
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case ConnectionStatusEnum.Requested:
        setButtonAtt({
          variant: 'outlined',
          text: 'Requested',
          px: 3.1,
          py: 0.9,
          backgroundColor: '',
          borderColor: 'gray.300',
          actionType: RequestEnum.Remove,
        });
        break;

      default:
        setButtonAtt({
          variant: 'contained',
          text: 'Follow',
          px: 2.9,
          py: 0.5,
          backgroundColor: '',
          borderColor: '',
          startIcon: <UserAdd />,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState.meToOther]);

  const handleChangeStatus = async (actionType: RequestEnum) => {
    const { data }: any = await changeStatus({
      filter: {
        dto: {
          itemId:itemId || _Id,
          actionType,
        },
      },
    });
    const res = data?.updateConnection?.listDto?.items?.[0];
    if (data?.updateConnection?.isSuccess) {
      setConnectionState({
        meToOther: res?.meToOtherStatus,
        otherToMe: res?.otherToMeStatus,
      });
    } else {
      enqueueSnackbar(`${data?.updateConnection?.messagingKey}`, { variant: 'error' });
    }
  };
  const handleFollow = async () => {
    const { data }: any = await followUser({
      filter: {
        dto: {
          itemId : itemId || _Id,
          itemType,
        },
      },
    });
    const res = data?.follow?.listDto?.items?.[0];
    if (data?.follow?.isSuccess) {
      setConnectionState({
        meToOther: res?.meToOtherStatus,
        otherToMe: res?.otherToMeStatus,
      });
    } else {
      enqueueSnackbar(`${data?.follow?.messagingKey}`, { variant: 'error' });
    }
  };

  return (
    <>
      {connectionState.otherToMe === ConnectionStatusEnum.Requested ? (
        <>
          <IconButton onClick={() => handleChangeStatus(RequestEnum.Reject)}>
            <CloseCircle color={theme.palette.error.main} />
          </IconButton>
          <IconButton onClick={() => handleChangeStatus(RequestEnum.Accept)}>
            <TickCircle color={theme.palette.primary.main} variant="Bold" />
          </IconButton>
        </>
      ) : (
        <LoadingButton
          loading={updateLoading || followLoading}
          onClick={() => {
            if (!buttonAtt.actionType) {
              handleFollow();
            } else if (buttonAtt.actionType === RequestEnum.Unfollow) {
              setButtonStatus(true);
            } else {
              handleChangeStatus(buttonAtt.actionType);
            }
          }}
          variant={buttonAtt.variant}
          size="small"
          startIcon={buttonAtt.startIcon}
          sx={{
            px: buttonAtt.px,
            py: buttonAtt.py,
            backgroundColor: buttonAtt.backgroundColor,
            borderColor: buttonAtt.borderColor,
            width: 120,
            height: 32,
          }}
        >
          {buttonAtt.text}
        </LoadingButton>
      )}

      <BottomSheet open={buttonStatus} onDismiss={() => setButtonStatus(false)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" color="text.primary">
                Are you sure to unfollow this user?
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={1} px={2} sx={{ alignItems: 'flex-start' }}>
            <Button
              onClick={() => handleChangeStatus(RequestEnum?.Unfollow)}
              variant="text"
              size="large"
              startIcon={<UserMinus color={theme.palette.error.main} />}
              sx={{
                height: 32,
                justifyContent: 'stretch',
                color: theme.palette.error.main,
              }}
            >
              Unfollow
            </Button>
            <Button
              onClick={() => setButtonStatus(false)}
              variant="text"
              size="large"
              startIcon={<CloseCircle />}
              sx={{
                justifyContent: 'stretch',
                height: 32,
                color: theme.palette.text.primary,
              }}
            >
              Discard
            </Button>
          </Stack>
        </Stack>
      </BottomSheet>
    </>
  );
};

export default ProfileButtonChecker;
