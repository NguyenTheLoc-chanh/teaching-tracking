'use client'
import { handleRemoveTimetableServer } from "@/app/admin/createtimetable/handleTimetable";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useState } from "react";

interface ITimeTable {
  _id: string,
  week: number,
  semester: string,
  academic_year: string,
  timetable_id: string,
}

const getAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    return [
      `${currentYear - 1}-${currentYear}`,
      `${currentYear - 2}-${currentYear - 1}`,
      `${currentYear - 3}-${currentYear - 2}`,
    ];
  };

const CreateTimeTableCom = ({timetables} : {timetables?: ITimeTable[]}) => {
    const { enqueueSnackbar } = useSnackbar();
    const { data: session } = useSession();
    const [academicYear, setAcademicYear] = useState(getAcademicYears()[0]);
    const [semester, setSemester] = useState("");
    const [week, setWeek] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null); // ID của thời khóa biểu cần xóa
    const [openDialog, setOpenDialog] = useState(false);
    const [errors, setErrors] = useState<{ academicYear?: string; semester?: string; week?: string }>({});
    const [timetableList, setTimetableList] = useState<ITimeTable[]>(timetables || []);

    const validateForm = () => {
      const newErrors: { academicYear?: string; semester?: string; week?: string } = {};

      if (!academicYear.trim()) newErrors.academicYear = "Vui lòng chọn năm học!";
      if (!semester.trim()) newErrors.semester = "Vui lòng chọn học kỳ!";
      if (!week.trim() || isNaN(Number(week)) || Number(week) < 1) newErrors.week = "Số tuần phải lớn hơn 0!";

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
    
        try {
          const response = await axios.post("http://localhost:8080/api/v1/timetables", {
            academic_year: academicYear,
            semester,
            week,
          }, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session?.user?.access_token}`,
            },
          });
    
          if (response.status === 201) {
            const newTimetable = response.data.data;
            console.log("Time", newTimetable); 
            setTimetableList((prev) => [...prev, newTimetable]);

            enqueueSnackbar("Tạo thời khóa biểu thành công!", { variant: "success" });
            setWeek("");
            setSemester("");
            setErrors({});
          }else{
            alert(response?.data?.message);
            enqueueSnackbar(response?.data?.message || "Lỗi khi tạo thời khóa biểu!", { variant: "error" });
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 409) {
              enqueueSnackbar("Thời khóa biểu cho năm học và học kỳ này đã tồn tại!", { 
                variant: "warning", 
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000, // Ẩn sau 3 giây
              });
            } else {
              enqueueSnackbar(error.response.data?.message || "Lỗi từ server!", { variant: "error" });
            }
          } else {
            enqueueSnackbar("Lỗi kết nối đến server!", { variant: "error" });
          }
        } finally {
          setLoading(false);
        }
      };
      const handleDelete = async () => {
        if (!deleteId) return;
        const resRemove = await handleRemoveTimetableServer(deleteId);
        if(resRemove.success){
          enqueueSnackbar("Xóa thành công thời khóa biểu!", { variant: "success" });
          setTimetableList((prev) => prev.filter(item => item._id !== deleteId));
          setOpenDialog(false);
        }else{
          enqueueSnackbar("Lỗi khi thực hiện xóa thời khóa biểu!", { variant: "error" });
        }
    };
    
    return (
        <Box>
            <Typography variant="h5" gutterBottom fontWeight={'500'} textAlign={'center'}>
                LẬP THỜI KHÓA BIỂU
            </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              {/* Năm học */}
              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight={500}>Năm học</Typography>
                <Select fullWidth value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                  {getAcademicYears().map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
                {errors.academicYear && <Typography color="error">{errors.academicYear}</Typography>}
              </Grid>

              {/* Học kỳ */}
              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight={500}>Học kỳ</Typography>
                <Select fullWidth value={semester} onChange={(e) => setSemester(e.target.value)} displayEmpty required>
                  <MenuItem value="" disabled>Chọn học kỳ</MenuItem>
                  <MenuItem value="I">Học kỳ 1</MenuItem>
                  <MenuItem value="II">Học kỳ 2</MenuItem>
                </Select>
                {errors.semester && <Typography color="error">{errors.semester}</Typography>}
              </Grid>

              {/* Số tuần */}
              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight={500}>Số tuần</Typography>
                <TextField fullWidth type="number" inputProps={{ min: 1 }} value={week} onChange={(e) => setWeek(e.target.value)} required />
              </Grid>
              {errors.week && <Typography color="error">{errors.week}</Typography>}
            </Grid>

            {/* Nút Gửi */}
            <Box mt={3} display="flex" justifyContent="center">
              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo Thời Khóa Biểu"}
              </Button>
            </Box>
          </form>

          {/* Bảng hiển thị dữ liệu */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>Danh sách thời khóa biểu</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Năm học</TableCell>
                            <TableCell>Học kỳ</TableCell>
                            <TableCell>Số tuần</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(timetableList && timetableList.length > 0) ? (
                            timetableList.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.academic_year}</TableCell>
                                    <TableCell>{item.semester}</TableCell>
                                    <TableCell>{item.week}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                                            <Link href={`createtimetable/${item.timetable_id}`} style={{ textDecoration: "none", color: "#2993FC", fontWeight: "500" }}>
                                                Thêm lớp học
                                            </Link>
                                        </Button>
                                        <Button 
                                          variant="contained" color="error" size="small"
                                          onClick={() => {
                                            setDeleteId(item._id);
                                            setOpenDialog(true);
                                          }}>
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
          {/* Modal Xác nhận Xóa */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa thời khóa biểu này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CreateTimeTableCom;