'use client'

import { handleGetSemester } from "@/app/client/semestercalendar/handlesemester";
import {
    Box,
    Container,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";

interface IYear {
    label: string;
    value: string;
}

interface ISemester {
    label: string;
    value: string;
}

interface ITimetable {
    _id: string;
    class_id: string;
    session: string;
    date: string;
    lesson_count: number;
    students_present: number;
    session_status: string;
    subject_name:string ;
    room: string;
    lecturer_name: string;
}

const sessions = ["Sáng", "Chiều", "Tối"];
const currentDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
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
const getCurrentAcademicYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

const SemesterCalendarCom = ({ years, semesters }: { years: IYear[], semesters: ISemester[] }) => {
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [timetables, setTimetables] = useState<ITimetable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const currentYear = getCurrentAcademicYear();
        setSelectedYear(years.find(y => y.value === currentYear)?.value || years[0]?.value || "");
        if (semesters.length > 0) setSelectedSemester(semesters[0].value);
    }, [years, semesters]);

    useEffect(() => {
        if (selectedYear && selectedSemester) {
            setLoading(true);
            handleGetSemester(selectedSemester).then(response => {
                if (response.success && Array.isArray(response.data.data)) {
                    setTimetables(response.data.data);
                } else {
                    console.error("Invalid data format", response.data);
                }
                setLoading(false);
            });
        }
    }, [selectedYear, selectedSemester]);

    const roomsMap = timetables.reduce((acc, log) => {
        if (!acc[log.room]) {
            acc[log.room] = new Set(); // Dùng Set để tránh trùng lặp ca học
        }
        acc[log.room].add(log.session);
        return acc;
    }, {} as Record<string, Set<string>>);

    return (
        <Container>
            <Typography variant="h5" textAlign="center" gutterBottom fontWeight={500} mb={5}>
                XEM LỊCH HỌC KỲ
            </Typography>
            <Stack spacing={4} direction='row' mb={8}>
                <FormControl
                    sx={{
                        width: 400,
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
                    }}>
                    <Typography mr={2}>Năm học:</Typography>
                    <Select 
                        value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map(year => <MenuItem key={year.value} value={year.value}>{year.label}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl
                    sx={{
                        width: 400,
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
                    }}>
                    <Typography>Học kỳ:</Typography>
                    <Select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                        {semesters.map(semester => <MenuItem key={semester.value} value={semester.value}>{semester.label}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
            {loading ? (
                <Typography textAlign='center' mt={2}>Đang tải dữ liệu...</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Table sx={{ borderCollapse: "collapse", minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976D2" }}>
                                <TableCell align="center" sx={{ background: "#99CCFF", fontWeight: "bold", border: "1px solid #ddd" }}>Phòng học</TableCell>
                                <TableCell align="center" sx={{ background: "#99CCFF", fontWeight: "bold", border: "1px solid #ddd" }}>Ca dạy</TableCell>
                                {currentDays.map((day, index) => (
                                    <TableCell key={index} align="center" sx={{ background: "#99CCFF", fontWeight: "bold", border: "1px solid #ddd" }}>{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {Object.entries(roomsMap)
                        .sort(([roomA], [roomB]) => roomA.localeCompare(roomB, 'vi', { numeric: true }))
                        .map(([room, sessions]) => (
                        Array.from(sessions).map((session, index) => (
                            <TableRow key={`${room}-${session}`} sx={{ "&:nth-of-type(even)": { backgroundColor: "#FFF" } }}>
                                {index === 0 && (
                                    <TableCell rowSpan={sessions.size} align="center" sx={{ background: "#FFF", fontWeight: "bold", border: "1px solid #ddd" }}>
                                        {room}
                                    </TableCell>
                                )}
                                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{session.split('(')[0].trim()}</TableCell>
                                {currentDays.map((day) => {
                                    const logs = timetables.filter(
                                        (log) =>
                                            log.room === room && 
                                            log.session === session &&
                                            getVietnameseDay(dayjs(log.date).locale("vi").format("dddd")) === day
                                    );

                                    return (
                                        <TableCell key={day} align="center" sx={{ border: "1px solid #ddd", background: logs.length > 0 ? "#FAFAFA" : "#F2F2F2" }}>
                                            {logs.length > 0 ? (
                                                logs.map((log) => (
                                                    <Box key={log._id} mb={1}>
                                                        <Typography variant="caption" fontWeight="bold" color="#1976D2" display="block">
                                                            Mã lớp: {log.class_id}
                                                        </Typography>
                                                        <Typography variant="caption" display="block">Số tiết: {log.session.replace(/^\D+\(|\)$/g, '')}</Typography>
                                                        <Typography variant="caption" display="block">Môn học: {log.subject_name}</Typography>
                                                        <Typography variant="caption" display="block">Giảng viên: {log.lecturer_name}</Typography>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="caption" fontStyle="italic" color="#9E9E9E">
                                                    Không có lịch
                                                </Typography>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default SemesterCalendarCom;