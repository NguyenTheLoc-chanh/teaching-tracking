import { auth } from "@/auth";
import TimeTableCom from "@/components/client/timetable";
import { sendRequest } from "@/utils/api";
import { Box, FormControl, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const sessions = ['Sáng', 'Chiều', 'Tối'];

interface IWeek {
    label: string;
    value: number;
}

const TimeTablePage = async () => {
    // Gọi API lấy danh sách tuần
    const session = await auth();
    // Fetch danh sách tuần từ API backend
    const res = await sendRequest<{ statusCode: number; data: IWeek[] }>({
    url: "http://localhost:8080/api/v1/teaching-logs/weeks",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
});
    return <TimeTableCom weeks={res.data}/>

    // return (
    //     <Box>
    //         <Typography variant="h5" gutterBottom fontWeight={'500'} textAlign={'center'}>
    //             XEM LỊCH GIẢNG THEO TUẦN
    //         </Typography>
    //         <Stack direction={'row'} justifyContent={'center'} mb={3} alignItems={'center'}>
    //             <Typography mr={2}>Tuần học:</Typography>
    //             <FormControl
    //                 sx={{
    //                     width: 500,
    //                     height: 36,
    //                     padding: 0,
    //                     position: 'relative',
    //                     '.MuiInputLabel-root': {
    //                     top: '-5px', // Điều chỉnh vị trí của InputLabel để phù hợp chiều cao
    //                     fontSize: '14px', // Giảm kích thước font nếu cần
    //                     lineHeight: '36px', // Căn chỉnh giữa
    //                     },
    //                     '.MuiSelect-select': {
    //                     height: '36px',
    //                     padding: '0 8px', // Loại bỏ padding mặc định và giữ khoảng cách nhỏ
    //                     display: 'flex',
    //                     alignItems: 'center', // Căn chỉnh nội dung trong Select
    //                     },
    //                     '.MuiOutlinedInput-notchedOutline': {
    //                     border: '1px solid #ccc', // Tùy chỉnh viền nếu cần
    //                     height: '36px',
    //                     },
    //                 }}
    //                 >
    //                 <Select
    //                     labelId="select-box-label"
    //                     value={selectedWeek || ""}
    //                     onChange={(e) => setSelectedWeek(Number(e.target.value))}
    //                     inputProps={{
    //                     sx: {
    //                         height: '30px',
    //                         padding: 0,
    //                     },
    //                     }}
    //                 >
    //                     {weeks.map((week) => (
    //                     <MenuItem key={week.value} value={week.value}>
    //                         {week.label}
    //                     </MenuItem>
    //                     ))}
    //                 </Select>
    //             </FormControl>
    //         </Stack>

    //         <TableContainer component={Paper}>
    //             <Table>
    //                 <TableHead>
    //                     <TableRow>
    //                         <TableCell 
    //                             sx={{ border: '1px solid #fff', 
    //                             height: 44, 
    //                             textAlign: 'center', 
    //                             padding: 0, 
    //                             background: '#99CCFF',
    //                             fontWeight: 'bold' }}>Ca dạy</TableCell>
    //                         {daysOfWeek.map((day) => (
    //                         <TableCell key={day} sx={{ border: '1px solid #fff', background: '#99CCFF', fontWeight: 'bold', textAlign: 'center' }}>{day}</TableCell>
    //                         ))}
    //                     </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                 {sessions.map((session) => (
    //                     <TableRow key={session}>
    //                     <TableCell 
    //                         sx={{ border: '1px solid #fff', 
    //                         width: 66, 
    //                         height: 210,
    //                         background: '#F2F2F2',
    //                         fontWeight: 'bold'
    //                         }} >{session}</TableCell>
    //                     {daysOfWeek.map((day) => (
    //                         <TableCell key={day} sx={{ border: '1px solid #fff', background: '#F2F2F2', textAlign: 'center' }}>
    //                         {'No class'}
    //                         </TableCell>
    //                     ))}
    //                     </TableRow>
    //                 ))}
    //                 </TableBody>
    //             </Table>
    //         </TableContainer>
    //     </Box>
    // )
}

export default TimeTablePage;