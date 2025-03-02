"use client";
import { useState } from "react";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { CreateOrUpdateSalary, handleConfirmLeaveNoticeServer, handleConfirmServer, handleUpdateSessionServer } from "@/app/client/timetable/handleConfirm";
import useSWR from "swr";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.locale("vi");

interface IWeek {
  label: string;
  value: number;
}

interface ITeachingLog {
    _id: string;
    class_id: string;
    session: string;
    date: Date;
    lesson_count: number;
    students_present: number;
    teaching_log_id: string;
    session_status: string;
    subject: {
        name: string;
    };
    room: string;
}

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TimeTableCom = ({ weeks }: { weeks: IWeek[]}) => {
    const { data: teachingLogs, mutate } = useSWR("/api/teaching-logs", fetcher, { refreshInterval: 0 });
    // Phần Xác nhận Modal
    const [openModal, setOpenModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ITeachingLog | null>(null);
    const [studentsPresent, setStudentsPresent] = useState<string>('0');
    const [content, setContent] = useState<string>("");
    //Modal Báo nghỉ
    const [openCancelModal, setOpenCancelModal] = useState(false);
    // Modal Cập nhật lịch học mới
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    // Thông báo xác nhận
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // Ngay học mới
    const [newDate, setNewDate] = useState<Dayjs | null>(selectedLog?.date ? dayjs(selectedLog.date) : null);
    // Ca dạy
    const [selectedSession, setSelectedSession] = useState("");

    // Hàm mở modal xác nhận
    const handleOpenModal = (log: ITeachingLog) => {
        setSelectedLog(log);
        setOpenModal(true);
    };
    // Hàm mở modal báo nghỉ
    const handleOpenCancelModal = (log: ITeachingLog) => {
        setSelectedLog(log);
        setOpenCancelModal(true);
    };
    // Hàm mở Modal Update lịch học mới
    const handleOpenModalUpdate = (log: ITeachingLog) => {
        setSelectedLog(log);
        setOpenModalUpdate(true);
    };
    // Hàm đóng modal báo nghỉ
    const handleCloseCancelModal = () => {
        setOpenCancelModal(false);
        setSelectedLog(null);
    };
    // Hàm đóng Modal Update
    const handleCloseModalUpdate = () => {
        setOpenModalUpdate(false);
        setSelectedLog(null);
    };
    // Hàm đóng modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedLog(null);
        setStudentsPresent('0');
        setContent("");
    };


    const handleConfirm = async () => {
        if (!selectedLog) {
            console.error("No log selected!");
            return;
        }
        const response = await handleConfirmServer(selectedLog, studentsPresent, content);
        const responseSalary = await CreateOrUpdateSalary(selectedLog);

        if(response.success && responseSalary.success){
            handleCloseModal();
            mutate();
            setOpenSnackbar(true);
        }else{
            console.error("Cập nhật thất bại!");
        }
    };

    // Hàm xác nhận báo nghỉ
    const handleCancelSession = async () => {
        if (!selectedLog) {
            console.error("No log selected!");
            return;
        }
        const response = await handleConfirmLeaveNoticeServer(selectedLog);

        if(response.success){
            handleCloseCancelModal();
            mutate();
            setOpenSnackbar(true);
        }else{
            console.error("Báo nghỉ thất bại thất bại!");
        }
    };

    // Hàm cập nhật buổi học mới
    const handleUpdateSession = async () => {
        const checkDate = newDate ? newDate.format("YYYY-MM-DD") : "";
        if (!selectedLog) {
            console.error("No log selected!");
            return;
        }
        const response = await handleUpdateSessionServer(selectedLog, checkDate,selectedSession);

        if(response.success){
            handleCloseModalUpdate();
            mutate();
            setOpenSnackbar(true);
        }else{
            console.error("Cập nhật lịch học mới thất bại!");
        }
    };
    
  // Xác định tuần mặc định chứa ngày hiện tại
  const [selectedWeek, setSelectedWeek] = useState<number | null>(() => {
    const today = dayjs();
    const currentWeek = weeks.find(week => {
        const { startDate, endDate } = getWeekDates(week.label);
        return today.isAfter(dayjs(startDate), "day") && today.isBefore(dayjs(endDate), "day");
    });
    return currentWeek ? currentWeek.value : weeks[0]?.value || null;
});
  
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
                                sx={{
                                fontWeight: "bold",
                                textAlign: "center",
                                background: "#E0E0E0",
                                border: "1px solid #D6D6D6",
                                width: "120px",
                                }}
                            >
                                {session}
                            </TableCell>

                            {currentDays.map((day) => {
                                const log = (teachingLogs as ITeachingLog[])?.find(
                                    (log: ITeachingLog) =>
                                      dayjs(log.date).locale("vi").format("DD/MM/YYYY") === day.fullDate &&
                                      log.session.includes(session)
                                );
                                  

                                return (
                                <TableCell
                                    key={day.fullDate}
                                    sx={{
                                    textAlign: "center",
                                    background: log ? "#FAFAFA" : "#F2F2F2",
                                    border: "1px solid #D6D6D6",
                                    minWidth: "180px",
                                    padding: "8px",
                                    }}
                                >
                                    {log ? (
                                    <Box
                                        sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 0.5,
                                        }}
                                    >
                                        <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#1976D2",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                        }}
                                        >
                                        {log.subject.name}
                                        </Typography>
                                        <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#1976D2",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                        }}
                                        >
                                        Mã lớp
                                        </Typography>
                                        <Typography
                                        variant="caption"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                        }}
                                        >
                                        {log.class_id}
                                        </Typography>

                                        <Typography
                                        variant="caption"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                        }}
                                        >
                                        {log.room}
                                        </Typography>

                                        <Typography variant="caption">Số tiết: {log.lesson_count}</Typography>
                                        <Typography variant="caption">SV có mặt: {log.students_present}</Typography>

                                        <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: "bold",
                                            color: log.session_status === "Pending" || log.session_status === "Cancelled" ? "red" : "green",
                                        }}
                                        >
                                        {log.session_status}
                                        </Typography>
                                        {/**Nút xác nhận buổi học */}
                                        {(log.session_status === "Pending" || log.session_status === "Cancelled") && (
                                        <Box display={"flex"}>
                                            {log.session_status === "Pending" && (
                                            <>
                                                <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                sx={{ marginTop: "4px", marginRight: 2 }}
                                                onClick={() => handleOpenModal(log)}
                                                >
                                                Xác nhận
                                                </Button>
                                                <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                sx={{ marginTop: "4px" }}
                                                onClick={() => handleOpenCancelModal(log)}
                                                >
                                                Báo nghỉ
                                                </Button>
                                            </>
                                            )}
                                            {log.session_status === "Cancelled" && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{ marginTop: "4px" }}
                                                onClick={() => handleOpenModalUpdate(log)}
                                                disabled={log.session_status !== "Cancelled"}
                                            >
                                                Cập nhật lịch học mới
                                            </Button>
                                            )}
                                        </Box>
                                        )}
                                    </Box>
                                    ) : (
                                    <Typography variant="caption" sx={{ fontStyle: "italic", color: "#9E9E9E" }}>
                                        Không có lịch
                                    </Typography>
                                    )}
                                </TableCell>
                                );
                            })}
                            </TableRow>
                        ))}
                        </TableBody>
                </Table>
            </TableContainer>

            {/* Modal Xác nhận buổi học */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" fontWeight="bold">Xác nhận buổi học</Typography>

                    <Stack spacing={2} mt={2}>
                    <TextField
                        label="Số sinh viên có mặt"
                        type="text"
                        fullWidth
                        value={studentsPresent}
                        onChange={(e) => setStudentsPresent(e.target.value.replace(/\D/g, ''))}
                    />
                    <TextField
                        label="Ghi chú buổi học"
                        multiline
                        rows={3}
                        fullWidth
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    </Stack>

                    <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="contained" color="success" onClick={handleConfirm}>Xác nhận</Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Modal Báo nghỉ */}
            <Modal open={openCancelModal} onClose={handleOpenCancelModal}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2 
                }}>
                    <Typography variant="h6" fontWeight="bold">Xác nhận báo nghỉ</Typography>
                    <Typography mt={2}>
                        Bạn có chắc chắn muốn báo nghỉ cho lớp <b>{selectedLog?.subject.name}</b> không?
                    </Typography>

                    <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
                        <Button variant="outlined" onClick={handleCloseCancelModal}>Hủy</Button>
                        <Button variant="contained" color="error" onClick={handleCancelSession}>Xác nhận</Button>
                    </Stack>
                </Box>
            </Modal>
            {/* Modal Update lịch học mới */}
            <Modal open={openModalUpdate} onClose={handleCloseModalUpdate}>
                <Box
                    sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{textAlign:'center'}}>
                    Cập nhật buổi học mới
                    </Typography>
                    <Typography variant="body1">Lớp: {selectedLog?.class_id}</Typography>
                    <Typography variant="body1">Môn học: {selectedLog?.subject.name}</Typography>
                    <Typography variant="body1">Ngày học cũ: {dayjs(selectedLog?.date).format("DD/MM/YYYY")}</Typography>
                    {/* Chọn ngày mới */}
                    <Typography variant="h6" sx={{ mt:2}}>
                        Chọn ngày học bổ sung
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Chọn ngày mới"
                        value={newDate}
                        onChange={(date) => setNewDate(date)}
                        slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
                    />
                    </LocalizationProvider>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Ca học</InputLabel>
                        <Select
                            value={selectedSession}
                            onChange={(event) => setSelectedSession(event.target.value)}
                        >
                            <MenuItem value="Sáng(T1-4)">Sáng(T1-4)</MenuItem>
                            <MenuItem value="Chiều(T5-8)">Chiều(T5-8)</MenuItem>
                            <MenuItem value="Tối(T9-12)">Tối(T9-12)</MenuItem>
                        </Select>
                    </FormControl>
        
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button onClick={handleCloseModalUpdate} variant="outlined" sx={{ mr: 2 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleUpdateSession} variant="contained" color="primary">
                        Xác nhận
                    </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Thông báo */}
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Xác nhận thành công!
                </Alert>
            </Snackbar>
    </Box>
  );
};

export default TimeTableCom;
