import { Box, Button, CircularProgress, Divider, IconButton, Stack, styled, Typography, useTheme } from '@mui/material';
import Link from '@mui/material/Link';
import { ArrowLeft } from 'iconsax-react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import companylogo from 'public/companylogo/Vector.png';
import { useEffect } from 'react';
import { CertificateType } from 'src/@types/sections/profile/userCertificate';
import { certificateUpdated } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetCertificatesQuery } from 'src/_requests/graphql/profile/certificates/queries/getCertificates.generated';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

// const NoResultStyle = styled(Stack)(({ theme }) => ({
//   maxWidth: 164,
//   maxHeight: 164,
//   width: 164,
//   height: 164,
//   background: theme.palette.grey[100],
//   borderRadius: '100%',
// }));

const CertificateWrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const CertificateImage = styled(Stack)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
}));
const CertificateListBoxStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

function CertificateListView() {
  const router = useRouter();
  const ID = router?.query?.id?.[0];
  console.log('aassasdasdsadasdas', router.query);
  const theme = useTheme();

  const [getCertificates, { data, isFetching }] = useLazyGetCertificatesQuery();

  useEffect(() => {
    getCertificates({
      filter: {
        dto: { userId: ID },
      },
    });
  }, []);

  const certificateData = data?.getCertificates?.listDto?.items;
  return (
    // <Dialog fullWidth maxWidth="sm" open onClose={() => router.push(PATH_APP.profile.user.root)}>
    <CertificateListBoxStyle>
      <Stack direction="row" justifyContent="flex-start" mb={1} spacing={2} sx={{ pt: 2, pl: 2 }}>
        <IconButton sx={{ padding: 0 }} onClick={() => router.back()}>
          <ArrowLeft color={theme.palette.grey[500]} />
        </IconButton>
        <Typography variant="subtitle1">Certificates</Typography>
      </Stack>
      {isFetching ? (
        <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        certificateData?.map((certificate, index) => (
          <Box key={certificate?.id}>
            <CertificateWrapperStyle spacing={1} direction="row">
              <CertificateImage alignItems="center" justifyContent="center">
                <Image src={companylogo} width={32} height={32} alt="image" />
              </CertificateImage>
              <Stack sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                    {certificate?.certificateName?.title}
                  </Typography>
                </Stack>
                {
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    {`Issued ${getMonthName(new Date(certificate?.issueDate))}
                  ${new Date(certificate?.issueDate).getFullYear()} `}

                    {(certificate?.expirationDate && bull) || (!certificate?.credentialDoesExpire && bull)}

                    {certificate?.expirationDate
                      ? ` ${getMonthName(new Date(certificate?.expirationDate))} ${new Date(
                          certificate?.expirationDate
                        ).getFullYear()} `
                      : !certificate?.expirationDate && certificate?.credentialDoesExpire
                      ? ''
                      : // <Typography>hhkj</Typography>
                        ' No Expiration Date'}
                  </Typography>
                }

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  Issuing organization : {certificate.issuingOrganization.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  {certificate.credentialID && `Credential ID ${certificate?.credentialID}`}
                </Typography>
                <Box>
                  {certificate?.credentialUrl && (
                    <NextLink
                      href={`https://` + certificate?.credentialUrl.replace('https://', '')}
                      passHref
                      replace
                      locale={''}
                    >
                      <Link underline="none" target={'_blank'}>
                        <Button
                          color="inherit"
                          variant="outlined"
                          sx={{ borderColor: 'text.primary', color: 'text.primary', mt: 2 }}
                        >
                          <Typography variant="button">see certificate</Typography>
                        </Button>
                      </Link>
                    </NextLink>
                  )}
                </Box>
              </Stack>
            </CertificateWrapperStyle>
            {index < certificateData?.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </CertificateListBoxStyle>
    // </Dialog>
  );
}

export default CertificateListView;
