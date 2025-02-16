'use server'
import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import axios from "axios";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

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

    if (response.status === 200) {
      return { success: true };
    }
    return { success: false, message: 'Error confirming' };
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
    class_id: selectedLog.class_id,
    timetable_id: selectedLog.timetable_id,
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




