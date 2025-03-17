'use client'
import { Box, Button, Card, CardContent, Container, Grid, IconButton, Modal, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useSession } from "next-auth/react";
import avatar from '../../../../images/avatar.png';
import edit from '../../../../images/edit.png';
import { sendRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface ILecturer {
    lecturer_id: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    title: string;
    address: string;
}

const InformationPage = () => {
    const { data: session, status } = useSession();
    const [lecturer, setLecturer] = useState<ILecturer | null>(null);

    const [open, setOpen] = useState(false);
    const [editedData, setEditedData] = useState<Partial<ILecturer>>({});
    
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
                    setEditedData(response.data); // Gán dữ liệu ban đầu vào form
                } catch (error) {
                    console.error("Lỗi khi tải thông tin giảng viên:", error);
                }
            }
        };

        fetchLecturerInfo();
    }, [session]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await sendRequest({
                url: `http://localhost:8080/api/v1/lecturers/update`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                body: JSON.stringify(editedData),
            });
            setLecturer(editedData as ILecturer); // Cập nhật UI
            handleClose();
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
        }
    };

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
                                        onClick={handleOpen}
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
                                <Stack mt={4} direction={'row'} justifyContent={'space-around'}>
                                    <Box>
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
                                    <Box>
                                        <Typography color="text.secondary" mb={2}>
                                            <b>Địa chỉ:</b> {lecturer?.address ?? "Chưa có"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
        {/* Modal cập nhật thông tin */}
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2
            }}>
                <Typography id="modal-title" variant="h6" mb={2}>Cập nhật thông tin</Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Họ và tên"
                        name="full_name"
                        fullWidth
                        value={editedData.full_name ?? ""}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Ngày sinh"
                        name="date_of_birth"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editedData.date_of_birth ?? ""}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Địa chỉ"
                        name="address"
                        fullWidth
                        value={editedData.address ?? ""}
                        onChange={handleChange}
                    />
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </Stack>
            </Box>
        </Modal>
    </Box>
    );
}

export default InformationPage;