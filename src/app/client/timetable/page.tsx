import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const timetableData = [
    { day: 'Monday', session: 'Morning', subject: 'Math' },
    { day: 'Monday', session: 'Afternoon', subject: 'Science' },
    { day: 'Tuesday', session: 'Morning', subject: 'English' },
    { day: 'Tuesday', session: 'Afternoon', subject: 'History' },
    { day: 'Wednesday', session: 'Morning', subject: 'Physics' },
    { day: 'Wednesday', session: 'Afternoon', subject: 'Chemistry' },
    // ... add other days and sessions
];
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sessions = ['Sáng', 'Chiều', 'Tối'];

const TimeTablePage = () => {
    const timetableGrid: { [key: string]: { [key: string]: string } } = {};

  // Initialize grid with empty strings
  daysOfWeek.forEach((day) => {
    timetableGrid[day] = {};
    sessions.forEach((session) => {
      timetableGrid[day][session] = '';
    });
  });

  // Populate the grid with actual data
  timetableData.forEach((entry) => {
    timetableGrid[entry.day][entry.session] = entry.subject;
  });

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
                        inputProps={{
                        sx: {
                            height: '30px',
                            padding: 0,
                        },
                        }}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        <MenuItem value="option1">Option 1</MenuItem>
                        <MenuItem value="option2">Option 2</MenuItem>
                        <MenuItem value="option3">Option 3</MenuItem>
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
                            {daysOfWeek.map((day) => (
                            <TableCell key={day} sx={{ border: '1px solid #fff', background: '#99CCFF', fontWeight: 'bold', textAlign: 'center' }}>{day}</TableCell>
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
                            {timetableGrid[day][session] || 'No class'}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default TimeTablePage;