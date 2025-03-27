'use server'
import { auth } from "@/auth";
import axios from "axios";

export async function handleRemoveTimetableServer(_id: string) {

  const session = await auth();

  try {
    const response = await axios.delete(`http://localhost:8080/api/v1/timetables/${_id}`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.access_token}`,
      }
    });

    if (response.status === 200) {
      return { success: true };
    }
    return { success: false, message: 'Xảy ra lỗi khi thực hiện xóa!' };
  } catch (error) {
    console.error('Error confirming session:', error);
    return { success: false, message: error };
  }
}

export async function handleUpdateTeachingLogServer(_id: string,date: string, session_study: string) {

    const session = await auth();
  
    const body = {
      date: date,
      session: session_study,
    };
  
    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/teaching-logs/${_id}/update`, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.access_token}`,
        }
      });
  
      if (response.status !== 200) {
        return { success: false, message: 'Cập nhật buổi học không thành công!' };
      }
      return { success: true, message: 'Cập nhật buổi học thành công!' };
    } catch (error) {
      console.error('Error confirming session:', error);
      return { success: false, message: error };
    }
  }