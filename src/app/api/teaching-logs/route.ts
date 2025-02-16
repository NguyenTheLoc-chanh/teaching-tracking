import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lecturerId = session?.user?.name?.replace("?", "") || "";

  const teachingLogRes = await sendRequest<{ statusCode: number; data: any[] }>({
    url: `http://localhost:8080/api/v1/teaching-logs?lecturer_id=${lecturerId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return NextResponse.json(teachingLogRes.data);
}
