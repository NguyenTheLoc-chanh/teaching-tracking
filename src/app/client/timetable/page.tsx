import { auth } from "@/auth";
import TimeTableCom from "@/components/client/timetable";
import { sendRequest } from "@/utils/api";

interface IWeek {
    label: string;
    value: number;
}

interface ITeachingLog {
  _id: string;
  class_id: string;
  timetable_id: string;
  session: string;
  date: Date;
  lesson_count: number;
  students_present: number;
  session_status: string;
  subject: {
    name: string; // Tên môn học
    };
  room: string;

}

const TimeTablePage = async () => {
    // Gọi API lấy danh sách tuần
    const session = await auth();
    const lecturerId = session?.user?.name?.replace('?', '') || "";
    // Fetch danh sách tuần từ API backend
    const [weeksRes, teachingLogRes] = await Promise.all([
        sendRequest<{ statusCode: number; data: IWeek[] }>({
            url: "http://localhost:8080/api/v1/teaching-logs/weeks",
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
            },
        }),
        sendRequest<{ statusCode: number; data: ITeachingLog[] }>({
            url: `http://localhost:8080/api/v1/teaching-logs?lecturer_id=${lecturerId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
            },
        }),
    ]);
           
    return <TimeTableCom weeks={weeksRes.data}/>
}

export default TimeTablePage;