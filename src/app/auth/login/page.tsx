'use client'
import { Box, Button, Container, Stack, TextField, Typography, Link as MuiLink, FormControl, Snackbar, Alert } from "@mui/material";
import logoHou from '../../../../images/hou-logo.png';
import banner from '../../../../images/anh20vien20chuan.jpg';
import Image from 'next/image';
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { authenticate } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSession } from "next-auth/react";

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState(""); // Trạng thái thông báo lỗi
    const [loginError, setLoginError] = useState("");
    const [open, setOpen] = useState(false); // Trạng thái mở/đóng Snackbar
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: any) => {
        const {username, password} = data;
        // Trigger sign-in
        // const dataLog = await signIn("credentials", {username, password, redirect: false});
        const res = await authenticate(username, password);
        if(res?.error){
            setLoginError(res.error);
            if (res.error === "Tên đăng nhập không tồn tại!") {
                reset({ username: '', password }); // Giữ lại mật khẩu
            } else {
                reset({ username, password: '' }); 
            }
            //Error
            setErrorMessage(res.error);
            setOpen(true);
        }else {
            // Lấy session để kiểm tra role
            const session = await getSession();
            const role = session?.user?.role;
        
            if (role === "Admin") {
              router.push("/admin/dashboard"); // Điều hướng Admin
            } else if (role === "Lecturer") {
              router.push("/client/dashboard"); // Điều hướng Client
            } else {
              router.push("/unauthorized"); // Điều hướng tới trang không đủ quyền
            }
          }
    };
    const handleClose = (event: React.SyntheticEvent | Event) => {
        setOpen(false); // Đóng Snackbar
    };                
    return (
        <Box component={'section'}>
            <Container>
                <Stack direction={{ xs: 'column', md: 'row'}} spacing={6} justifyContent={'space-between'}>
                    <Box>
                        <Box textAlign={'center'} mt={{xs: 4 ,md: 6}} pb={{xs: 5,md:10}}>
                            <Image src={logoHou} layout='intrinsic' alt='logoHou'
                            width={82} 
                            height={100} 
                            style={{ objectFit: 'contain' , width: 82}}
                            />
                            <Typography component={'h2'} variant='h4' 
                            fontWeight={'bold'} 
                            textAlign={'center'} 
                            color="secondary.contrastText"
                            mt={{xs: 2,md: 4}}
                            >Trường Đại Học Mở Hà Nội</Typography>
                        </Box>
                        <Box>
                            {/* <FormControl style={{
                                    maxWidth: '100%', // Đảm bảo chiều rộng không vượt quá kích thước khung cha
                                }}
                                sx={{
                                    width: '100%', // Mặc định trên điện thoại
                                    maxWidth: '613px', // Chỉ áp dụng trên màn hình lớn
                                    mx: 'auto', // Căn giữa trên cả hai màn hình
                                }}>
                                <Typography component={'label'} fontWeight={'bold'} color="primary">Tên đăng nhập</Typography>
                                <TextField
                                label="Nhập mã giảng viên"
                                fullWidth
                                margin="normal"
                                sx={{mb: 4}}
                                />
                                <Typography component={'label'} fontWeight={'bold'} color="primary">Mật khẩu</Typography>
                                <TextField
                                label="Mật khẩu"
                                type="password"
                                fullWidth
                                margin="normal"
                                sx={{mb: 4}}
                                />
                                <Link href={'/blog'} style={{display: 'flex', justifyContent: 'flex-end', textDecoration: 'none'}}>
                                    <Typography component="span">
                                        Quên mật khẩu?
                                    </Typography>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                Đăng nhập
                                </Button>
                            </FormControl> */}
                            <Box component={'form'} onSubmit={handleSubmit(onSubmit)}
                                style={{
                                    maxWidth: '100%', // Đảm bảo chiều rộng không vượt quá kích thước khung cha
                                }}
                                sx={{
                                    width: '100%', // Mặc định trên điện thoại
                                    maxWidth: '613px', // Chỉ áp dụng trên màn hình lớn
                                    mx: 'auto', // Căn giữa trên cả hai màn hình
                                }}
                                >
                                <Typography component={'label'} fontWeight={'bold'} color="primary">Tên đăng nhập</Typography>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: 'Tên đăng nhập không được để trống' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nhập mã giảng viên"
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.username}
                                            helperText={errors.username?.message}
                                            sx={{mb: 4}}
                                        />
                                    )}
                                />
                                <Typography component={'label'} fontWeight={'bold'} color="primary">Mật khẩu</Typography>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: 'Mật khẩu không được để trống' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Mật khẩu"
                                            type="password"
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            sx={{mb: 4}}
                                        />
                                    )}
                                />
                                <Link
                                    href={'/blog'}
                                    style={{ display: 'flex', justifyContent: 'flex-end', textDecoration: 'none' }}
                                >
                                    <Typography component="span" color="primary" 
                                        sx={{
                                            transition: 'color 0.3s ease', // Hiệu ứng chuyển đổi mượt
                                            ':hover': {
                                                color: '#043af5', // Màu khi hover
                                            },
                                        }}>Quên mật khẩu?</Typography>
                                </Link>
                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                    Đăng nhập
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{ 
                            xs:{
                                width: '100%',
                                objectFit:'contain'
                            },
                            md: {
                                width: '100%',
                                height: '100vh',
                                objectFit:'contain'
                            }
                          }}>
                        <Image src={banner} alt='avatar'
                            height={0} 
                            style={{ 
                                height: '100vh', 
                                width: '100%', 
                                objectFit: 'contain' 
                            }} />
                    </Box>
                </Stack>
            </Container>
            <Box data-testid="login-error" style={{ display: 'none' }}>
                {loginError}
            </Box>
            {/* Snackbar hiển thị thông báo lỗi */}
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} data-testid="error-snackbar">
                <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }} data-testid="error-alert">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default LoginPage;