import { auth } from "@/auth";
import SemesterCalendarCom from "@/components/client/semestercalendar";
import { sendRequest } from "@/utils/api";
import { Box, Container, Typography } from "@mui/material"

interface IYear {
    label: string;
    value: string;
}

interface ISemester {
    label: string;
    value: string;
}
const getCurrentAcademicYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};
const SemesterCalendarPage = async ({ searchParams }: { searchParams?: { academic_year?: string }}) => {
// Gọi API lấy danh sách tuần
    const session = await auth();
    const lecturerId = session?.user?.name?.replace('?', '') || "";
    const selectedAcademicYear = searchParams?.academic_year || getCurrentAcademicYear();
    const [yearsRes, semesterRes] = await Promise.all([
        sendRequest<{ statusCode: number; data: IYear[] }>({
            url: "http://localhost:8080/api/v1/timetables/academic-years",
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
                },
            }),
        sendRequest<{ statusCode: number; data: ISemester[] }>({
            url: `http://localhost:8080/api/v1/timetables/semester-calendar?academic_year=${selectedAcademicYear}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
            },
        }),
    ]);
    return <SemesterCalendarCom years={yearsRes.data} semesters={semesterRes.data}/>
}

export default SemesterCalendarPage;