'use client'
import { Inter } from "next/font/google";
import '@/app/globals.css'
import { Box, Container, Stack } from "@mui/material";
import { ThemeRegistry } from "../ThemeProvider";
import ClientMenu from "@/components/layout/client.menu";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <Container>
            <Header/>

            <Footer/>
            <Stack direction={'row'} minHeight={"100vh"}>
                <Box 
                  sx={{
                  width: 260,  // Chiều rộng cố định cho menu
                  backgroundColor: '#121C3E',  // Màu nền menu
                  padding: 2,  // Padding cho menu
                  position: 'fixed',  // Menu sẽ luôn cố định khi cuộn
                  top: 0,  // Gắn menu vào đầu trang
                  height: '100vh',  // Menu sẽ có chiều cao bằng chiều cao cửa sổ
                }}
                >
                  <ClientMenu/>
                </Box>
                <Box
                component="main"
                flexGrow={1}  // Chiếm hết không gian còn lại
                sx={{
                  padding: 3,  // Padding cho nội dung
                  marginLeft: '260px',
                  marginTop: '56px',
                  overflowY: 'auto',  // Thêm scroll nếu nội dung quá dài
                  height: 'auto',
                  overflow: 'hidden'  // Chiều cao bằng chiều cao cửa sổ
                }}
              >
                {children}  {/* Hiển thị nội dung trang */}
              </Box>
            </Stack>
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
