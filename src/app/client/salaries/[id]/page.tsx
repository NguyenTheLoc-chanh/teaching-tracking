import { auth } from "@/auth";
import SalaryDetailsCom from "@/components/client/detailsalary";
import { sendRequest } from "@/utils/api";
import { Typography } from "@mui/material";

interface ISubject {
    subject_id: string;
    subject_name: string;
    class_id: string;
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

const SalaryDetailsPage = async ({ params }: { params: { id: string } }) =>{
    const session = await auth();
    const [salaryDetail] = await Promise.all([
        sendRequest<{ statusCode: number; data: ISalaryDetail }>({
            url: `http://localhost:8080/api/v1/salaries/detail/${params.id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
            },
        })
    ]);

    const salaryRes = salaryDetail.data;
    console.log("Salary:", salaryDetail.data);
    if (!salaryDetail.data) {
        return <Typography textAlign="center" mt={5}>Không tìm thấy dữ liệu phiếu lương.</Typography>;
    }

    if (!salaryRes || !Array.isArray(salaryRes.breakdown)) {
        return <Typography textAlign="center" mt={5}>Dữ liệu phiếu lương không hợp lệ.</Typography>;
    }
    const classIds = salaryRes.breakdown.map((item) => item.class_id.trim());
    const queryString = classIds.join(",");
    console.log("ClassID:",queryString);
    const subjectResponse = await sendRequest<{ statusCode: number; data: { data: ISubject[] }}>({
        url: `http://localhost:8080/api/v1/subjects/by-class-ids?classIds=${queryString}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    });
    const subjects = Array.isArray(subjectResponse?.data?.data) ? subjectResponse.data?.data : [];
    console.log("Subject:", subjects);
    return <SalaryDetailsCom subjects={subjects} salarydetails = {salaryDetail.data}/>
}

export default SalaryDetailsPage;