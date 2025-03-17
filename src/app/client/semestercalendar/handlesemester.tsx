'use server'

import { auth } from "@/auth";
import axios from "axios";

export async function handleGetSemester(timetableId: string) {
    const session = await auth();
    try{
        const infoSemester = await axios.get(
            `http://localhost:8080/api/v1/timetables/unique-timetable`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.access_token}`,
                  },
                  params: { timetableId: timetableId },
            }
        );
        if (infoSemester.status === 200) {
            return { success: true, data: infoSemester.data };
          } else {
            return { success: false, message: "Lấy dữ liệu lương không thành công!" };
          }
    }catch (error){
        console.error("Error fetching data:", error);
    return { success: false, message: "Lỗi khi lấy dữ liệu lương" };
    }
}