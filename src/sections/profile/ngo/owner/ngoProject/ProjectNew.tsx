import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, IconButton, Stack, styled, Typography, useTheme, CircularProgress } from '@mui/material';
import { ArrowDown2, ArrowLeft, Camera, CloseSquare, Eye } from 'iconsax-react';
import RemovePhoto from 'public/icons/removePhoto/Vector.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { AudienceEnum, Project } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import getMonthName from 'src/utils/getMonthName';
// services !
import { useAddProjectMutation } from 'src/_requests/graphql/profile/ngoProject/mutations/addProject.generated';
import { useUpdateProjectMutation } from 'src/_requests/graphql/profile/ngoProject/mutations/updateProject.generated';
import { useUpdateProjectMediaMutation } from 'src/_requests/graphql/profile/ngoProject/mutations/updateProjectMedia.generated';
import { useLazyGetProjectsQuery } from 'src/_requests/graphql/profile/ngoProject/queries/getProject.generated';
// ---
import * as Yup from 'yup';
import ProjectDate from './ProjectDate';
import ProjectDeleteConfirm from './ProjectDeleteConfirm';
import ProjectDiscard from './ProjectDiscard';
import ProjectEditPhoto from './ProjectEditPhoto';
import ProjectLocation from './ProjectLocation';
import ProjectPhoto from './ProjectPhoto';
import SelectProjectAudience from './SelectProjectAudience';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(3),
  right: theme.spacing(0.5),
  transform: 'translate(0, -50%)',
  zIndex: 1,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

