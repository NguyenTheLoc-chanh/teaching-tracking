'use client'
import { Box, Button, Card, CardContent, Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useSession } from "next-auth/react";
import avatar from '../../../../images/avatar.png';
import edit from '../../../../images/edit.png';
import { sendRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface ILecturer {
    lecturer_id: string;
    date_of_birth: string;
    gender: string;
    title: string;
}

const InformationPage = () => {
    const { data: session, status } = useSession();
    const [lecturer, setLecturer] = useState<ILecturer | null>(null);
    
    useEffect(() => {
        const fetchLecturerInfo = async () => {
            if (session?.user?.access_token) {
                try {
                    const response = await sendRequest<{ statusCode: number; data: ILecturer }>({
                        url: `http://localhost:8080/api/v1/lecturers/infolecturer`,
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${session?.user?.access_token}`,
                        },
                    });
                    setLecturer(response.data);
                } catch (error) {
                    console.error("Lỗi khi tải thông tin giảng viên:", error);
                }
            }
        };

        fetchLecturerInfo();
    }, [session]);
    return (
    <Box sx={{ bgcolor: "#f5f5f5", py: 4 }}>
        <Container maxWidth="md">
            {/* Tiêu đề */}
            <Typography variant="h4" fontWeight="500" gutterBottom textAlign="center">
                SƠ YẾU LÝ LỊCH
            </Typography>

            <Grid container spacing={3}>
                {/* Thẻ trái - Chứa các nút chức năng */}
                <Grid item xs={4}>
                    <Card sx={{ p: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Stack spacing={2}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Thông tin cá nhân
                                </Button>
                                <Button variant="outlined" color="primary" fullWidth>
                                    Thông tin liên lạc
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Thẻ phải - Chứa thông tin và ảnh đại diện */}
                <Grid item xs={8}>
                    <Card sx={{ p: 3, boxShadow: 3, position:'relative' }}>
                        <CardContent>
                            <Stack direction="column" spacing={3} >
                                {/* Ảnh đại diện có icon chỉnh sửa */}
                                <Box textAlign={'center'}>
                                    <Image
                                        src={avatar}
                                        alt="Avatar"
                                        width={80}
                                        height={80}
                                        style={{ borderRadius: "50%" }}
                                    />
                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            top: 20,
                                            right: 10,
                                            boxShadow: 2,
                                            "&:hover": { bgcolor: "lightgray" }
                                        }}
                                        size="small"
                                    >
                                        <Image
                                        src={edit}
                                        alt="Avatar"
                                        width={30}
                                        height={30}
                                        />
                                    </IconButton>
                                </Box>

                                {/* Thông tin cá nhân */}
                                <Box>
                                <Typography textAlign="center" variant="h6" fontWeight="600">
                                    {session?.user?.lecturer?.full_name ?? "Chưa có tên"}
                                </Typography>
                                <Typography textAlign="center" color="text.secondary">
                                    {session?.user?.name ?? "Không có thông tin"}
                                </Typography>
                                <Box mt={4}>
                                    <Typography color="text.secondary" mb={2}>
                                        <b>Chức vụ:</b> {lecturer?.title ?? "Chưa có"}
                                    </Typography>
                                    <Typography color="text.secondary" mb={2}>
                                        <b>Giới tính:</b> {lecturer?.gender === "Male" ? "Nam" : lecturer?.gender === "Female" ? "Nữ" : "Chưa cập nhật"}
                                    </Typography>
                                    <Typography color="text.secondary" mb={2}>
                                        <b>Ngày sinh:</b> {lecturer?.date_of_birth ? 
                                        dayjs(lecturer.date_of_birth).format("DD/MM/YYYY") 
                                        : "Chưa cập nhật"}
                                    </Typography>
                                </Box>
                            </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    </Box>
    );
}

export default InformationPage;