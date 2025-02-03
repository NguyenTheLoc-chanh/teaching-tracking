import { Box, Stack, Typography } from "@mui/material";

export default function Footer(){

    return (
        <Box
        component="footer"
        py={2}
        textAlign="center"
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          bgcolor: 'primary.main', // Thêm màu nền nếu cần
          color: 'white', // Màu chữ
        }}
      >
        <Typography>
          Copyright ©{new Date().getFullYear()} All rights reserved
        </Typography>
      </Box>
      
    )
}