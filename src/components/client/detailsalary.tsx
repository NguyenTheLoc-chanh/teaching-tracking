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
    min_lessons: number;
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
const mergeAllowances = (accAllowances: any[] = [], currAllowances: any[] = []) => {
    const merged = [...accAllowances];

    currAllowances.forEach(currAllowance => {
        const existing = merged.find(item => item.allowance_id === currAllowance.allowance_id);
        if (existing) {
            existing.quantity += currAllowance.quantity;
        } else {
            merged.push({ ...currAllowance });
        }
    });

    return merged;
};

const aggregateSalaryDetails = (salaryDetailsArray: ISalaryDetailAPI[] | null): ISalaryDetailAPI => {
    if (!salaryDetailsArray || salaryDetailsArray.length === 0) {
        return {} as ISalaryDetailAPI;
    }

    return salaryDetailsArray.reduce((acc: ISalaryDetailAPI, curr: ISalaryDetailAPI,index) => {
        if (!curr) return acc;

        return {
            lecturer_id: curr.lecturer_id,
            timetable_id: "all",
            total_salary: acc.total_salary + curr.total_salary,
            quota_value: index === 0 ? curr.quota_value : acc.quota_value,
            student_count: acc.student_count + curr.student_count,
            nfCredit: acc.nfCredit + curr.nfCredit,
            min_lessons: acc.min_lessons + curr.min_lessons,
            breakdown: {
                class_id: curr.breakdown.class_id,
                teachingSalary: acc.breakdown.teachingSalary + curr.breakdown.teachingSalary,
                gradingAllowance: acc.breakdown.gradingAllowance + curr.breakdown.gradingAllowance,
                travelAllowance: acc.breakdown.travelAllowance + curr.breakdown.travelAllowance,
                mealAllowance: acc.breakdown.mealAllowance + curr.breakdown.mealAllowance,
                eveningMealAllowance: acc.breakdown.eveningMealAllowance + curr.breakdown.eveningMealAllowance,
                totalClassSalary: acc.breakdown.totalClassSalary + curr.breakdown.totalClassSalary,
            },
            allowances: mergeAllowances(acc.allowances, curr.allowances),
            is_paid: acc.is_paid && curr.is_paid
        };
    }, {
        lecturer_id: "",
        timetable_id: "",
        total_salary: 0,
        quota_value: 0,
        student_count: 0,
        nfCredit: 0,
        min_lessons: 0,
        breakdown: {
            class_id: "",
            teachingSalary: 0,
            gradingAllowance: 0,
            travelAllowance: 0,
            mealAllowance: 0,
            eveningMealAllowance: 0,
            totalClassSalary: 0,
        },
        allowances: [],
        is_paid: true
    });
};


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
        if (selectedClassId === "all") {
            // Lấy dữ liệu tất cả các lớp học
            const allSalaryDetails = await Promise.all(
                subjects.map(subject => handleSelectSalaryDetails(subject.class_id))
            );
    
            const aggregatedSalary = aggregateSalaryDetails(allSalaryDetails.map(res => res.data?.data));
            setSalaryDetailsAPI(aggregatedSalary);
            setSelectedSubject(null);
        } else {
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
                            top: '-5px', 
                            fontSize: '14px', 
                            lineHeight: '36px', 
                            },
                            '.MuiSelect-select': {
                            height: '36px',
                            padding: '0 8px',
                            display: 'flex',
                            alignItems: 'center',
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #ccc',
                            height: '36px',
                            },
                        }}
                        >
                        <Select displayEmpty value={selectedSubject?.class_id || "all"} onChange={handleSelectChange}>
                            <MenuItem value="all">Chọn tất cả</MenuItem>
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
                {selectedSubject?.class_id && (
                    <Typography fontWeight={'500'} mb={1}>
                        Mã lớp: {selectedSubject.class_id}
                    </Typography>
                )}

                {selectedSubject?.subject_name && (
                    <Typography fontWeight={'500'} mb={1}>
                        Môn học: {selectedSubject.subject_name}
                    </Typography>
                )}
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
                                            <TableCell align="center">{salaryDetailsAPI.min_lessons}</TableCell>
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
                                                {((salaryDetailsAPI?.breakdown?.teachingSalary + salaryDetailsAPI?.breakdown?.gradingAllowance) * 0.1).toLocaleString()}
                                            </TableCell>
                                        </TableRow>

                                        {/* Số tiền được nhận */}
                                        <TableRow>
                                            <TableCell colSpan={6} align="right" sx={{ fontWeight: "bold", color: "green" }}>
                                                Số tiền được nhận
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold", color: "green" }}>
                                                {(salaryDetailsAPI?.breakdown?.totalClassSalary - ((salaryDetailsAPI?.breakdown?.teachingSalary + salaryDetailsAPI?.breakdown?.gradingAllowance)*0.1)).toLocaleString()}
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