'use server'
import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import axios from "axios";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

interface ITeachingLog {
    _id: string;
    class_id: string;
    session: string;
    date: Date;
    lesson_count: number;
    students_present: number;
    teaching_log_id: string;
    session_status: string;
    subject: {
      name: string; // Tên môn học
      };
    room: string;
  
}

export async function handleConfirmServer(selectedLog: ITeachingLog, studentsPresent: string, content: string) {

  const session = await auth();

  const body = {
    students_present: parseInt(studentsPresent,10),
    content: content,
  };

  try {
    const response = await axios.patch(`http://localhost:8080/api/v1/teaching-logs/${selectedLog._id}/confirm`, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.access_token}`,
      }
    });

    if (response.status !== 200) {
      return { success: false, message: 'Cập nhật không thành công!' };
    }

    const date = new Date(selectedLog.date).toISOString();
    if (!date) {
      return { success: false, message: 'Date is required' };
    }
    const allowanceResponse = await axios.get(`http://localhost:8080/api/v1/allowance-details/determine/${selectedLog.teaching_log_id}`,{
      params: { date: date }, 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.access_token}`,
      }
    });
    
    const allowanceIds = allowanceResponse.data.data;
    if (!allowanceIds || allowanceIds.length === 0) {
      return { success: true, message: 'Cập nhật thành công!' };
    }
    try {
      const updateResponse = await axios.patch(
        `http://localhost:8080/api/v1/allowance-details/update`,
        {
          allowanceIds: allowanceIds,
          trackingId: selectedLog.teaching_log_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.access_token}`,
          },
        }
      );
    
      console.log("Response:", updateResponse.data);
    } catch (error) {
      console.error("Error updating allowance detail:",error);
    }

    return { success: true, message: 'Cập nhật thành công!' };
  } catch (error) {
    console.error('Error confirming session:', error);
    return { success: false, message: error };
  }
}

// API Xác nhận Nghỉ
export async function handleConfirmLeaveNoticeServer(selectedLog: ITeachingLog) {

  const session = await auth();

  try {
    const response = await axios.patch(`http://localhost:8080/api/v1/teaching-logs/${selectedLog._id}/confirmleave`,{}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.access_token}`,
      }
    });

    if (response.status === 200) {
      return { success: true };
    }
    return { success: false, message: 'Error confirming' };
  } catch (error) {
    console.error('Error confirming session:', error);
    return { success: false, message: error };
  }
}
// Hàm cập nhật buổi học mới
export async function handleUpdateSessionServer(selectedLog: ITeachingLog, updateDate: string, sessionNew: string) {

  const session = await auth();
  if (!updateDate) {
    console.error("Lỗi: Ngày truyền vào API bị null hoặc không hợp lệ.");
    return { success: false, message: "Ngày không hợp lệ" };
  }
  const body = {
    teaching_log_id: selectedLog.teaching_log_id,
    class_id: selectedLog.class_id,
    session: sessionNew,
    date: updateDate,
    lesson_count: selectedLog.lesson_count,
  };
  
  try {
    await axios.patch(`http://localhost:8080/api/v1/teaching-logs/${selectedLog._id}/updatesessionold`,{}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.access_token}`,
      }
    });

    const response = await axios.post(`http://localhost:8080/api/v1/teaching-logs`, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.access_token}`,
      }
    });

    if (response.status === 201) {
      return { success: true };
    }
    return { success: false, message: 'Error creating teaching log' };
  } catch (error) {
    console.error('Error creating teaching log:', error);
    return { success: false, message: error };
  }
}

export async function CreateOrUpdateSalary(selectedLog: ITeachingLog) {
  const session = await auth();


  if (!session?.user?.access_token) {
    return { success: false, message: "Bạn chưa đăng nhập!" };
  }

  try {
    // Lấy timetable_id từ class_id của selectedLog
    const timetableResponse = await axios.get(
      "http://localhost:8080/api/v1/classrooms",{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user?.access_token}`,
        },
        params: { classId: selectedLog.class_id },
      }
    );
    if (timetableResponse.status !== 200 || !timetableResponse.data) {
      return { success: false, message: "Không lấy được mã thời khóa biểu!" };
    }
    const timetableId = timetableResponse.data.data; // Lấy timetable_id từ response
    
    const response = await axios.get(
      "http://localhost:8080/api/v1/salaries", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.user?.access_token}`,
      },
      params: { timetable_id: timetableId },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Lấy dữ liệu lương không thành công!" };
    }
  } catch (error) {
    console.error("Error fetching salary:", error);
    return { success: false, message: "Lỗi khi lấy dữ liệu lương" };
  }
}