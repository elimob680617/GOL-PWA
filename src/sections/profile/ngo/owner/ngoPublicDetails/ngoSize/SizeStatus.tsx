import {
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useGetNumberRangesQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/getNumberRange.generated';

interface SelectNgoSizeType {
  onChange: (value: { id?: string; desc?: string }) => void;
  sizeId: string;
}

export default function SizeStatusDialog(props: SelectNgoSizeType) {
  const { onChange, sizeId } = props;
  const router = useRouter();

  const { data: sizeNGO, isFetching } = useGetNumberRangesQuery({
    filter: {
      all: true,
    },
  });
  const ngoSize = sizeNGO?.getNumberRanges?.listDto?.items[0];

  const handleChange = (val: any) => {
    onChange({
      id: sizeNGO?.getNumberRanges?.listDto?.items[val]?.id,
      desc: sizeNGO?.getNumberRanges?.listDto?.items[val].desc,
    });
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="subtitle1" color="text.primary">
            NGO Size
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <RadioGroup
            onChange={(e) => {
              handleChange((e.target as HTMLInputElement).value);
            }}
            // value={sizeId}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            {sizeNGO?.getNumberRanges?.listDto?.items?.map((_size, i) => (
              <>
                <FormControlLabel
                  key={_size?.id}
                  value={i}
                  control={<Radio />}
                  label={_size?.desc}
                  checked={sizeId === _size?.id}
                />
              </>
            ))}
          </RadioGroup>
        )}
      </Stack>
    </Stack>
  );
}
