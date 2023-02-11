import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CertificateName } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useCreateCertificateNameMutation } from 'src/_requests/graphql/profile/certificates/mutations/createCertificateName.generated';
import { useLazySearchCertificateNamesQuery } from 'src/_requests/graphql/profile/certificates/queries/searchCertificateNames.generated';

interface CertificateNameProps {
  onChange: (value: { id?: string; title?: string }) => void;
}

function SearchCertificateNames(props: CertificateNameProps) {
  const { onChange } = props;
  const [searchCertificate, { data: searchCertificateData, isFetching }] = useLazySearchCertificateNamesQuery();
  const [createCertificateName] = useCreateCertificateNameMutation();
  const router = useRouter();
  const [isTyping, setIsTyping] = useState(false);
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router.back();
  }, [userCertificate, router]);

  const handleChangeInputSearch = (val: string) => {
    // is typing status
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    // Query
    if (val.length > 2)
      debounceFn(() =>
        searchCertificate({
          filter: {
            dto: {
              title: val,
            },
          },
        })
      );
  };

  // send certificateName to server
  const handleChange = async (value: CertificateName & { inputValue: string }) => {
    if (value.inputValue) {
      const resData: any = await createCertificateName({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (resData?.data?.createCertificateName?.isSuccess) {
        const newData = resData?.data?.createCertificateName?.listDto?.items?.[0];
        onChange({ id: newData?.id, title: newData?.title });
      }
    } else {
      onChange(value);
    }
  };

  return (
    <Stack spacing={2} sx={{ bgcolor: '#fff', py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Certificate Name
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <AutoCompleteAddable
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleChangeInputSearch(val)}
          onChange={(ev, val) => handleChange(val)}
          options={searchCertificateData?.searchCertificateNames?.listDto?.items || []}
          placeholder="Certificate Name"
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                Start typing to find your certificate
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default SearchCertificateNames;
