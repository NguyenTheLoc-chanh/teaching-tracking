import { Box, Typography } from '@mui/material';
import * as React from 'react';

export function HeaderDesktop () {
  return (
    <Box
        component="header"
        py={2}
        textAlign="center"
        sx={{
          position: 'fixed',
          top: 0,
          width: '100%',
          bgcolor: 'primary.main', // Thêm màu nền nếu cần
          color: 'white', // Màu chữ
        }}
      >
        <Typography>
          Copyright ©{new Date().getFullYear()} Header
        </Typography>
      </Box>
  );
}
