import { z } from "zod"; // thư viện xác thực validation dữ liệu

const passwordValidation = new RegExp(
    /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/
); // định nghĩa kiểu kiểm tra mật khẩu

export const registerSchema = z.object({
    email: z.string().nonempty({ message: "Vui lòng nhập email" }).email(),
    password: z
        .string()
        .nonempty({ message: "Vui lòng nhập mật khẩu" })
        .regex(passwordValidation, {
            message:
                "Mật khẩu phải bao gồm 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt và tối thiểu 8 ký tự",
        }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
