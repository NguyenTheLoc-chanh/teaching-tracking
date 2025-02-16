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
          <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>
            
            {/* Menu bên trái - Cố định */}
            <Box
              sx={{
                width: 260,
                backgroundColor: '#121C3E',
                padding: 2,
                position: 'fixed',
                left: 0,
                top: 0,
                height: "100vh",
                overflowY: "auto",
                zIndex: 1000, // Đảm bảo luôn nổi
              }}
            >
              <ClientMenu />
            </Box>

            {/* Vùng chính (Header + Nội dung + Footer) */}
            <Box
              sx={{
                marginLeft: "260px", // Đẩy nội dung qua phải do menu chiếm 260px
                display: "flex",
                flexDirection: "column",
                width: "calc(100% - 260px)", // Trừ chiều rộng menu
                minHeight: "100vh",
              }}
            >
              {/* Header - Cố định nhưng dưới Menu */}
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: "260px",
                  width: "calc(100% - 260px)",
                  zIndex: 999,
                  backgroundColor: "white",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Header />
              </Box>

              {/* Nội dung chính - Có thể cuộn */}
              <Box
                component="main"
                flexGrow={1}
                sx={{
                  padding: 3,
                  marginTop: "56px", // Đẩy xuống dưới Header
                  height: "calc(100vh - 112px)", // Trừ header (56px) + footer (56px)
                  overflowY: "auto",
                }}
              >
                {children}
              </Box>

              {/* Footer - Cố định nhưng dưới Menu */}
              <Box
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: "260px",
                  width: "calc(100% - 260px)",
                  zIndex: 999,
                  backgroundColor: "white",
                  boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Footer />
              </Box>
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
