import { Box } from '@mui/material'
import React from 'react'
import Drafts from 'src/sections/campaignLanding/Drafts'

function drafts() {
  return (
    <Box 
      sx={{
        bgcolor: (theme) => theme.palette.background.neutral,
        minHeight: '100%',
        height: 'auto',
        overflowX:'hidden'
      }}
    >       
     <Drafts/>
    </Box>
  )
}

export default drafts