'use client'
import { Box, Button, Divider, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react"

import logoHouTech from '../../../images/logo_houtech.png';
import avatar from '../../../images/avatar.png';
import info from '../../../images/info.png';
import infomation from '../../../images/infomation.png';
import salary from '../../../images/salary.png';
import book from '../../../images/book.png';

import Link from "next/link";
import { AttachMoney, AttachMoneySharp, InboxSharp, Person } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";

const ClientMenu = () =>{
    const { data: session, status } = useSession()
    const router = useRouter();
    const role = session?.user?.role;
    
    const handleLogout = async () => {
        try {
            const token = session?.access_token;
            await axios.post("http://localhost:8080/api/v1/auth/logout", {}, {
                headers: 
                { 
                    'Authorization': `Bearer ${session?.user?.access_token}`, 
                }
            });

            await signOut({ redirect: false })
            router.push("auth/login");
            signOut(); // Đăng xuất khỏi NextAuth
            router.push("auth/login"); // Chuyển hướng về trang login
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <Box display={'flex'} justifyContent={'space-between'} flexDirection={'column'}>
            <Box>
            <Box textAlign={'center'} mb={5}>
                <Image src={logoHouTech} layout='intrinsic' alt='logoHou' width={150} height={50}/>
            </Box>
            <Stack direction={'row'} spacing={3} justifyContent={'center'} alignItems={'center'}>
                <Image src={avatar} layout='intrinsic' alt='logoHou' width={60} height={60}/>
                <Box color={'white'}>
                    <Typography>{session?.user?.lecturer.full_name ?? ""}</Typography>
                    <Typography >{session?.user?.name ?? ""}</Typography>
                </Box>
            </Stack>
            {role !=='Admin' &&(
                <>
                    <Typography
                        color="white" 
                        fontWeight={"bold"}
                        mt={5}
                        mb={2}
                        >Chức năng</Typography>
                    <Link href={'/client/dashboard'} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            background: '#FFC20E', 
                            borderRadius: 14, 
                            width: 226, height: 42,
                            textDecoration: 'none'}}>
                        <Image src={info} layout='intrinsic' alt='logoHou' 
                            width={28} 
                            height={20}
                            style={{marginRight: 10, marginLeft: 20}}/>
                        <Typography color="black">Bảng thông tin</Typography>
                    </Link>
                    <Typography
                        color="white" 
                        fontWeight={"bold"}
                        mt={2}
                        mb={1}
                        >Thông tin cá nhân</Typography>
                    <Box sx={{ width: '100%', maxWidth: 360, color: '#fff'}}>
                        <nav aria-label="main mailbox folders">
                            <List sx={{pt:0}}>
                            <ListItem disablePadding>
                            <Link href="/client/information" passHref 
                                style={{textDecoration: 'none', color: '#fff'}}>
                                <ListItemButton sx={{ pl: 0 }} component="a">
                                <ListItemIcon>
                                    <Image
                                    src={infomation}
                                    layout="intrinsic"
                                    alt="Icons"
                                    width={22}
                                    height={22}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Sơ yếu lý lịch" />
                                </ListItemButton>
                            </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/client/salaries" passHref 
                                    style={{textDecoration: 'none', color: '#fff'}}>
                                    <ListItemButton sx={{pl: 0}}>
                                        <ListItemIcon>
                                            <Image src={book} layout='intrinsic' alt='Icons' 
                                                width={22} 
                                                height={22}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Xem bảng lương" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            </List>
                        </nav>
                    </Box>
                    <Typography
                        color="white" 
                        fontWeight={"bold"}
                        mt={2}
                        mb={1}
                        >Thông tin giảng dạy</Typography>
                    <Box sx={{ width: '100%', maxWidth: 360, color: '#fff'}}>
                        <nav aria-label="main mailbox folders">
                            <List sx={{pt:0}}>
                            <ListItem disablePadding>
                            <Link href="/client/timetable" passHref 
                                style={{textDecoration: 'none', color: '#fff'}}>
                                <ListItemButton sx={{pl: 0}}>
                                    <ListItemIcon>
                                        <Image src={book} layout='intrinsic' alt='Icons' 
                                            width={22} 
                                            height={22}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Xem lịch giảng dạy" />
                                </ListItemButton>
                            </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/client/semestercalendar" passHref 
                                    style={{textDecoration: 'none', color: '#fff'}}>
                                    <ListItemButton sx={{pl: 0}}>
                                        <ListItemIcon>
                                            <Image src={book} layout='intrinsic' alt='Icons' 
                                                width={22} 
                                                height={22}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Xem lịch học kỳ" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            </List>
                        </nav>
                    </Box>
                </>
            )}

            {role ==='Admin' &&(
                <>
                    <Typography
                        color="white" 
                        fontWeight={"bold"}
                        mt={5}
                        mb={2}
                        >Chức năng</Typography>
                    <Link href={'/client/dashboard'} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            background: '#FFC20E', 
                            borderRadius: 14, 
                            width: 226, height: 42,
                            textDecoration: 'none'}}>
                        <Image src={info} layout='intrinsic' alt='logoHou' 
                            width={28} 
                            height={20}
                            style={{marginRight: 10, marginLeft: 20}}/>
                        <Typography color="black">Bảng thông tin</Typography>
                    </Link>
                    <Typography
                        color="white" 
                        fontWeight={"bold"}
                        mt={2}
                        mb={1}
                        >Chức năng</Typography>
                    <Box sx={{ width: '100%', maxWidth: 360, color: '#fff'}}>
                        <nav aria-label="main mailbox folders">
                            <List sx={{pt:0}}>
                            <ListItem disablePadding>
                            <Link href="/admin/createtimetable" passHref 
                                style={{textDecoration: 'none', color: '#fff'}}>
                                <ListItemButton sx={{pl: 0}}>
                                    <ListItemIcon>
                                        <Image src={book} layout='intrinsic' alt='Icons' 
                                            width={22} 
                                            height={22}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Lập thời khóa biểu" />
                                </ListItemButton>
                            </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/admin/report" passHref 
                                    style={{textDecoration: 'none', color: '#fff'}}>
                                    <ListItemButton sx={{pl: 0}}>
                                        <ListItemIcon>
                                            <Image src={book} layout='intrinsic' alt='Icons' 
                                                width={22} 
                                                height={22}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Báo cáo" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            </List>
                        </nav>
                    </Box>
                </>
            )}
            </Box>
            <Box>
                <Button 
                    onClick={handleLogout} 
                    sx={{
                        mb:2,
                        mt: 8,
                        width: "100%",
                        backgroundColor: "#FF0000",
                        boxShadow: "13px 4px 14px rgba(0, 0, 0, 0.12)",
                        borderRadius: "14px",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#D00000",
                        },
                    }}>
                    Đăng xuất
                </Button>
            </Box>
        </Box>
    )
}

export default ClientMenu;