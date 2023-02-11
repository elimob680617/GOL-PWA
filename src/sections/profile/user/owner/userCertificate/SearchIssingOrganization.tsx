import { Box, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IssuingOrganization } from 'src/@types/sections/serverTypes';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { userCertificateSelector } from 'src/redux/slices/profile/userCertificates-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import debounceFn from 'src/utils/debounce';
import { useCreateIssuingOrganizationMutation } from 'src/_requests/graphql/profile/certificates/mutations/createIssuingOrganization.generated';
import { useLazySearchIssuingOrganizationsQuery } from 'src/_requests/graphql/profile/certificates/queries/searchIssuingOrganizations.generated';

// type of IssueProps
interface IssueOrganizationProps {
  onChange: (value: { id?: string; title?: string }) => void;
}

function SearchIssingOrganization(props: IssueOrganizationProps) {
  const { onChange } = props;
  const [isTyping, setIsTyping] = useState(false);
  const [searchIssuing, { data: searchIssuingData, isFetching }] = useLazySearchIssuingOrganizationsQuery();
  const [createIssuingOrganization] = useCreateIssuingOrganizationMutation();
  const router = useRouter();
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
        searchIssuing({
          filter: {
            dto: {
              title: val,
            },
          },
        })
      );
  };

  const handleChange = async (value: IssuingOrganization & { inputValue?: string }) => {
    if (value.inputValue) {
      // mutation create Issuing Organization name
      const resData: any = await createIssuingOrganization({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (resData?.data?.createIssuingOrganization?.isSuccess) {
        const newData = resData?.data?.createIssuingOrganization?.listDto?.items?.[0];

        onChange({ id: newData?.id, title: newData?.title });
      }
    } else {
      onChange(value);
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Issuing Organization
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
          options={searchIssuingData?.searchIssuingOrganizations?.listDto?.items || []}
          placeholder="Issuing Organization"
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                Start typing to find your Issuing Organization
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default SearchIssingOrganization;
