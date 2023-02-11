import { Button, Stack, styled, Typography, useTheme } from '@mui/material';
import { CloseCircle, UserAdd } from 'iconsax-react';
import React, { useState } from 'react';
import { RequestEnum } from 'src/@types/sections/serverTypes';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';

const MessageBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

interface UserRequestProps {
  fullName: string;
  itemId: string;
}

export default function RequestMessage(props: UserRequestProps) {
  const { fullName, itemId } = props;
  const [showData, setShowData] = useState(true);
  const theme = useTheme();
  const [changeStatus, { isLoading }] = useUpdateConnectionMutation();
  const handleChangeStatus = async (actionType: RequestEnum) => {
    const res: any = await changeStatus({
      filter: {
        dto: {
          itemId,
          actionType,
        },
      },
    });
    if (res.data.updateConnection.isSuccess) setShowData(false);
  };

  return (
    <>
      {showData && (
        <MessageBoxStyle alignItems="center" spacing={1} mb={0.25}>
          <Typography color="text.primary" variant="subtitle2">
            {fullName} wants to Follow you
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              disabled={isLoading}
              variant="contained"
              sx={{ height: 32, width: 128 }}
              color="primary"
              onClick={() => handleChangeStatus(RequestEnum.Accept)}
            >
              <UserAdd />
              <Typography ml={1}>Accept</Typography>
            </Button>
            <Button
              disabled={isLoading}
              variant="outlined"
              sx={{ height: 32, width: 128 }}
              onClick={() => handleChangeStatus(RequestEnum.Reject)}
            >
              <CloseCircle color={theme.palette.grey[900]} />
              <Typography ml={1} color="grey.900">
                Decline
              </Typography>
            </Button>
          </Stack>
        </MessageBoxStyle>
      )}
    </>
  );
}
