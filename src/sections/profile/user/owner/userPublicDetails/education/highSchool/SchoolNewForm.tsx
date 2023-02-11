import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowDown2, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, PersonSchool } from 'src/@types/sections/serverTypes';
import { FormProvider } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import { schoolWasEmpty, userSchoolsSelector } from 'src/redux/slices/profile/userSchool-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { useAddPersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/createPersonSchool.generated';
import { useUpdatePersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updatePersonSchool.generated';
import * as Yup from 'yup';
import SchoolDelete from './SchoolDelete';
import SchoolDiscard from './SchoolDiscard';
import SchoolName from './SchoolName';
import SchoolYear from './SchoolYear';
import SelectAudienceSchool from './SelectAudienceSchool';

export default function SchoolNewForm() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [dateBottomSheet, setDateBottomSheet] = useState(false);
  const [deleteBottomSheet, setDeleteBottomSheet] = useState(false);
  const [discardBottomSheet, setDiscardBottomSheet] = useState(false);
  const [audienceBottomSheet, setAudienceBottomSheet] = useState(false);
  const [nameBottomSheet, setNameBottomSheet] = useState(false);

  //Mutation
  const [createPersonSchool, { isLoading: createIsLoading }] = useAddPersonSchoolMutation();
  const [updateCurrentSchool, { isLoading: updateIsLoading }] = useUpdatePersonSchoolMutation();

  //For Redux Tools
  const dispatch = useDispatch();
  const userHighSchool = useSelector(userSchoolsSelector);
  const isEdit = !!userHighSchool?.id;

  const onSubmit = async (data: PersonSchool) => {
    if (isEdit) {
      //update mutation func
      const response: any = await updateCurrentSchool({
        filter: {
          dto: {
            id: data.id,
            year: +data.year,
            schoolId: data.school?.id,
            audience: data.audience || userHighSchool?.audience,
          },
        },
      });
      if (response?.data?.updatePersonSchool?.isSuccess) {
        enqueueSnackbar('The High school has been successfully edited ', { variant: 'success' });
        dispatch(schoolWasEmpty());
        router.back();
      } else {
        enqueueSnackbar('The High school unfortunately not edited', { variant: 'error' });
      }
    } else {
      //add mutation func
      const response: any = await createPersonSchool({
        filter: {
          dto: {
            // id: null,
            year: +data.year,
            schoolId: data.school?.id,
            audience: data.audience || userHighSchool?.audience,
          },
        },
      });
      if (response?.data?.addPersonSchool?.isSuccess) {
        enqueueSnackbar('The High school has been successfully added ', { variant: 'success' });
        dispatch(schoolWasEmpty());
        router.push('/profile/user/public-details/list');
      } else {
        enqueueSnackbar('The High school unfortunately not added', { variant: 'error' });
      }
    }
  };
  useEffect(() => {
    trigger(['school.title']);
  }, []);

  useEffect(() => {
    if (!userHighSchool) router.push('/profile/user/public-details/list');
  }, [userHighSchool, router]);

  //Yup Validation schema & RHF
  const SchoolValidationSchema = Yup.object().shape({
    school: Yup.object().shape({
      title: Yup.string().required('Required'),
    }),
  });

  const methods = useForm<PersonSchool>({
    mode: 'onChange',
    defaultValues: {
      ...userHighSchool,
    },
    resolver: yupResolver(SchoolValidationSchema),
  });

  const {
    trigger,
    getValues,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  const handleClose = () => {
    if (isDirty) {
      setDiscardBottomSheet(true);
    } else {
      router.back();
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" spacing={2} sx={{ px: 2 }} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton sx={{ p: 0 }} onClick={handleClose}>
                <Icon name="left-arrow-1" color="text.primary" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {isEdit ? 'Edit High School' : 'Add High School'}
              </Typography>
            </Stack>
            <LoadingButton
              loading={createIsLoading || updateIsLoading}
              variant="contained"
              color="primary"
              disabled={!isDirty || !isValid}
              type="submit"
            >
              {isEdit ? 'Save' : 'Add'}
            </LoadingButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              School Name*
            </Typography>
            <Box onClick={() => setNameBottomSheet(true)}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ cursor: 'pointer' }}>
                {watch('school') ? (
                  <Typography variant="body2" color="text.primary">
                    {watch('school.title')}
                    {/* {watch('school')?.title} */}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    School Name
                  </Typography>
                )}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Class Year
            </Typography>

            {watch('year') ? (
              <Typography color="text.primary" variant="body2" sx={{ cursor: 'pointer' }}>
                <Stack direction="row" alignItems="center">
                  <Typography variant="body2" color="text.secondary" onClick={() => setDateBottomSheet(true)}>
                    {watch('year')}
                  </Typography>
                  <Typography onClick={() => setValue('year', undefined, { shouldDirty: true })} sx={{ ml: 1 }}>
                    &#215;
                  </Typography>
                </Stack>
              </Typography>
            ) : (
              <Box onClick={() => setDateBottomSheet(true)}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                  Class Year
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          {!isEdit ? (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
              <Box />
              <Button
                variant="outlined"
                startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                onClick={() => {
                  setAudienceBottomSheet(true);
                }}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
                </Typography>
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 3 }}>
              <Button color="error" onClick={() => setDeleteBottomSheet(true)}>
                <Typography variant="button">Delete</Typography>
              </Button>
              <Button
                variant="outlined"
                startIcon={<Eye size="18" color={theme.palette.text.primary} />}
                onClick={() => {
                  setAudienceBottomSheet(true);
                }}
                endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
              >
                <Typography color={theme.palette.text.primary}>
                  {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
                </Typography>
              </Button>
            </Stack>
          )}
        </Stack>
      </FormProvider>

      <BottomSheet open={deleteBottomSheet} onDismiss={() => setDeleteBottomSheet(false)}>
        <SchoolDelete id={watch('id')} />
      </BottomSheet>
      <BottomSheet open={dateBottomSheet} onDismiss={() => setDateBottomSheet(false)}>
        <SchoolYear
          value={watch('year')}
          onChange={(value) => {
            setValue(`year`, value, { shouldDirty: true, shouldValidate: true });
            setDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={discardBottomSheet} onDismiss={() => setDiscardBottomSheet(false)}>
        <SchoolDiscard
          isValid={isValid}
          loading={createIsLoading || updateIsLoading}
          onSubmit={() => onSubmit(getValues())}
        />
      </BottomSheet>
      <BottomSheet open={nameBottomSheet} onDismiss={() => setNameBottomSheet(false)}>
        <SchoolName
          onChange={(val) => {
            setValue('school', val, { shouldDirty: true, shouldValidate: true });
            setNameBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={audienceBottomSheet} onDismiss={() => setAudienceBottomSheet(false)}>
        <SelectAudienceSchool
          value={watch('audience')}
          onChange={(val) => {
            setValue('audience', val, { shouldDirty: true, shouldValidate: true });
            setAudienceBottomSheet(false);
          }}
        />
      </BottomSheet>
    </>
  );
}
