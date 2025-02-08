"use client";
import { useState } from "react";
import { Box, FormControl, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

interface IWeek {
  label: string;
  value: number;
}
const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const sessions = ['Sáng', 'Chiều', 'Tối'];

const getWeekDates = (label: string) => {
    const match = label.match(/\((\d{2}\/\d{2}\/\d{4}) - (\d{2}\/\d{2}\/\d{4})\)/);
    if (match) {
      return { startDate: match[1], endDate: match[2] };
    }
    return { startDate: "N/A", endDate: "N/A" };
};

const convertDateFormat = (label: string) => {
    // Sử dụng regex để tách ngày bắt đầu và kết thúc trong label
    const regex = /\((\d{2}\/\d{2}\/\d{4}) - (\d{2}\/\d{2}\/\d{4})\)/;
    const match = label.match(regex);
  
    if (match) {
      const startDate = match[1];
      const endDate = match[2];
      
      // Chuyển đổi ngày từ MM/DD/YYYY sang DD/MM/YYYY
      const formattedStartDate = dayjs(startDate, 'MM/DD/YYYY').format('DD/MM/YYYY');
      const formattedEndDate = dayjs(endDate, 'MM/DD/YYYY').format('DD/MM/YYYY');
      
      return `Tuần (${formattedStartDate} - ${formattedEndDate})`;
    }
    return label;
};

const getVietnameseDay = (dayOfWeek: string) => {
    const dayMap = {
      "thứ hai": "Thứ 2",
      "thứ ba": "Thứ 3",
      "thứ tư": "Thứ 4",
      "thứ năm": "Thứ 5",
      "thứ sáu": "Thứ 6",
      "thứ bảy": "Thứ 7",
      "chủ nhật": "CN",
    };
    return dayMap[dayOfWeek as keyof typeof dayMap] || dayOfWeek; // Nếu không tìm thấy, trả về ngày gốc
};
  
const TimeTableCom = ({ weeks }: { weeks: IWeek[] }) => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(weeks[0]?.value || null);
  
  // Lấy tuần hiện tại theo selectedWeek
  const selectedWeekData = weeks.find((week) => week.value === selectedWeek);

  // Lấy ngày bắt đầu và kết thúc từ label
  const { startDate, endDate } = selectedWeekData ? getWeekDates(selectedWeekData.label) : { startDate: "", endDate: "" };

  const validStartDate = dayjs(startDate).isValid() ? startDate : null;
  // Tạo danh sách ngày trong tuần đó
  const currentDays = validStartDate
    ? Array.from({ length: 7 }, (_, index) => {
        const date = dayjs(validStartDate).add(index, 'day'); // Tăng từng ngày
        const dayOfWeek = date.format('dddd');
        return {
          dayOfWeek: getVietnameseDay(dayOfWeek),
          fullDate: date.format('DD/MM/YYYY'), // Ngày đầy đủ
        };
      })
    : [];
  return (
    <Box>
            <Typography variant="h5" gutterBottom fontWeight={'500'} textAlign={'center'}>
                XEM LỊCH GIẢNG THEO TUẦN
            </Typography>
            <Stack direction={'row'} justifyContent={'center'} mb={3} alignItems={'center'}>
                <Typography mr={2}>Tuần học:</Typography>
                <FormControl
                    sx={{
                        width: 500,
                        height: 36,
                        padding: 0,
                        position: 'relative',
                        '.MuiInputLabel-root': {
                        top: '-5px', // Điều chỉnh vị trí của InputLabel để phù hợp chiều cao
                        fontSize: '14px', // Giảm kích thước font nếu cần
                        lineHeight: '36px', // Căn chỉnh giữa
                        },
                        '.MuiSelect-select': {
                        height: '36px',
                        padding: '0 8px', // Loại bỏ padding mặc định và giữ khoảng cách nhỏ
                        display: 'flex',
                        alignItems: 'center', // Căn chỉnh nội dung trong Select
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #ccc', // Tùy chỉnh viền nếu cần
                        height: '36px',
                        },
                    }}
                    >
                    <Select
                        labelId="select-box-label"
                        value={selectedWeek || ""}
                        onChange={(e) => setSelectedWeek(Number(e.target.value))}
                        inputProps={{
                        sx: {
                            display: 'flex',
                            alignItems: 'center',
                            height: '30px',
                            padding: 0,
                        },
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '40px', // Đảm bảo chiều cao ổn định
                          }}
                    >
                        {weeks.map((week) => (
                        <MenuItem key={week.value} value={week.value}
                            sx={{
                                textAlign: 'center',
                                display: 'flex',
                                height: 40
                            }}>
                            {convertDateFormat(week.label)}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell 
                                sx={{ border: '1px solid #fff', 
                                height: 44, 
                                textAlign: 'center', 
                                padding: 0, 
                                background: '#99CCFF',
                                fontWeight: 'bold' }}>Ca dạy</TableCell>
                            {currentDays.map((day) => (
                            <TableCell key={day.fullDate} sx={{ border: '1px solid #fff', background: '#99CCFF', fontWeight: 'bold', textAlign: 'center' }}>{day.dayOfWeek}, {day.fullDate}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {sessions.map((session) => (
                        <TableRow key={session}>
                        <TableCell 
                            sx={{ border: '1px solid #fff', 
                            width: 66, 
                            height: 210,
                            background: '#F2F2F2',
                            fontWeight: 'bold'
                            }} >{session}</TableCell>
                        {daysOfWeek.map((day) => (
                            <TableCell key={day} sx={{ border: '1px solid #fff', background: '#F2F2F2', textAlign: 'center' }}>
                            {'No class'}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
  );
};

export default TimeTableCom;
