'use client'
import { Box, Divider, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useSession } from "next-auth/react"

import logoHouTech from '../../../images/logo_houtech.png';
import avatar from '../../../images/avatar.png';
import info from '../../../images/info.png';
import infomation from '../../../images/infomation.png';
import salary from '../../../images/salary.png';
import book from '../../../images/book.png';

import Link from "next/link";
import { AttachMoney, AttachMoneySharp, InboxSharp, Person } from "@mui/icons-material";

const ClientMenu = () =>{
    const { data: session, status } = useSession()
    return (
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
                        <ListItemButton sx={{pl: 0}}>
                            <ListItemIcon>
                            <Image src={salary} layout='intrinsic' alt='Icons' 
                                width={22} 
                                height={22}/>
                            </ListItemIcon>
                            <ListItemText primary="Xem bảng lương"/>
                        </ListItemButton>
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
                        <ListItemButton sx={{pl: 0}}>
                            <ListItemIcon>
                            <Image src={book} layout='intrinsic' alt='Icons' 
                                width={22} 
                                height={22}/>
                            </ListItemIcon>
                            <ListItemText primary="Xem lịch học kỳ"/>
                        </ListItemButton>
                    </ListItem>
                    </List>
                </nav>
            </Box>
        </Box>
    )
}

export default ClientMenu;