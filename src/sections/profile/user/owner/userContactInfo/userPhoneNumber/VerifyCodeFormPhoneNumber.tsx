import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Divider, IconButton, OutlinedInput, Stack, Typography, useTheme } from '@mui/material';
// next
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import { formatPhoneNumber } from 'react-phone-number-input';
import { Icon } from 'src/components/Icon';
import { phoneNumberCleared, userPhoneNumberSelector } from 'src/redux/slices/profile/userPhoneNumber-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import useSecondCountdown from 'src/utils/useSecondCountdown';
import { useConfirmPhoneNumberMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/confirmPhoneNumber.generated';
import { useResendPhoneCodeMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/resendPhoneCode.generated';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type FormValuesProps = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
};
type ValueNames = 'code1' | 'code2' | 'code3' | 'code4' | 'code5';

const handleDelete = (index: number) => (event: any) => {
  // TODO: add if the key code in number or is Enter do the handleSubmit.
  if (event.keyCode === 46 || event.keyCode === 8) {
    event.currentTarget.parentNode.previousElementSibling?.children[0].focus();
  }
};

const VerifyCodeSchema = Yup.object().shape({
  code1: Yup.string().required('Code is required'),
  code2: Yup.string().required('Code is required'),
  code3: Yup.string().required('Code is required'),
  code4: Yup.string().required('Code is required'),
  code5: Yup.string().required('Code is required'),
});

// ----------------------------------------------------------------------

export default function VerifyCodeForm() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [sendCode, { isLoading: isResendLoading }] = useResendPhoneCodeMutation();
  const [confirmUserPhoneNumber] = useConfirmPhoneNumberMutation();

  const {
    isFinished,
    countdown: { minutes, seconds },
    restart,
  } = useSecondCountdown({ init: 120 });

  const userPhoneNumber = useSelector(userPhoneNumberSelector);

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
  };

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const values = watch();

  useEffect(() => {
    document.addEventListener('paste', handlePasteClipboard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const { code1, code2, code3, code4, code5 } = data;
    const resDataAdd: any = await confirmUserPhoneNumber({
      filter: {
        dto: {
          phoneNumber: userPhoneNumber?.phoneNumber,
          verificationCode: `${code1}${code2}${code3}${code4}${code5}`,
        },
      },
    });

    if (resDataAdd.data?.confirmPhoneNumber?.isSuccess) {
      router.push('/profile/user/contact-info/list');
      dispatch(phoneNumberCleared());
      enqueueSnackbar('The phone number has been successfully added', { variant: 'success' });
    } else {
      enqueueSnackbar(resDataAdd.data?.confirmPhoneNumber?.messagingKey, { variant: 'error' });
    }
  };

  const handlePasteClipboard = (event: ClipboardEvent) => {
    event.preventDefault();
    let data: string | string[] = event?.clipboardData?.getData('Text') || '';

    data = data.split('');

    Object.keys(values).forEach((_, index) => {
      const fieldIndex = `code${index + 1}`;
      setValue(fieldIndex as ValueNames, data[index]);
    });
  };

  const handleChangeWithNextField = (
    event: React.ChangeEvent<HTMLInputElement>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const { maxLength, value, name } = event.target;
    const fieldIndex = name.replace('code', '');

    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          (nextfield as HTMLElement).focus();
        }
      }
    }

    handleChange(event);
  };

  const handleResend = async () => {
    try {
      const result = await sendCode({ filter: { dto: { phoneNumber: userPhoneNumber?.phoneNumber } } });
      console.log('result', result);

      if ((result as any)?.data?.resendPhoneCode?.isSuccess) {
        restart();
      } else {
        console.log('error happend in resend');
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  const active = values.code1 && values.code2 && values.code3 && values.code4 && values.code5;

  const handleBackRoute = () => {
    dispatch(phoneNumberCleared());
    router.push('/profile/user/contact-info/list');
  };

  return (
    <>
      <Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ py: 3, justifyContent: 'space-between', px: 2, backgroundColor: 'background.paper' }}
        >
          <Typography variant="subtitle1" color="text.primary">
            <IconButton sx={{ p: 0, mr: 2 }} onClick={handleBackRoute}>
              <Icon name="left-arrow-1" color="text.primary" />
            </IconButton>
            Verify Phone Number
          </Typography>
        </Stack>
        <Divider />
        <Box sx={{ p: 4 }}>
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ margin: '0 auto', backgroundColor: 'background.paper', maxWidth: '330px', borderRadius: 2 }}
          >
            <Stack>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography variant="h4" color="text.primary" sx={{ pt: 3 }}>
                  Is it Really you?
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
                Enter the 5-digit verification code sent to {formatPhoneNumber(userPhoneNumber?.phoneNumber)}
              </Typography>
            </Stack>

            <Box sx={{ mt: 4, mb: 3 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {Object.keys(values).map((name, index) => (
                    <Controller
                      key={name}
                      name={`code${index + 1}` as ValueNames}
                      control={control}
                      render={({ field }) => (
                        <OutlinedInput
                          {...field}
                          onFocus={(e) => {
                            e.target.select();
                          }}
                          type="number"
                          onKeyUp={handleDelete(index)}
                          id="field-code"
                          autoFocus={index === 0}
                          placeholder="-"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleChangeWithNextField(event, field.onChange)
                          }
                          sx={{
                            '& fieldset': {
                              borderTop: 'unset',
                              borderRight: 'unset',
                              borderLeft: 'unset',
                              padding: 0,
                              borderRadius: 'unset',
                            },
                          }}
                          inputProps={{
                            maxLength: 1,
                            sx: {
                              p: 0,
                              textAlign: 'center',
                              width: 40,
                            },
                          }}
                        />
                      )}
                    />
                  ))}
                </Stack>
                <Box
                  sx={{ textAlign: 'center', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="timer" color="text.secondary" />
                  <Typography variant="h5" color="text.secondary" sx={{ ml: 1 }}>
                    {minutes} : {seconds}
                  </Typography>
                </Box>

                <Box>
                  {isFinished ? (
                    <LoadingButton
                      fullWidth
                      size="large"
                      type="button"
                      variant="contained"
                      sx={{ my: 3, px: 2 }}
                      color="primary"
                      onClick={handleResend}
                      loading={isResendLoading}
                    >
                      Resend
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      fullWidth
                      disabled={!active}
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ my: 3, px: 2 }}
                      color="primary"
                      loading={isSubmitting}
                    >
                      Submit
                    </LoadingButton>
                  )}
                </Box>
              </form>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
