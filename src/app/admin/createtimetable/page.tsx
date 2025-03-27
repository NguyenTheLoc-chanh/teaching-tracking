import { auth } from "@/auth";
import CreateTimeTableCom from "@/components/admin/createtimetable";
import { sendRequest } from "@/utils/api";

interface ITimeTable {
    _id: string,
    week: number,
    semester: string,
    academic_year: string,
    timetable_id: string,
}
const CreateTimeTablePage = async () => {
    const session = await auth();
    let timetables: ITimeTable[] = [];
    try {
        const response = await sendRequest<{ statusCode: number; data: { results: ITimeTable[] } }>({
            url: "http://localhost:8080/api/v1/timetables?current=1&pageSize=10",
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`
            }
        });

        if (response && response.data.results) {
            timetables = response.data.results;
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thời khóa biểu:", error);
    }
    return <CreateTimeTableCom timetables = {timetables}/>
}
  
export default CreateTimeTablePage;
  
  
