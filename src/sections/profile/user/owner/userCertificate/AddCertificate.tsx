import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ArrowDown2, Eye } from 'iconsax-react';
import { useRouter } from 'next/router';
// toast
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
// Rhf and yup
import { useForm } from 'react-hook-form';
// bottom sheet
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
//
import { AudienceEnum, Certificate } from 'src/@types/sections/serverTypes';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { Icon } from 'src/components/Icon';
import { certificateCleared, userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import getMonthName from 'src/utils/getMonthName';
import { useUpsertCertificateMutation } from 'src/_requests/graphql/profile/certificates/mutations/upsertCertificate.generated';
import * as Yup from 'yup';
import DeleteConfirm from './DeleteConfirm';
import DiscardCertificate from './DiscardCertificate';
import ExpirationDate from './ExpirationDate';
import IssueDate from './IssueDate';
// import components
import SearchCertificateNamesDialog from './SearchCertificateNames';
import SearchIssingOrganization from './SearchIssingOrganization';
import SelectAudienceCertificate from './SelectAudienceCertificate';

function AddCertificate() {
  // useState for bottomSheet
  const [certificateNameBottomSheet, setCertificateNameBottomSheet] = useState(false);
  const [issuingOrganizationBottomSheet, setIssuingOrganizationBottomSheet] = useState(false);
  const [issueDateBottomSheet, setIssueDateBottomSheet] = useState(false);
  const [expireDateBottomSheet, setExpireDateBottomSheet] = useState(false);
  const [audienceBottomSheet, setAudienceBottomSheet] = useState(false);
  const [discardCertificateBottomSheet, setDiscardCertificateBottomSheet] = useState(false);
  const [deleteCertificateBottomSheet, setDeleteCertificateBottomSheet] = useState(false);

  // URl for validation of credential URL
  const URL =
    /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

  //  tools
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router.push('/profile/user/certificate/list');
  }, [userCertificate, router]);

  // mutation !
  const [upsertCertificate, { isLoading }] = useUpsertCertificateMutation();
  // yup
  const certificateValidation = Yup.object().shape({
    certificateName: Yup.object()
      .shape({
        title: Yup.string(),
      })
      .required(),
    issuingOrganization: Yup.object()
      .shape({
        title: Yup.string(),
      })
      .required(),

    credentialUrl: Yup.string()
      .matches(URL, { message: 'Enter a valid url', excludeEmptyString: true })
      .notRequired()
      .nullable(),
    issueDate: Yup.string().required(''),
  });

  const methods = useForm<Certificate>({
    defaultValues: {
      ...userCertificate,
      credentialID: userCertificate?.credentialID ? userCertificate?.credentialID : '',
      credentialUrl: userCertificate?.credentialUrl ? userCertificate?.credentialUrl : '',
    },
    resolver: yupResolver(certificateValidation),
    mode: 'onChange',
  });

  const {
    trigger,
    control,
    watch,
    getValues,
    handleSubmit,
    setValue,

    formState: { errors, isValid, isDirty },
  } = methods;

  const onSubmit = async (data: Certificate) => {
    const resData: any = await upsertCertificate({
      filter: {
        dto: {
          id: userCertificate?.id,
          certificateNameId: data.certificateName?.id,
          issuingOrganizationId: data.issuingOrganization?.id,
          credentialDoesExpire: !data.credentialDoesExpire,
          issueDate: new Date(data.issueDate).toISOString(),
          expirationDate: !data?.credentialDoesExpire ? data?.expirationDate : undefined,
          credentialID: data.credentialID.length === 0 ? undefined : data.credentialID,
          credentialUrl: data.credentialUrl.length === 0 ? undefined : data.credentialUrl,
          audience: data.audience,
        },
      },
    });
    if (resData?.data?.upsertCertificate.isSuccess) {
      if (userCertificate?.id) enqueueSnackbar('The certificate has been successfully edited ', { variant: 'success' });
      else enqueueSnackbar('The certificate has been successfully added ', { variant: 'success' });
      dispatch(certificateCleared(undefined));
      router.push('/profile/user/certificate/list');
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  // useEffecgt for Trigger
  useEffect(() => {
    trigger(['certificateName', 'issuingOrganization']);
  }, []);

  // click on closeicon and go to Discard or profile
  function handleCloseCertificateDialog() {
    if (isDirty || userCertificate?.isChange) {
      setDiscardCertificateBottomSheet(true);
    } else {
      dispatch(certificateCleared(undefined));
      router.push('/profile/user/certificate/list');
    }
  }

  const handleBack = () => {
    dispatch(certificateCleared(undefined));
    router.back();
  };
  // navigate and send data to Redux with open BottomSheet;
  const handleCertificateBottomSheet = () => {
    // setFocus()

    setCertificateNameBottomSheet(true);
  };

  const handleIssueBottomSheet = () => {
    setIssuingOrganizationBottomSheet(true);
  };

  const handleIssueDateBottomSheet = () => {
    setIssueDateBottomSheet(true);
  };

  const handleExpireDateBottomSheet = () => {
    setExpireDateBottomSheet(true);
  };

  const handleDeleteBottomSheet = () => {
    setDeleteCertificateBottomSheet(true);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={2} direction="row" alignItems="center">
            <IconButton sx={{ p: 0 }} onClick={handleCloseCertificateDialog}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            <Typography variant="subtitle1">{userCertificate?.id ? 'Edit Certificate' : 'Add Certificate'}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <LoadingButton loading={isLoading} type="submit" variant="contained" disabled={!isValid || !isDirty}>
              {userCertificate?.id ? 'save' : 'Add'}
            </LoadingButton>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Certificate Name*
            </Typography>
            <Box mt={2} />
            <Box onClick={handleCertificateBottomSheet}>
              {watch('certificateName') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('certificateName')?.title}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Ex: Microsoft certified network security
                </Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Issuing Organization*
            </Typography>
            <Box mt={2} />
            <Box onClick={handleIssueBottomSheet}>
              {watch('issuingOrganization') ? (
                <Typography variant="body2" color="text.primary">
                  {watch('issuingOrganization')?.title}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Ex: Garden of Love
                </Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Stack direction="row" alignItems="center">
              <RHFCheckbox
                label={
                  <Typography color={theme.palette.text.primary} variant="body2">
                    This credential does not expire
                  </Typography>
                }
                name="credentialDoesExpire"
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  pl: 0,
                  m: 0,
                }}
              />
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Issue Date*
            </Typography>
            <Box mt={2} />
            {watch('issueDate') ? (
              <Typography variant="body2" color="text.secondary">
                {getMonthName(new Date(watch('issueDate')))} , {new Date(watch('issueDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('issueDate', undefined, { shouldValidate: true, shouldDirty: true });
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={handleIssueDateBottomSheet}>
                <Typography variant="body2" color="text.secondary">
                  Issue Date
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Expiration Date
            </Typography>

            <Box mt={2} />
            {watch('expirationDate') && !watch('credentialDoesExpire') ? (
              <Typography variant="body2" color="text.secondary">
                {getMonthName(new Date(watch('expirationDate')))} , {new Date(watch('expirationDate')).getFullYear()}
                <IconButton
                  onClick={() => {
                    setValue('expirationDate', undefined, { shouldValidate: true, shouldDirty: true });
                    // dispatch(certificateUpdated({ ...getValues() }));
                  }}
                  sx={{ ml: 1 }}
                >
                  &#215;
                </IconButton>
              </Typography>
            ) : (
              <Box onClick={() => (watch('credentialDoesExpire') ? undefined : handleExpireDateBottomSheet())}>
                <Typography variant="body2" color="text.secondary">
                  {watch('credentialDoesExpire') ? 'No Expiration' : 'Expiration Date'}
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Credential ID
            </Typography>
            <Box mt={2} />
            <RHFTextField
              name="credentialID"
              placeholder="Credential ID"
              size="small"
              inputProps={{ maxLength: 100 }}
            />
          </Box>
          <Divider />
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Credential URL
            </Typography>
            <Box mt={2} />
            <RHFTextField
              name="credentialUrl"
              placeholder="Credential Url"
              size="small"
              inputProps={{ maxLength: 200 }}
            />
          </Box>
          <Divider />
          <Stack direction="row" justifyContent="space-between" sx={{ px: 2, pb: 3 }}>
            <Stack direction="row" alignItems="center">
              {userCertificate?.id && (
                <Button sx={{ color: 'error.main', padding: '11px 33px' }} onClick={handleDeleteBottomSheet}>
                  <Typography variant="button">Delete</Typography>
                </Button>
              )}
            </Stack>

            <Button
              onClick={() => setAudienceBottomSheet(true)}
              variant="outlined"
              startIcon={<Eye size="18" color={theme.palette.text.primary} />}
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
        open={certificateNameBottomSheet}
        onDismiss={() => setCertificateNameBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SearchCertificateNamesDialog
          onChange={(value) => {
            setValue('certificateName', value, { shouldDirty: true, shouldValidate: true });

            setCertificateNameBottomSheet(false);
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={issuingOrganizationBottomSheet}
        onDismiss={() => setIssuingOrganizationBottomSheet(false)}
        snapPoints={({ maxHeight }) => maxHeight / 2}
      >
        <SearchIssingOrganization
          onChange={(value) => {
            setValue('issuingOrganization', value, { shouldDirty: true, shouldValidate: true });
            setIssuingOrganizationBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={issueDateBottomSheet} onDismiss={() => setIssueDateBottomSheet(false)}>
        <IssueDate
          issueDate={watch('issueDate')}
          expirationDate={watch('expirationDate')}
          onChange={(value) => {
            setValue('issueDate', value, { shouldDirty: true, shouldValidate: true });
            setIssueDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={expireDateBottomSheet} onDismiss={() => setExpireDateBottomSheet(false)}>
        <ExpirationDate
          issueDate={watch('issueDate')}
          expirationDate={watch('expirationDate')}
          onChange={(value) => {
            setValue('expirationDate', value, { shouldDirty: true });
            setExpireDateBottomSheet(false);
          }}
        />
      </BottomSheet>
      <BottomSheet open={discardCertificateBottomSheet} onDismiss={() => setDiscardCertificateBottomSheet(false)}>
        <DiscardCertificate
          onSubmit={() => {
            if (isValid) {
              onSubmit(getValues());
            }
            setDiscardCertificateBottomSheet(false);
          }}
          isValid={isValid}
        />
      </BottomSheet>
      <BottomSheet open={deleteCertificateBottomSheet} onDismiss={() => setDeleteCertificateBottomSheet(false)}>
        <DeleteConfirm />
      </BottomSheet>

      <BottomSheet open={audienceBottomSheet} onDismiss={() => setAudienceBottomSheet(false)}>
        <SelectAudienceCertificate
          onChange={(value) => {
            setValue('audience', value, { shouldDirty: true });
            setAudienceBottomSheet(false);
          }}
          audience={watch('audience')}
        />
      </BottomSheet>
    </>
  );
}

export default AddCertificate;
