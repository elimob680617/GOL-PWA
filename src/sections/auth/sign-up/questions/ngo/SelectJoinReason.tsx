import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect } from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import LoadingCircular from 'src/sections/connections/listContent/LoadingCircular';
import { useUpsertOrganizationUserReasonsJoinMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/upserReasonsJoin.generated';
import { useLazyReasonsJoinQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/reasonsJoin.generated';
import DialogIconButtons from '../common/DialogIconButtons';
import TitleAndProgress from '../common/TitleAndProgress';

const CheckBoxStyle = styled(FormControlLabel)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.grey[100],
  paddingInline: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  // width: 491,
  height: 48,
  display: 'flex',
  justifyContent: 'space-between',
  marginInline: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));
const CheckBoxGroupStyle = styled(FormGroup)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));
interface SelectReasonProps {
  authType?: UserTypeEnum;
  openReasonsDialog?: boolean;
  setOpenReasonsDialog?: React.Dispatch<
    React.SetStateAction<{
      welcome: boolean;
      gender: boolean;
      location: boolean;
      categories: boolean;
      workFields: boolean;
      joinReasons: boolean;
      suggestConnection: boolean;
      endQ: boolean;
    }>
  >;
}

export default function SelectJoinReason(props: SelectReasonProps) {
  const { authType, openReasonsDialog, setOpenReasonsDialog } = props;
  const router = useRouter();
  const { user } = useAuth();
  const [reasonIds, setReasonIds] = React.useState<string[]>([]);

  const [reasonsJoin, { data, isFetching }] = useLazyReasonsJoinQuery();
  const [upsertOrganizationUserReasonsJoin, { isLoading }] = useUpsertOrganizationUserReasonsJoinMutation();

  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'joinReasons') {
      setOpenReasonsDialog((prev) => ({ ...prev, joinReasons: true }));
    }
  }, [setOpenReasonsDialog]);

  useEffect(() => {
    reasonsJoin({
      filter: {
        dto: {},
      },
    });
  }, [authType, reasonsJoin]);

  const handleChange = (event, reasonId) => {
    if (event.target.checked) {
      setReasonIds((prevcategory) => [...prevcategory, reasonId]);
    } else {
      setReasonIds((prevcategory) => prevcategory.filter((item) => item !== reasonId));
    }
  };

  const handleSubmitReasons = async () => {
    const res: any = await upsertOrganizationUserReasonsJoin({
      filter: {
        dto: {
          reasonsJoinId: reasonIds,
        },
      },
    });
    if (res?.data?.upsertOrganizationUserReasonsJoin?.isSuccess) {
      handleRouting();
    }
  };

  const handleRouting = () => {
    setOpenReasonsDialog((prev) => ({ ...prev, suggestConnection: true, joinReasons: false }));
    localStorage.setItem('stepTitle', 'suggestConnection');
  };

  return (
    <>
      <Dialog fullWidth={true} open={openReasonsDialog}>
        <DialogTitle>
          <DialogIconButtons router={router} user={user} setOpenStatusDialog={setOpenReasonsDialog} hasBackIcon />
          <Stack alignItems="center" mb={4}>
            <TitleAndProgress step={3} userType={authType} />
          </Stack>
          <Stack alignItems="center" mb={2}>
            <Typography variant="h6" color="text.primary" textAlign="center">
              Why are you joining GOL?
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack alignItems="center" mx={-1}>
            {isFetching ? (
              <Box m={1}>
                <LoadingCircular />
              </Box>
            ) : (
              <Box>
                <FormControl component="fieldset">
                  <CheckBoxGroupStyle aria-label="position" row>
                    {data?.reasonsJoin?.listDto?.items.map((_reason) => (
                      <CheckBoxStyle
                        key={_reason?.id}
                        sx={{
                          borderColor:
                            reasonIds.findIndex((item) => item === _reason?.id) >= 0 ? 'primary.main' : 'grey.100',
                        }}
                        control={
                          <Checkbox
                            checked={reasonIds.findIndex((item) => item === _reason?.id) >= 0}
                            sx={{
                              color: 'grey.300',
                              '&.Mui-checked': {
                                '&, & + .MuiFormControlLabel-label': {
                                  color: 'primary.main',
                                },
                              },
                            }}
                            onClick={(e) => {
                              handleChange(e, _reason?.id);
                            }}
                          />
                        }
                        label={_reason?.title}
                        labelPlacement="start"
                      />
                    ))}
                  </CheckBoxGroupStyle>
                </FormControl>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mx={-1}>
            <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
              <Typography color="grey.900">Skip</Typography>
            </Button>

            <LoadingButton
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
              loading={isLoading}
              disabled={!reasonIds.length}
              onClick={handleSubmitReasons}
            >
              <Typography>Next</Typography>
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
