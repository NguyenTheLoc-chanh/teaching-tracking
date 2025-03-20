'use server'

import { auth } from "@/auth";
import axios from "axios";

export async function handleUpdateInfomation(updatedData: { lecturer_id: string; date_of_birth?: string; address?: string }) {
    const session = await auth();
  
    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/lecturers`,updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.access_token}`,
        }
      });
  
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Error confirming' };
    } catch (error) {
      console.error('Error confirming session:', error);
      return { success: false, message: error };
    }
  }