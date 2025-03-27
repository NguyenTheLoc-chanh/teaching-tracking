import { auth } from "@/auth";
import DetailsClass from "@/components/admin/detailsclass";
import { sendRequest } from "@/utils/api";

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


const TeachingLogsDetailsPage = async ({ params }: { params: { class_id: string } }) => {
    const session = await auth();
    console.log("ID:", params.class_id);
    let teachinglogs: ITeachingLog[] = [];
    try {
        const response = await sendRequest<{ statusCode: number; data: ITeachingLog[]  }>({
            url: `http://localhost:8080/api/v1/teaching-logs/all-teachinglog-classid?class_id=${params.class_id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`
            }
        });
        
        if (response && response.data) {
            teachinglogs = response.data;
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu theo dõi giảng dạy:", error);
    }
    return <DetailsClass teachinglogs ={teachinglogs}/>
}
  
export default TeachingLogsDetailsPage;
  
  
