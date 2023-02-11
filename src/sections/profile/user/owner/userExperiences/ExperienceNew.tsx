import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import { ArrowDown2, Camera, Eye } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, EmploymentTypeEnum, Experience } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import {
  emptyExperience,
  experienceAdded,
  userExperienceSelector
} from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
// import components
import ExperienceEmployment from 'src/sections/profile/user/owner/userExperiences/ExperienceEmployment';
import getMonthName from 'src/utils/getMonthName';
import { useAddExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/addExperience.generated';
import { useUpdateExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/updateExperience.generated';
import * as Yup from 'yup';
import ExperienceCompany from './ExperienceCompany';
import ExperienceDate from './ExperienceDate';
import ExperienceDeleteConfirm from './ExperienceDeleteConfirm';
import ExperienceDiscard from './ExperienceDiscard';
import ExperienceEditPhoto from './ExperienceEditPhoto';
import ExperienceLocation from './ExperienceLocation';
import ExperiencePhoto from './ExperiencePhoto';
import SelectExperienceAudience from './SelectExperienceAudience';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '46%',
  transform: 'translate(0, -50%)',
  zIndex: 1,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function ExperienceNew() {
  const router = useRouter();
  const experienceData = useSelector(userExperienceSelector);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [addExperienceMutate, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperienceMutate, { isLoading: updateLoading }] = useUpdateExperienceMutation();

  // useState for bottomSheet;
  const [employmentBottomSheet, setEmploymentBottomSheet] = useState(false);
  const [companyNameBottomSheet, setCompanyNameBottomSheet] = useState(false);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const [dateBottomSheet, setDateBottomSheet] = useState(false);
  const [audienceBottomSheet, setAudienceBottomSheet] = useState(false);
  const [discardExperienceBottomSheet, setDiscardExperienceBottomSheet] = useState(false);
  const [deleteExperienceBottomSheet, setDeleteExperienceBottomSheet] = useState(false);
  const [editExperiencePhoto, setEditExperiencePhoto] = useState(false);
  const [newPhotoExperienceBottomSheet, setNewPhotoExperienceBottomSheet] = useState(false);
  //
  const [statusDate, setStatusDate] = useState<'startDate' | 'endDate' | undefined>();

  useEffect(() => {
    if (!experienceData) router.push('/profile/user/experience/list');
  }, [experienceData, router]);

  const ExperienceFormSchema = Yup.object().shape({
    title: Yup.string().required(''),
    companyDto: Yup.object().shape({
      title: Yup.string().required(''),
    }),
    employmentType: Yup.string().required(''),
    startDate: Yup.string().required(''),
    stillWorkingThere: Yup.boolean(),
    endDate: Yup.string()
      .nullable()
      .when('stillWorkingThere', {
        is: false,
        then: Yup.string().required('Required'),
      }),
  });
  const dispatch = useDispatch();

  const methods = useForm<Experience & { titleView?: boolean; descView?: boolean }>({
    resolver: yupResolver(ExperienceFormSchema),
    defaultValues: {
      ...experienceData,
      titleView: true,
      descView: true,
    },
    mode: 'onChange',
  });
  const {
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  useEffect(() => {
    trigger(['companyDto.title', 'title', 'employmentType', 'startDate', 'endDate', 'stillWorkingThere']);
  }, [trigger]);

  const onSubmit = async (data: Experience) => {
    const startDate = new Date(data.startDate);
    let endDate;
    if (data.stillWorkingThere) endDate = undefined;
    else if (data.endDate) {
      const date = new Date(data.endDate);
      endDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-01';
    }

    if (data.id) {
      const res: any = await updateExperienceMutate({
        filter: {
          dto: {
            id: data.id,
            audience: data.audience,
            employmentType: data.employmentType,
            description: data.description,
            mediaUrl: data.mediaUrl,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            companyId: data.companyDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });
      if (res?.data?.updateExperience?.isSuccess) {
        enqueueSnackbar('update successfully', { variant: 'success' });
        dispatch(emptyExperience());
        router.push('/profile/user/experience/list');
      }
    } else {
      const res: any = await addExperienceMutate({
        filter: {
          dto: {
            audience: data.audience,
            employmentType: data.employmentType,
            description: data.description,
            mediaUrl: data.mediaUrl,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            companyId: data.companyDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });

      if (res?.data?.addExperience?.isSuccess) {
        enqueueSnackbar('Experience successfully', { variant: 'success' });
        dispatch(emptyExperience());
        router.push('/profile/user/experience/list');
      }
    }
  };

  const handleNavigation = (url: string) => {
    dispatch(experienceAdded({ ...getValues(), isChange: isDirty || experienceData.isChange }));
    router.push(url);
  };

  const handleClose = () => {
    if (isDirty || experienceData.isChange) {
      setDiscardExperienceBottomSheet(true);
    } else {
      dispatch(emptyExperience());
      router.back();
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ p: 0 }} onClick={handleClose}>
                <Icon name="left-arrow-1" color="text.primary" />
              </IconButton>
              <Typography variant="subtitle1" color="text.primary">
                {experienceData?.id ? 'Edit Experience' : 'Add Experience'}
              </Typography>
            </Stack>
            <LoadingButton
              loading={addLoading || updateLoading}
              type="submit"
              variant="contained"
              disabled={!isValid || !isDirty}
              color="primary"
            >
              {experienceData?.id ? 'Save' : 'Add'}
            </LoadingButton>
          </Stack>
          <Divider sx={{ height: 2 }} />

          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Title*
            </Typography>
            {watch('titleView') ? (
              <Typography
                variant="body2"
                color={watch('title') ? 'text.primary' : 'text.secondary'}
                onClick={() => setValue('titleView', false)}
              >
                {watch('title') || 'Ex: Sales Manager'}
              </Typography>
            ) : (
              <Box>
                <RHFTextField
                  placeholder="Ex: Sales Manager"
                  name="title"
                  size="small"
                  error={false}
                  inputProps={{ maxLength: 60 }}
                  onBlur={() => setValue('titleView', true, { shouldDirty: true })}
                  autoFocus
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={{ width: '100%', textAlign: 'right' }}
                >
                  {watch('title')?.length || 0}/60
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Employment Type*
            </Typography>
            <Box sx={{ cursor: 'pointer' }} onClick={() => setEmploymentBottomSheet(true)}>
              {watch('employmentType') ? (
                <Typography variant="body2" color="text.primary">
                  {Object.keys(EmploymentTypeEnum)
                    [Object.values(EmploymentTypeEnum).indexOf(watch('employmentType'))].replace(/([A-Z])/g, ' $1')
                    .trim()}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Ex: Full Time
                </Typography>
              )}
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Company name*
            </Typography>
            <Box sx={{ cursor: 'pointer' }} onClick={() => setCompanyNameBottomSheet(true)}>
              {watch('companyDto') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('companyDto.title')}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  EX: Software Genesis Group
                </Typography>
              )}
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Location
            </Typography>
            {watch('cityDto') ? (
              <Typography variant="body2" color="text.primary">
                {watch('cityDto.name')}
                <IconButton
                  onClick={() => {
                    setValue('cityDto', undefined, { shouldDirty: true });
                    // dispatch(experienceAdded({ ...getValues(), cityDto: undefined }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box sx={{ cursor: 'pointer' }} onClick={() => setLocationBottomSheet(true)}>
                <Typography variant="body2" color="text.secondary">
                  Ex: England, London
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="body2" color="text.primary">
              <RHFCheckbox
                name="stillWorkingThere"
                label="I am currently work in this role"
                sx={{
                  color: ' primary.main',
                  height: 0,
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            </Typography>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Start Date*
            </Typography>
            {watch('startDate') ? (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(watch('startDate')))}, {new Date(watch('startDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('startDate', undefined, { shouldValidate: true, shouldDirty: true });
                    // dispatch(experienceAdded({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setDateBottomSheet(true);
                  setStatusDate('startDate');
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              End Date{!watch('stillWorkingThere') && '*'}
            </Typography>
            {watch('endDate') && !watch('stillWorkingThere') ? (
              <Typography variant="body2" color="text.primary">
                {getMonthName(new Date(watch('endDate')))}, {new Date(watch('endDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('endDate', undefined, { shouldValidate: true, shouldDirty: true });
                    dispatch(experienceAdded({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box
                sx={{ cursor: !watch('stillWorkingThere') ? 'pointer' : 'default' }}
                onClick={() => {
                  watch('stillWorkingThere') ? undefined : setDateBottomSheet(true);
                  setStatusDate('endDate');
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {watch('stillWorkingThere') ? 'Present' : 'End Date'}
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Description
            </Typography>
            {watch('descView') ? (
              <Typography
                variant="body2"
                color={watch('description') ? 'text.primary' : 'text.secondary'}
                onClick={() => setValue('descView', false)}
              >
                {watch('description') || 'Add Detail and Description about your Experience.'}
              </Typography>
            ) : (
              <Box>
                <RHFTextField
                  size="small"
                  multiline
                  name="description"
                  placeholder="Add Detail and Description about your Experience."
                  inputProps={{ maxLength: 500 }}
                  onBlur={() => setValue('descView', true)}
                  autoFocus
                  maxRows={4}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={{ width: '100%', textAlign: 'right' }}
                >
                  {watch('description')?.length || 0}/500
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Photo
            </Typography>
            <Stack>
              {!watch('mediaUrl') ? (
                <Stack direction="row" justifyContent={'space-between'}>
                  <Typography variant="body2" color="text.primary">
                    Add photos.
                  </Typography>
                  <Typography
                    variant="overline"
                    color="primary.main"
                    sx={{ cursor: 'pointer', textTransform: 'none' }}
                    component="div"
                    onClick={() => setNewPhotoExperienceBottomSheet(true)}
                  >
                    + Add Photo
                  </Typography>
                </Stack>
              ) : (
                <Box display="flex" justifyContent="center" position="relative">
                  <IconButtonStyle onClick={() => setEditExperiencePhoto(true)}>
                    {/* <Icon name="add-photo" color="text.secondary" /> */}
                    <Camera size="24" color={theme.palette.text.secondary} />
                  </IconButtonStyle>
                  <Box>
                    <Image
                      onClick={() => () => setEditExperiencePhoto(true)}
                      src={watch('mediaUrl')}
                      width={328}
                      height={184}
                      alt="experience-photo"
                    />
                  </Box>
                </Box>
              )}
            </Stack>
          </Stack>

          <Divider />
          <Stack sx={{ px: 2 }} direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={0.5}>
              {experienceData?.id && (
                <Button
                  color="error"
                  variant="text"
                  sx={{ width: 105 }}
                  onClick={() => setDeleteExperienceBottomSheet(true)}
                >
                  Delete
                </Button>
              )}
            </Stack>

            <Button
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
              onClick={() => {
                dispatch(experienceAdded(getValues()));
                setAudienceBottomSheet(true);
              }}
              endIcon={<ArrowDown2 size="16" color={theme.palette.text.primary} />}
            >
              <Typography color={theme.palette.text.primary}>
                {Object.keys(AudienceEnum)[Object.values(AudienceEnum).indexOf(watch('audience'))]}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
      <BottomSheet open={employmentBottomSheet} onDismiss={() => setEmploymentBottomSheet(false)}>
        <ExperienceEmployment
          onChange={(value) => {
            setValue('employmentType', value, { shouldDirty: true, shouldValidate: true }),
              setEmploymentBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={companyNameBottomSheet}
        onDismiss={() => setCompanyNameBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <ExperienceCompany
          onChange={(value) => {
            setValue('companyDto', value, { shouldDirty: true, shouldValidate: true });
            setCompanyNameBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={locationBottomSheet}
        onDismiss={() => setLocationBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <ExperienceLocation
          onChange={(value) => {
            setValue('cityDto', value, { shouldDirty: true });
            setLocationBottomSheet(false);
          }}
        />
      </BottomSheet>

      <BottomSheet open={dateBottomSheet} onDismiss={() => setDateBottomSheet(false)}>
        <ExperienceDate
          startDate={watch('startDate')}
          endDate={watch('endDate')}
          isEndDate={statusDate === 'endDate'}
          onChange={(value) => {
            setValue(statusDate === 'startDate' ? 'startDate' : 'endDate', value, {
              shouldDirty: true,
              shouldValidate: true,
            }),
              setDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={audienceBottomSheet} onDismiss={() => setAudienceBottomSheet(false)}>
        <SelectExperienceAudience
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setAudienceBottomSheet(false);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>

      <BottomSheet open={discardExperienceBottomSheet} onDismiss={() => setDiscardExperienceBottomSheet(false)}>
        <ExperienceDiscard
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscardExperienceBottomSheet(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>

      <BottomSheet open={deleteExperienceBottomSheet} onDismiss={() => setDeleteExperienceBottomSheet(false)}>
        <ExperienceDeleteConfirm />
      </BottomSheet>

      <BottomSheet open={newPhotoExperienceBottomSheet} onDismiss={() => setNewPhotoExperienceBottomSheet(false)}>
        <ExperiencePhoto
          onChange={(value) => {
            setValue('mediaUrl', value, { shouldDirty: true, shouldValidate: true }),
              setNewPhotoExperienceBottomSheet(false);
          }}
          onClose={() => {
            setNewPhotoExperienceBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={editExperiencePhoto} onDismiss={() => setEditExperiencePhoto(false)}>
        <ExperienceEditPhoto
          onUpload={() => {
            setEditExperiencePhoto(false);
            setNewPhotoExperienceBottomSheet(true);
          }}
          onRemove={(value) => {
            setValue('mediaUrl', value, { shouldDirty: true, shouldValidate: true });
            setEditExperiencePhoto(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default ExperienceNew;
