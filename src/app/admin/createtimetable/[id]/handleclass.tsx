import { auth } from "@/auth";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


export async function addClass(formData: any,credit: any, session: any, timetable_id: string) {
    const { study_shift, ...filteredFormData } = formData;
    const body ={
        class_id: filteredFormData.class_id,
        subject_id: filteredFormData.subject_id,
        lecturer_id: filteredFormData.lecturer_id,
        timetable_id: timetable_id,
        room: filteredFormData.room,
        start_time: filteredFormData.start_time,
        end_time: filteredFormData.end_time,
        student_count: filteredFormData.student_count,

    }
    try {
        const response = await axios.post(
            "http://localhost:8080/api/v1/classrooms",
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.access_token}`,
                },
            }
        );
        if (response.status === 201) {
            const newClass = response.data.data;
            const teachingLogId = uuidv4();
            const body = {
                class_id: newClass.class_id,
                teaching_log_id: teachingLogId,
                session: study_shift,
                date: newClass.start_time,
                credit: credit
              };
            
              const logResponse = await axios.post(
                "http://localhost:8080/api/v1/teaching-logs",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session?.user?.access_token}`,
                    },
                }
            );
            if (logResponse.status === 201) {
                return { success: true, message: "Thêm lớp học và Teaching Log thành công!", data: response.data.data };
            } else {
                return { success: false, message: "Thêm lớp học thành công nhưng lỗi khi tạo Teaching Log!" };
            }
        } else {
            return { success: false, message: "Lỗi khi thêm lớp học!" };
        }
    } catch (error) {
        console.error("Error adding class:", error);
        return { success: false, message: "Lỗi khi thêm lớp học!" };
    }
}
