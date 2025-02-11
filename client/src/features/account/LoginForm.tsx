import { LockOutlined } from "@mui/icons-material";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyUserInfoQuery, useLoginMutation } from "./accountApi";

export default function LoginForm() {
    const [login, { isLoading }] = useLoginMutation();
    const [fetchUserInfo] = useLazyUserInfoQuery();
    const location = useLocation();
    const {
        register, // liên kết với các input trong form
        handleSubmit, // xử lý sự kiện submit form
        formState: { errors }, // chứa thông tin lỗi của từng field
    } = useForm<loginSchema>({
        mode: "onTouched",
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: loginSchema) => {
        await login(data);
        await fetchUserInfo();
        navigate(location.state?.from || "/catalog");
    };
    return (
        <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginTop="8"
            >
                <LockOutlined
                    sx={{ mt: 3, color: "secondary.main", fontSize: 40 }}
                />
                <Typography variant="h5">Đăng nhập</Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    marginY={3}
                >
                    <TextField
                        fullWidth
                        label="Email"
                        autoFocus
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        type="password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button
                        disabled={isLoading}
                        variant="contained"
                        type="submit"
                    >
                        Đăng nhập
                    </Button>

                    <Typography sx={{ textAlign: "center" }}>
                        Chưa có tài khoản?
                        <Typography
                            sx={{ ml: 2 }}
                            component={Link}
                            to="/register"
                            color="primary"
                        >
                            Đăng ký
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
