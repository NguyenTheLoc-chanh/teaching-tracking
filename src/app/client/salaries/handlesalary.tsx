'use server'

import { auth } from "@/auth";
import axios from "axios";

export async function handleSelectSubject(classId: string) {
    const session = await auth();
    try{
        const infoClass = await axios.get(
            "http://localhost:8080/api/v1/classrooms/getinfodetails",{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.access_token}`,
                  },
                  params: { classId: classId },
            }
        );
        if (infoClass.status === 200) {
            return { success: true, data: infoClass.data };
          } else {
            return { success: false, message: "Lấy dữ liệu lương không thành công!" };
          }
    }catch (error){
        console.error("Error fetching data:", error);
    return { success: false, message: "Lỗi khi lấy dữ liệu lương" };
    }
}

export async function handleSelectSalaryDetails(classId: string) {
    const session = await auth();
    try{
        const infoSalaryDetails = await axios.get(
            `http://localhost:8080/api/v1/salaries/details/${classId}`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.access_token}`,
                  }
            }
        );
        if (infoSalaryDetails.status === 200) {
            return { success: true, data: infoSalaryDetails.data };
          } else {
            return { success: false, message: "Lấy dữ liệu lương không thành công!" };
          }
    }catch (error){
        console.error("Error fetching data:", error);
    return { success: false, message: "Lỗi khi lấy dữ liệu lương" };
    }
}