function ProjectNew() {
  const router = useRouter();
  const id = router?.query?.id?.[0];
  const isEdit = !!id;
  const [getProject, { data, isFetching }] = useLazyGetProjectsQuery();
  const projectData = data?.getProjects?.listDto?.items?.[0];

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  // mutations
  const [addProjectMutate, { isLoading: addLoading }] = useAddProjectMutation();
  const [updateProjectMutate, { isLoading: updateLoading }] = useUpdateProjectMutation();
  const [updateProjectMedia, { isLoading: updateLoadingMedia }] = useUpdateProjectMediaMutation();
  // useState for bottomSheet;

  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const [dateBottomSheet, setDateBottomSheet] = useState(false);
  const [audienceBottomSheet, setAudienceBottomSheet] = useState(false);
  const [discardProjectBottomSheet, setDiscardProjectBottomSheet] = useState(false);
  const [deleteProjectBottomSheet, setDeleteProjectBottomSheet] = useState(false);
  const [editProjectPhoto, setEditProjectPhoto] = useState(false);
  const [newPhotoProjectBottomSheet, setNewPhotoProjectBottomSheet] = useState(false);
  //
  const [statusDate, setStatusDate] = useState<'startDate' | 'endDate' | undefined>();

  useEffect(() => {
    if (!!id) getProject({ filter: { ids: [id] } });
  }, [id]);

  const ProjectFormSchema = Yup.object().shape({
    title: Yup.string().required(''),
    startDate: Yup.string().required(''),
    stillWorkingThere: Yup.boolean(),
    endDate: Yup.string()
      .nullable()
      .when('stillWorkingThere', {
        is: false,
        then: Yup.string().required('Required'),
      }),
  });

  const methods = useForm<Project & { titleView?: boolean; descView?: boolean }>({
    resolver: yupResolver(ProjectFormSchema),
    defaultValues: {
      audience: AudienceEnum.Public,
      titleView: true,
      descView: true,
    },
    mode: 'onChange',
  });
  const {
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { isValid, isDirty },
  } = methods;

  const onSubmit = async (data: Project) => {
    const startDate = new Date(data.startDate);
    let endDate;
    if (data.stillWorkingThere) endDate = undefined;
    else if (data.endDate) {
      const date = new Date(data.endDate);
      endDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-01';
    }

    if (data.id) {
      const res: any = await updateProjectMutate({
        filter: {
          dto: {
            id: data.id,
            audience: data.audience,
            description: data.description,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });
      if (res?.data?.updateProject?.isSuccess) {
        const resUpdateMedia: any = await updateProjectMedia({
          filter: {
            dto: {
              projectId: data.id,
              urls: data?.projectMedias?.map((item) => item.url),
            },
          },
        });
        enqueueSnackbar('Project successfully Edited', { variant: 'success' });
      }
    } else {
      const res: any = await addProjectMutate({
        filter: {
          dto: {
            audience: data.audience,
            description: data.description ? data.description : null,
            stillWorkingThere: data.stillWorkingThere,
            title: data.title,
            cityId: data.cityDto?.id,
            startDate: startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-01',
            endDate: endDate,
          },
        },
      });
      if (res?.data?.addProject?.isSuccess) {
        const newId = res?.data?.addProject?.listDto?.items?.[0];
        const resAddMedia: any = await updateProjectMedia({
          filter: {
            dto: {
              projectId: newId?.id,
              urls: data?.projectMedias?.map((item) => item.url),
            },
          },
        });
        enqueueSnackbar('Project successfully Added', { variant: 'success' });
      }
    }
    router.back();
  };

  useEffect(() => {
    if (isEdit)
      reset({
        ...projectData,
        titleView: true,
        descView: true,
      });
  }, [projectData, isEdit, reset]);

  const handleClose = () => {
    if (isDirty) {
      setDiscardProjectBottomSheet(true);
    } else {
      router.back();
    }
  };

  const handleRemovePhoto = (url) => {
    setValue(
      'projectMedias',
      watch('projectMedias').filter((item) => item.url !== url),
      { shouldDirty: true }
    );
  };

  if (isFetching) {
    return (
      <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ py: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ p: 0 }} onClick={handleClose}>
                <ArrowLeft />
              </IconButton>
              <Typography variant="subtitle2" color="text.primary">
                {projectData?.id ? 'Edit Project' : 'Add Project'}
              </Typography>
            </Stack>
            <LoadingButton
              loading={addLoading || updateLoading}
              type="submit"
              variant="contained"
              disabled={!isValid || !isDirty}
              color="primary"
            >
              {projectData?.id ? 'Save' : 'Add'}
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
                {watch('title') || 'Ex: Building School'}
              </Typography>
            ) : (
              <Box>
                <RHFTextField
                  placeholder="Ex: Building School"
                  name="title"
                  size="small"
                  error={false}
                  inputProps={{ maxLength: 60 }}
                  onBlur={() => setValue('titleView', true)}
                  autoFocus={true}
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
              Location
            </Typography>
            <Box sx={{ cursor: 'pointer' }} onClick={() => setLocationBottomSheet(true)}>
              {watch('cityDto') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('cityDto.name')}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Ex: England, London
                </Typography>
              )}
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="body2" color="text.primary">
              <RHFCheckbox
                name="stillWorkingThere"
                label="I am currently work in this Project"
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
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setDateBottomSheet(true);
                setStatusDate('startDate');
              }}
            >
              {watch('startDate') ? (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(watch('startDate')))}, {new Date(watch('startDate')).getFullYear()}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
              )}
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              End Date{!watch('stillWorkingThere') && '*'}
            </Typography>
            <Box
              sx={{ cursor: !watch('stillWorkingThere') ? 'pointer' : 'default' }}
              onClick={() => {
                watch('stillWorkingThere') ? undefined : setDateBottomSheet(true);
                setStatusDate('endDate');
              }}
            >
              {watch('endDate') && !watch('stillWorkingThere') ? (
                <Typography variant="body2" color="text.primary">
                  {getMonthName(new Date(watch('endDate')))}, {new Date(watch('endDate')).getFullYear()}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {watch('stillWorkingThere') ? 'Present' : 'End Date'}
                </Typography>
              )}
            </Box>
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
                {watch('description') || 'Add Detail and Description about your Project.'}
              </Typography>
            ) : (
              <Box>
                <RHFTextField
                  size="small"
                  multiline
                  name="description"
                  placeholder="Add Detail and Description about your Project."
                  inputProps={{ maxLength: 2000 }}
                  onBlur={() => setValue('descView', true)}
                  autoFocus={true}
                  maxRows={4}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={{ width: '100%', textAlign: 'right' }}
                >
                  {watch('description')?.length || 0}/2000
                </Typography>
              </Box>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" color="text.primary">
                Media
              </Typography>
              {!!watch('projectMedias')?.length && watch('projectMedias').length <= 5 && (
                <Typography
                  variant="overline"
                  color="primary.main"
                  sx={{ cursor: 'pointer', textTransform: 'none' }}
                  component="div"
                  onClick={() => setNewPhotoProjectBottomSheet(true)}
                >
                  + Add Media
                </Typography>
              )}
            </Box>

            <Stack>
              {watch('projectMedias')?.length == 0 || !watch('projectMedias') ? (
                <Stack direction="row" justifyContent={'space-between'}>
                  <Typography variant="body2" color="text.primary">
                    Add Media.
                  </Typography>
                  <Typography
                    variant="overline"
                    color="primary.main"
                    sx={{ cursor: 'pointer', textTransform: 'none' }}
                    component="div"
                    onClick={() => setNewPhotoProjectBottomSheet(true)}
                  >
                    + Add Media
                  </Typography>
                </Stack>
              ) : (
                watch('projectMedias')?.map((item) => (
                  <Box display="flex" justifyContent="center" position="relative" key={item.id}>
                    <IconButtonStyle onClick={() => handleRemovePhoto(item.url)}>
                      <Image src={RemovePhoto} alt="remove photo" />
                    </IconButtonStyle>
                    <Box>
                      <Image
                        onClick={() => setEditProjectPhoto(true)}
                        src={item.url}
                        width={328}
                        height={184}
                        alt="Project-photo"
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Stack>

          <Divider />
          <Stack sx={{ px: 2 }} direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={0.5}>
              {projectData?.id && (
                <Button
                  color="error"
                  variant="text"
                  sx={{ width: 105 }}
                  onClick={() => setDeleteProjectBottomSheet(true)}
                >
                  Delete
                </Button>
              )}
            </Stack>

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
        </Stack>
      </FormProvider>
      <BottomSheet
        open={locationBottomSheet}
        onDismiss={() => setLocationBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <ProjectLocation
          onChange={(value) => {
            setValue('cityDto', value, { shouldDirty: true });
            setLocationBottomSheet(false);
          }}
        />
      </BottomSheet>

      <BottomSheet  open={dateBottomSheet} onDismiss={() => setDateBottomSheet(false)}>
        <ProjectDate
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
        <SelectProjectAudience
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setAudienceBottomSheet(false);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>

      <BottomSheet open={discardProjectBottomSheet} onDismiss={() => setDiscardProjectBottomSheet(false)}>
        <ProjectDiscard
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscardProjectBottomSheet(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>

      <BottomSheet open={deleteProjectBottomSheet} onDismiss={() => setDeleteProjectBottomSheet(false)}>
        {/* <  /> */}
        <ProjectDeleteConfirm id={projectData?.id} />
      </BottomSheet>

      <BottomSheet open={newPhotoProjectBottomSheet} onDismiss={() => setNewPhotoProjectBottomSheet(false)}>
        <ProjectPhoto
          onChange={(value) => {
            setValue(
              'projectMedias',
              watch('projectMedias') ? [...watch('projectMedias'), { url: value }] : [{ url: value }],
              {
                shouldDirty: true,
                shouldValidate: true,
              }
            ),
              setNewPhotoProjectBottomSheet(false);
          }}
          onClose={() => {
            setNewPhotoProjectBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={editProjectPhoto} onDismiss={() => setEditProjectPhoto(false)}>
        <ProjectEditPhoto
          onUpload={() => {
            setEditProjectPhoto(false);
            setNewPhotoProjectBottomSheet(true);
          }}
          onRemove={(value) => {
            setValue('projectMedias', value, { shouldDirty: true, shouldValidate: true });
            setEditProjectPhoto(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default ProjectNew;
