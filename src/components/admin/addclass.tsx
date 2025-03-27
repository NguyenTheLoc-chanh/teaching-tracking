"use client";
import { addClass } from "@/app/admin/createtimetable/[id]/handleclass";
import { Box, Button, Grid, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";

interface ILecturer {
    _id: string,
    lecturer_id: string,
    full_name: string
}

interface ISubject {
    _id: string,
    subject_id: string,
    name: string,
    nfCredit: number
}
interface IClassroom {
    _id: string,
    class_id: string,
    subject_id: string,
    lecturer_id: string,
    room: string,
    start_time: Date,
    end_time: Date,
    student_count: number,
    lecturer_name: string,
    subject_name: string,
}
const AddClassPageCom = ({subjects, lecturers, rooms, params,classes}: {subjects?: ISubject[], lecturers?: ILecturer[], rooms: string[], params: string, classes?: IClassroom[] }) =>{
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [credit, setCredit] = useState<number | null>(null);
    const [classList, setClassList] = useState<IClassroom[]>(classes || []);
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        class_id: "",
        subject_id: "",
        lecturer_id: "",
        room: "",
        start_time: "",
        end_time: "",
        student_count: "",
        study_shift: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;

    // Nếu chọn môn học, cập nhật số tín chỉ
    if (name === "subject_id") {
        const selectedSubject = subjects?.find(subj => subj.subject_id === value);
        if (selectedSubject) {
            setCredit(selectedSubject.nfCredit); // Lưu số tín chỉ vào state
        } else {
            setCredit(null); // Nếu không có môn học, đặt lại số tín chỉ
        }
    }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const timetable_id = params;
        const result = await addClass(formData,credit,session,timetable_id);

        if (result.success) {
            enqueueSnackbar("Tạo lớp học thành công!", { variant: "success" });
            setClassList(prev => [...prev, result.data]);
            setFormData({ class_id: "", subject_id: "", lecturer_id: "", room: "", start_time: "",study_shift: "", end_time: "", student_count: "" });
        } else {
            enqueueSnackbar("Tạo lớp học thất bại!", { variant: "error" });
        }
        setLoading(false);
        
    };
       
    return(
        <Box>
            <Button variant="outlined" color="secondary" onClick={() => router.back()} sx={{ mb: 2 }}>
                Quay lại
            </Button>
            <Typography variant="h5" gutterBottom fontWeight={'500'} textAlign={'center'}>
                LẬP THỜI KHÓA BIỂU
            </Typography>
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 3, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
                <Typography variant="h6" gutterBottom>Thêm Lớp Học</Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Cột 1 */}
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Mã lớp" name="class_id" value={formData.class_id} onChange={handleChange} required sx={{ mb: 2 }} />

                            <Select fullWidth name="subject_id" value={formData.subject_id} onChange={handleChange} displayEmpty required sx={{ mb: 2 }}>
                                <MenuItem value="" disabled>Chọn môn học</MenuItem>
                                {Array.isArray(subjects )&& subjects.map((subj) => (
                                    <MenuItem key={subj.subject_id} value={subj.subject_id}>{subj.name}</MenuItem>
                                ))}
                            </Select>

                            <Select fullWidth name="lecturer_id" value={formData.lecturer_id} onChange={handleChange} displayEmpty required sx={{ mb: 2 }}>
                                <MenuItem value="" disabled>Chọn giảng viên</MenuItem>
                                {Array.isArray(lecturers) && lecturers.map((lect) => (
                                    <MenuItem key={lect.lecturer_id} value={lect.lecturer_id}>{lect.full_name}</MenuItem>
                                ))}
                            </Select>

                            <Select fullWidth name="room" value={formData.room} onChange={handleChange} displayEmpty required sx={{ mb: 2 }}>
                                <MenuItem value="" disabled>Chọn phòng học</MenuItem>
                                {rooms.map((room) => (
                                    <MenuItem key={room} value={room}>{room}</MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        {/* Cột 2 */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Ngày bắt đầu"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                type="date"
                                label="Ngày kết thúc"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />

                            <TextField fullWidth type="number" label="Số sinh viên" name="student_count" value={formData.student_count} onChange={handleChange} required inputProps={{ min: 1 }} sx={{ mb: 2 }} />
                            <Select fullWidth name="study_shift" onChange={handleChange} displayEmpty required sx={{ mb: 2 }}>
                                <MenuItem value="" disabled>Chọn ca học</MenuItem>
                                <MenuItem value="Sáng(T1-4)">Sáng</MenuItem>
                                <MenuItem value="Chiều(T5-8)">Chiều</MenuItem>
                                <MenuItem value="Tối(T9-12)">Tối</MenuItem>
                            </Select>
                        </Grid>
                        <Button fullWidth variant="contained" color="primary" type="submit">
                            Thêm Lớp
                        </Button>
                    </Grid>
                </form>
            </Box>
               {/*Bảng hiển thị thông tin lớp  */}
            <Box>
                <Typography variant="h6" gutterBottom>Danh sách lớp học</Typography>
                <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Mã lớp học</TableCell>
                                            <TableCell>Môn học</TableCell>
                                            <TableCell>Giảng viên</TableCell>
                                            <TableCell>Phòng học</TableCell>
                                            <TableCell>Thời gian bắt đầu</TableCell>
                                            <TableCell>Số lượng sinh viên</TableCell>
                                            <TableCell>Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(classList.length > 0) ? (
                                            classList.map((item, index) => (
                                                <TableRow key={item._id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.class_id}</TableCell>
                                                    <TableCell>{item.subject_name}</TableCell>
                                                    <TableCell>{item.lecturer_name}</TableCell>
                                                    <TableCell>{item.room}</TableCell>
                                                    <TableCell>{new Date(item.start_time).toLocaleDateString()}</TableCell>
                                                    <TableCell>{item.student_count}</TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                                                            <Link href={`detailsclassteach/${item.class_id}`} style={{ textDecoration: "none", color: "#2993FC", fontWeight: "500" }}>
                                                                Xem chi tiết
                                                            </Link>
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
        </Box>
    );
}

export default AddClassPageCom;