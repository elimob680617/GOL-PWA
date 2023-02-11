import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

const Menu: FC = () => (
  <Stack spacing={3}>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/calender/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        Campaigns
      </Typography>
    </Stack>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/grid/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        Pages
      </Typography>
    </Stack>
    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/account/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        Groups
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/Save/24/Outline.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        Saved
      </Typography>
    </Stack>

    <Stack spacing={1} sx={{ cursor: 'pointer' }} direction="row" alignItems="center">
      <img src="/icons/arrow/nft-arrow.svg" width={24} height={24} alt="campaign" />
      <Typography variant="subtitle2" sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '17.5px' }}>
        NFT
      </Typography>
    </Stack>
  </Stack>
);

export default Menu;
