"use client";
import { Box, Container, FormControl, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Image from "next/image";
import salary from '../../../images/salary.png';
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IYear {
    label: string;
    value: string;
}
interface ISalary {
    _id: string;
    lecturer_id: string;
    timetable_id: string;
    total_salary: number;
    breakdown: {
        class_id: string;
        teachingSalary: number;
        gradingAllowance: number;
        travelAllowance: number;
        mealAllowance: number;
        eveningMealAllowance: number;
        totalClassSalary: number;
    }[];
    is_paid: boolean;
    semester: string;
}
const SalaryCom = ({years, salaries, selectedAcademicYear} : {years: IYear[], salaries: ISalary[], selectedAcademicYear: string }) => {
    const router = useRouter();

    const handleYearChange = (event: any) => {
        const newYear = event.target.value;
        router.push(`?academic_year=${newYear}`); 
    };
    return (
        <Box
            sx={{
                overflow: "hidden !important",
                maxWidth: "100%",
            }}
            >
            <Container>
                <Typography variant="h5" gutterBottom fontWeight={'500'} textAlign={'center'} mb={5}>
                    XEM BẢNG LƯƠNG
                </Typography>
                <Stack direction={'row'} justifyContent={'flex-start'} mb={3} alignItems={'center'}>
                    <Typography mr={2}>Năm học:</Typography>
                    <FormControl
                        sx={{
                            width: 203,
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
                            value={selectedAcademicYear}
                            onChange={handleYearChange}
                            displayEmpty
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
                            {years.map((year) => (
                            <MenuItem key={year.value} value={year.value}
                                sx={{
                                    textAlign: 'center',
                                    display: 'flex',
                                    height: 40
                                }}>
                                {year.label}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <Stack
                    spacing={4}
                    direction="row"
                    justifyContent="space-between"
                    mb={5}
                    sx={{
                        maxWidth: 920,
                        height: 288,
                        background: "linear-gradient(135deg, rgba(251, 192, 20, 0.6), rgba(255, 223, 99, 0.8))",
                        boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.15)",
                        borderRadius: "20px",
                        padding: "24px 32px",
                    }}
                    >
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Typography variant="h5" fontWeight={500} color="#333" mb={4} mt={2}>
                            Tổng lương thực nhận năm học {selectedAcademicYear}
                        </Typography>
                        <Typography variant="h3" fontWeight={700} color="#d32f2f">
                            {salaries ? salaries.reduce((sum, salary) => sum + salary.total_salary, 0).toLocaleString() : "0"}đ
                        </Typography>
                    </Box>
                    <Box sx={{ position: "relative", textAlign: 'center', width: 200, height: 200 }}>
                        <Image src={salary} alt="Tổng lương" layout="fill" objectFit="contain" />
                    </Box>
                </Stack>
                <TableContainer component={Paper} sx={{ maxWidth: 900, boxShadow: "4px 4px 10px rgba(0,0,0,0.1)"}}>
                    <Table>
                        <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            {["STT", "HỌC KỲ", "NĂM HỌC", "SỐ TIỀN ĐƯỢC NHẬN", "TRẠNG THÁI", "#"].map((title, index) => (
                            <TableCell key={index} sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                                {title}
                            </TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {salaries && salaries.length > 0 ? (
                            salaries.map((salary, index) => (
                                <TableRow key={salary._id}>
                                    <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{salary.semester}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{selectedAcademicYear}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{salary.total_salary.toLocaleString()}đ</TableCell>
                                    <TableCell sx={{ textAlign: "center", color: salary.is_paid ? "true" : "false" }}>
                                        {salary.is_paid ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`salaries/${salary._id}`} style={{ textDecoration: "none", color: "#2993FC", fontWeight: "500" }}>
                                            Xem chi tiết
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: "center", fontStyle: "italic", color: "gray" }}>
                                    Chưa có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    )
}

export default SalaryCom;