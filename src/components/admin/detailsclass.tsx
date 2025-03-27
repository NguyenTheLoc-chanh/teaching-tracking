"use client";
import { handleUpdateTeachingLogServer } from "@/app/admin/createtimetable/handleTimetable";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";

interface ITeachingLog {
    _id: string;
    class_id: string;
    timetable_id: string;
    session: string;
    date: Date;
    lesson_count: number;
    students_present: number;
    session_status: string;
    room: string;
    content: string;
}

const DetailsClass = ({teachinglogs}: {teachinglogs?: ITeachingLog[]}) => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    // Chuyển danh sách teachinglogs vào state để cập nhật ngay khi chỉnh sửa
    const [logs, setLogs] = useState<ITeachingLog[]>(teachinglogs || []);
    // State quản lý modal
    const [open, setOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ITeachingLog | null>(null);
    const [newDate, setNewDate] = useState("");
    const [newSession, setNewSession] = useState("");

    const handleEditClick = (log: ITeachingLog) => {
        setSelectedLog(log);
        setNewDate(new Date(log.date).toISOString().split("T")[0]); // Định dạng yyyy-MM-dd
        setNewSession(log.session);
        setOpen(true);
    };

    // Đóng modal
    const handleClose = () => {
        setOpen(false);
        setSelectedLog(null);
    };
    // Xác nhận chỉnh sửa
    const handlUpdate = async () => {
        if (!selectedLog) return;
        const resUpdate = await handleUpdateTeachingLogServer(selectedLog._id, newDate, newSession);
        if(resUpdate.success){
            enqueueSnackbar("Cập nhật thành công buổi học!", { variant: "success" });
            setLogs((prevLogs) => prevLogs.map((log) =>
                log._id === selectedLog._id ? { ...log, date: new Date(newDate), session: newSession } : log
            ));
            setOpen(false);
        }else{
            enqueueSnackbar("Lỗi khi thực hiện cập nhật buổi học!", { variant: "error" });
        }
    };

    return(
        <Box>
            <Button variant="outlined" color="secondary" onClick={() => router.back()} sx={{ mb: 2 }}>
                Quay lại
            </Button>
            <Typography variant="h5" gutterBottom fontWeight={'500'} textAlign={'center'}>
                THEO DÕI GIẢNG DẠY
            </Typography>
            <Box>
                <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Mã lớp học</TableCell>
                                            <TableCell>Ca học</TableCell>
                                            <TableCell>Ngày học</TableCell>
                                            <TableCell>Số tiết</TableCell>
                                            <TableCell>Số sinh viên</TableCell>
                                            <TableCell>Nội dung</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell>Xử lý</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(logs.length > 0) ? (
                                            logs.map((item, index) => (
                                                <TableRow key={item._id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.class_id}</TableCell>
                                                    <TableCell>{item.session}</TableCell>
                                                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{item.lesson_count}</TableCell>
                                                    <TableCell>{item.students_present}</TableCell>
                                                    <TableCell>{item.content}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            color: item.session_status === "Confirmed" ? "green" :
                                                                   item.session_status === "Updated" ? "orange" :
                                                                   item.session_status === "Pending" ? "red" : "inherit",
                                                            fontWeight: "bold"
                                                        }}
                                                    >{item.session_status}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            variant="contained" color="primary" size="small" sx={{ mr: 1 }}
                                                            onClick={() => handleEditClick(item)}>
                                                            Sửa
                                                        </Button>
                                                        {/* onClick={() => onDelete(item._id) */}
                                                        <Button variant="contained" color="error" size="small">
                                                            Xóa
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">Không có dữ liệu</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
            </Box>
            {/* Modal chỉnh sửa */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Chỉnh sửa ca học</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Ngày học"
                        type="date"
                        fullWidth
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Ca học"
                        select
                        fullWidth
                        value={newSession}
                        onChange={(e) => setNewSession(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="Sáng(T1-4)">Sáng</MenuItem>
                        <MenuItem value="Chiều(T5-9)">Chiều</MenuItem>
                        <MenuItem value="Tối(T9-12)">Tối</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Hủy</Button>
                    <Button onClick={handlUpdate} color="primary">Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DetailsClass;