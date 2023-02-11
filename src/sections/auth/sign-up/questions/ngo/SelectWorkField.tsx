import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect } from 'react';
import { GroupCategoryTypeEnum, OrgUserFieldEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import useAuth from 'src/hooks/useAuth';
import LoadingCircular from 'src/sections/connections/listContent/LoadingCircular';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoMainProfile/mutations/updateOrganizationUserField.generated';
import { useLazySearchGroupCategoriesQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';
import DialogIconButtons from '../common/DialogIconButtons';
import TitleAndProgress from '../common/TitleAndProgress';

const DataBoxStyle = styled(ToggleButtonGroup)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 0,
  gap: theme.spacing(1),
  // paddingLeft: theme.spacing(3),
  border: 'unset !important',
  // maxHeight: 263,
  // overflowY: 'scroll',
  '& .MuiToggleButtonGroup-grouped': {
    border: '1px solid  !important',
    borderColor: `${theme.palette.grey[100]} !important`,
    borderRadius: `${theme.spacing(2)} !important`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
  '& .Mui-selected': {
    borderColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));
const ToggleButtonStyle = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  paddingInline: theme.spacing(2.9),
  paddingTop: theme.spacing(1.9),
  paddingBottom: theme.spacing(1.9),
  cursor: 'pointer',
  height: 48,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 0,
  '& .MuiToggleButton-root': {
    borderRadius: theme.spacing(2),
  },
}));
interface SelectFieldProps {
  authType?: UserTypeEnum;
  openFieldDialog?: boolean;
  setOpenFieldDialog?: React.Dispatch<
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

export default function SelectWorkField(props: SelectFieldProps) {
  const { authType, openFieldDialog, setOpenFieldDialog } = props;
  const { user } = useAuth();
  const router = useRouter();

  const [field, setField] = React.useState('');

  const [searchCategories, { data, isFetching }] = useLazySearchGroupCategoriesQuery();
  const [updateProfileField, { isLoading }] = useUpdateOrganizationUserFieldMutation();

  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'workFields') {
      setOpenFieldDialog((prev) => ({ ...prev, workFields: true }));
    }
  }, [setOpenFieldDialog]);

  useEffect(() => {
    searchCategories({
      filter: {
        dto: {
          groupCategoryType: GroupCategoryTypeEnum.Category,
          title: '',
        },
      },
    });
  }, [searchCategories]);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newField: string) => {
    setField(newField);
  };

  const handleSubmitGender = async () => {
    const res: any = await updateProfileField({
      filter: {
        dto: {
          field: OrgUserFieldEnum.GroupCategory,
          groupCategoryId: field,
        },
      },
    });
    if (res?.data?.updateOrganizationUserField?.isSuccess) {
      handleRouting();
    }
  };

  const handleRouting = () => {
    setOpenFieldDialog((prev) => ({ ...prev, workFields: false, joinReasons: true }));
    localStorage.setItem('stepTitle', 'joinReasons');
  };

  return (
    <>
      <Dialog fullWidth={true} open={openFieldDialog}>
        <DialogTitle>
          <DialogIconButtons router={router} user={user} setOpenStatusDialog={setOpenFieldDialog} hasBackIcon />
          <Stack alignItems="center" mb={4}>
            <TitleAndProgress step={2} userType={authType} />
          </Stack>
          <Stack alignItems="center" mb={2}>
            <Typography variant="h6" color="text.primary">
              What is your working field?
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
                <DataBoxStyle color="primary" value={field} exclusive onChange={handleChange}>
                  {data?.searchGroupCategories?.listDto?.items?.map((_field) => (
                    <ToggleButtonStyle key={_field?.id} value={_field?.id}>
                      {_field?.title}
                    </ToggleButtonStyle>
                  ))}
                </DataBoxStyle>
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
              loading={isLoading}
              disabled={!field}
              onClick={handleSubmitGender}
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
            >
              <Typography>Next</Typography>
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
