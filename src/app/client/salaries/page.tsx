import { auth } from "@/auth";
import SalaryCom from "@/components/client/salary";
import { sendRequest } from "@/utils/api";

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
interface IApiResponse {
    academic_year: string;
    salaries: ISalary[];
}

const SalaryPage = async ({ searchParams }: { searchParams?: { academic_year?: string }}) => {
    // Gọi API lấy danh sách tuần
        const session = await auth();
        const lecturerId = session?.user?.name?.replace('?', '') || "";
        const selectedAcademicYear = searchParams?.academic_year || "2024-2025";
        const [yearsRes, salaryRes] = await Promise.all([
                sendRequest<{ statusCode: number; data: IYear[] }>({
                    url: "http://localhost:8080/api/v1/timetables/academic-years",
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                }),
                sendRequest<{ statusCode: number; data: IApiResponse }>({
                        url: `http://localhost:8080/api/v1/salaries/getsalary?academic_year=${selectedAcademicYear}`,
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${session?.user?.access_token}`,
                        },
                    }),
            ]);
    return <SalaryCom 
        years={yearsRes.data} 
        salaries={salaryRes.data.salaries} 
        selectedAcademicYear={selectedAcademicYear}
    />
}

export default SalaryPage;
