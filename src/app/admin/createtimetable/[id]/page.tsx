import { auth } from "@/auth";
import AddClassPageCom from "@/components/admin/addclass";
import { sendRequest } from "@/utils/api";

interface ILecturer {
    _id: string,
    lecturer_id: string,
    full_name: string
}

interface ISubject {
    _id: string,
    subject_id: string,
    name: string,
    nfCredit: number
}

interface IClassroom {
    _id: string,
    class_id: string,
    subject_id: string,
    lecturer_id: string,
    room: string,
    start_time: Date,
    end_time: Date,
    student_count: number,
    lecturer_name: string,
    subject_name: string,
}

const AddClassPage = async ({ params }: { params: { id: string } }) => {
    const session = await auth();
    const rooms = ["P21", "P22", "P23", "P24", "P31", "P32", "P33", "P34", "P41", "P42","P43", "P44", "P51", "P52"];
    const [LecturerRes, subRes, classRes] = await Promise.all([
        sendRequest<{ statusCode: number; data: {results: ILecturer[]} }>({
            url: "http://localhost:8080/api/v1/lecturers",
                method: "GET",
                    headers: {
                            Authorization: `Bearer ${session?.user?.access_token}`,
                        },
                    }),
        sendRequest<{ statusCode: number; data: ISubject[] }>({
            url: `http://localhost:8080/api/v1/subjects`,
                method: "GET",
                    headers: {
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                    }),
        sendRequest<{ statusCode: number; data: IClassroom[] }>({
            url: `http://localhost:8080/api/v1/classrooms/all-class?timetable_id=${params.id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
            },
        }),
    ]);
    return <AddClassPageCom
        subjects ={subRes.data}
        lecturers ={LecturerRes.data.results}
        rooms = {rooms}
        params={params.id}
        classes = {classRes.data}
    />
}
  
export default AddClassPage;
  
  
