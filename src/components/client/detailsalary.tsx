"use client";
import { handleSelectSalaryDetails, handleSelectSubject } from "@/app/client/salaries/handlesalary";
import { Box, Container, Divider, FormControl, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";

interface ISubject {
    subject_id: string;
    subject_name: string;
    class_id: string;
}

interface IClassDetails {
    full_name?: string;
    academic_year?: string;
    semester?: string;
}
interface ISalaryDetail {
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

interface ISalaryDetailAPI {
    lecturer_id: string;
    timetable_id: string;
    total_salary: number;
    quota_value: number;
    student_count: number;
    nfCredit: number;
    breakdown: {
        class_id: string;
        teachingSalary: number;
        gradingAllowance: number;
        travelAllowance: number;
        mealAllowance: number;
        eveningMealAllowance: number;
        totalClassSalary: number;
    };
    allowances: {
        allowance_id: string;
        allowance_name: string;
        quantity: number;
        allowance_value: number;
    }[];
    is_paid: boolean;
}
const SalaryDetailsCom = ({subjects = [], salarydetails}: {subjects?: ISubject[], salarydetails: ISalaryDetail}) => {
    const [selectedSubject, setSelectedSubject] = useState<ISubject | null>(
        subjects.length > 0 ? subjects[0] : null
    );

    const [classDetails, setClassDetails] = useState<IClassDetails | null>(null);
    const [salaryDetailsAPI, setSalaryDetailsAPI] = useState<ISalaryDetailAPI | null>(null);

    // Gọi API ngay khi selectedSubject thay đổi
    useEffect(() => {
        if (selectedSubject) {
            (async () => {
                const resInfoClass = await handleSelectSubject(selectedSubject.class_id);
                const salaryDetailsApi = await handleSelectSalaryDetails(selectedSubject.class_id);

                if (resInfoClass.success) {
                    setClassDetails(resInfoClass.data?.data);
                    setSalaryDetailsAPI(salaryDetailsApi.data?.data);
                } else {
                    setClassDetails(null);
                    setSalaryDetailsAPI(null);
                }
            })();
        }
    }, [selectedSubject]);

    const handleSelectChange = async (event: any) => {
        const selectedClassId = event.target.value;
        const foundSubject = subjects.find((subject) => subject.class_id === selectedClassId);
        setSelectedSubject(foundSubject || null);

        if (foundSubject) {
            const resInfoClass = await handleSelectSubject(selectedClassId);
            const salaryDetailsApi = await handleSelectSalaryDetails(selectedClassId);
            if (resInfoClass.success) {
                setClassDetails(resInfoClass.data?.data); // Gán dữ liệu lấy từ API vào state
                setSalaryDetailsAPI(salaryDetailsApi.data?.data);
            } else {
                setClassDetails(null);
                setSalaryDetailsAPI(null);
            }
        }
    };
    return (
        <Box>
            <Container>
                <Typography variant="h5" gutterBottom fontWeight={'500'} textAlign={'center'} mb={5}>
                    XEM CHI TIẾT PHIẾU LƯƠNG
                </Typography>
                <Stack direction={'row'} justifyContent={'flex-end'} mb={3} alignItems={'center'}>
                    <Typography mr={2}>Năm học:</Typography>
                    <FormControl
                        sx={{
                            width: 270,
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
                        <Select displayEmpty value={selectedSubject?.class_id || ""} onChange={handleSelectChange}>
                            {subjects.length === 0 ? (
                                <MenuItem disabled value="">
                                    Không có môn học
                                </MenuItem>
                            ) : (
                                subjects.map((subject) => (
                                    <MenuItem key={subject.class_id} value={subject.class_id}>
                                        {subject.subject_name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Stack>
                <Typography variant="h5" gutterBottom fontWeight={'500'} mb={2}>
                    Thông tin chi tiết phiếu lương
                </Typography>
                <Divider sx={{ borderBottomWidth: 2, mb: 3 }} />
                <Stack>
                    <Typography fontWeight={'500'} mb={1}>Mã lớp: {selectedSubject?.class_id || "N/A"}</Typography>
                    <Typography fontWeight={'500'} mb={1}>Môn học: {selectedSubject?.subject_name || "N/A"}</Typography>
                    <Typography fontWeight={'500'} mb={1} >Giảng viên: {classDetails?.full_name || "N/A"}</Typography>
                    <Box sx={{display: 'flex'}}>
                        <Typography fontWeight={'500'} mb={1}>Năm học: {classDetails?.academic_year || "N/A"}</Typography>
                        <Typography fontWeight={'500'} mb={1} ml={3}>Học kỳ: {classDetails?.semester || "N/A"}</Typography>
                    </Box>
                </Stack>
                <Stack>
                    <TableContainer component={Paper} sx={{ maxWidth: 900, boxShadow: "4px 4px 10px rgba(0,0,0,0.1)"}}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                    {["STT","KHOẢN MỤC", "SỐ TIẾT", "SỐ LƯỢNG", "HSL", "ĐỊNH MỨC", "THÀNH TIỀN"].map((title, index) => (
                                        <TableCell key={index} sx={{ 
                                            color: "white", 
                                            fontWeight: "bold", 
                                            textAlign: "center",
                                        }}>
                                            {title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {salaryDetailsAPI && salaryDetailsAPI.breakdown ? (
                                    <>
                                        {/* Tiền giảng dạy */}
                                        <TableRow>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell>Tiền giảng dạy</TableCell>
                                            <TableCell align="center">{salaryDetailsAPI.nfCredit * 15}</TableCell>
                                            <TableCell align="center">{salaryDetailsAPI.student_count}</TableCell>
                                            <TableCell align="center">
                                            {salaryDetailsAPI?.student_count <= 70 ? "1.0" : salaryDetailsAPI?.student_count <= 80 ? "1.2" : "1.5"}
                                            </TableCell>
                                            <TableCell align="right">{salaryDetailsAPI.quota_value}</TableCell>
                                            <TableCell align="right">{salaryDetailsAPI?.breakdown?.teachingSalary?.toLocaleString()}</TableCell>
                                        </TableRow>

                                        {/* Các khoản phụ cấp từ mảng allowances */}
                                        {salaryDetailsAPI.allowances.map((allowance, index) => (
                                            <TableRow key={allowance.allowance_id}>
                                                <TableCell align="center">{index + 2}</TableCell>
                                                <TableCell>{allowance.allowance_name}</TableCell>
                                                <TableCell align="center">-</TableCell>
                                                <TableCell align="center">{allowance.quantity}</TableCell>
                                                <TableCell align="center">-</TableCell>
                                                <TableCell align="right">{allowance.allowance_value}</TableCell>
                                                <TableCell align="right">{(allowance.quantity * allowance.allowance_value).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}

                                        {/* Tổng tiền */}
                                        <TableRow>
                                            <TableCell colSpan={6} align="right" sx={{ fontWeight: "bold" }}>
                                                Tổng tiền
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                {salaryDetailsAPI?.breakdown?.totalClassSalary?.toLocaleString()}
                                            </TableCell>
                                        </TableRow>

                                        {/* Thuế khấu trừ (giả sử 10%) */}
                                        <TableRow>
                                            <TableCell colSpan={6} align="right" sx={{ fontWeight: "bold" }}>
                                                Thuế khấu trừ (10%)
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                {(salaryDetailsAPI?.breakdown?.totalClassSalary * 0.1).toLocaleString()}
                                            </TableCell>
                                        </TableRow>

                                        {/* Số tiền được nhận */}
                                        <TableRow>
                                            <TableCell colSpan={6} align="right" sx={{ fontWeight: "bold", color: "green" }}>
                                                Số tiền được nhận
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold", color: "green" }}>
                                                {(salaryDetailsAPI?.breakdown?.totalClassSalary * 0.9).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ): (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ fontStyle: "italic", color: "gray" }}>
                                            Dữ liệu đang được cập nhật...
                                        </TableCell>
                                    </TableRow>
                                )}
                                </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Container>
        </Box>
    )
}

export default SalaryDetailsCom;