import { z } from "zod";

//Định nghĩa schema kiểm tra dữ liệu bằng Zod
export const loginSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "Vui lòng nhập email" })
        .email({ message: "Email không hợp lệ" }),
    password: z
        .string()
        .nonempty({ message: "Vui lòng nhập mật khẩu" })
        .min(6, {
            message: "Mật khẩu tối thiểu 6 ký tự",
        }),
});

export type loginSchema = z.infer<typeof loginSchema>; //loginSchema (kiểu dữ liệu) sẽ lấy kiểu từ loginSchema (schema), giúp TypeScript hiểu kiểu dữ liệu hợp lệ.
