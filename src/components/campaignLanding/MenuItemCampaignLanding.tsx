import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Icon } from '../Icon';
import { useRouter } from 'next/router';

type ActionMenuType = 'campaign' | 'reports' | 'drafts' | 'donation';
interface IMenuItems {
  active: ActionMenuType;
}

const MenuItems = styled(IconButton)(({ theme }) => ({
  height: 76,
  width: 106,
  backgroundColor: theme.palette.surface.main,
  margin: 8,
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  ':hover': {
    backgroundColor: theme.palette.surface.main,
  },
}));

function MenuItemCampaignLanding(props: IMenuItems) {
  const { active } = props;
  const { push } = useRouter();
  return (
    <Box display={'flex'} sx={{ overflow: 'auto' }}>
      <MenuItems
        onClick={() => (active==='campaign' ? null : push('/campaigns'))}
        sx={{
          color: (theme) => (active==='campaign' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Poverty-Alleviation" color={active==='campaign' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          Campaigns
        </Typography>
      </MenuItems>
      <MenuItems
        onClick={() => (active === 'reports' ? null : push('/campaigns/reports'))}
        sx={{
          color: (theme) => (active === 'reports' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Report" color={active === 'reports' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          Reports
        </Typography>
      </MenuItems>
      <MenuItems
        onClick={() => (active === 'donation' ? null : push('/campaigns/donation'))}
        sx={{
          color: (theme) => (active === 'donation' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Saved" color={active === 'donation' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          Donations
        </Typography>
      </MenuItems>
      <MenuItems
        onClick={() => (active === 'drafts' ? null : push('/campaigns/drafts'))}
        sx={{
          color: (theme) => (active === 'drafts' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Saved" color={active === 'drafts' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          Drafts
        </Typography>
      </MenuItems>
    </Box>
  );
}

export default MenuItemCampaignLanding;
