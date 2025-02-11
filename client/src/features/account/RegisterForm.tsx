import { useForm } from "react-hook-form";
import { useRegisterMutation } from "./accountApi";
import {
    registerSchema,
    RegisterSchema,
} from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutlined } from "@mui/icons-material";
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function RegisterForm() {
    const [registerUser] = useRegisterMutation();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid, isLoading },
    } = useForm<RegisterSchema>({
        mode: "onTouched",
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterSchema) => {
        try {
            await registerUser(data).unwrap(); // thêm unwrap để hỗ trợ ném lỗi
        } catch (error) {
            const apiError = error as { message: string }; // khai báo kiểu
            if (apiError.message && typeof apiError.message === "string") {
                const errorArray = apiError.message.split(","); // tách chuỗi thành string[]

                errorArray.forEach((e) => {
                    if (e.includes("Password")) {
                        setError("password", { message: e });
                    } else if (e.includes("Email")) {
                        setError("email", { message: e });
                    }
                });
            }
        }
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
                <Typography variant="h5">Đăng ký</Typography>
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
                        disabled={isLoading || !isValid}
                        variant="contained"
                        type="submit"
                    >
                        Đăng ký
                    </Button>

                    <Typography sx={{ textAlign: "center" }}>
                        Bạn đã có tài khoản?
                        <Typography
                            sx={{ ml: 2 }}
                            component={Link}
                            to="/login"
                            color="primary"
                        >
                            Đăng nhập
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
