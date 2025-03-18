import { z } from "zod";

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size > 0, {
        message: "Bạn chưa nhập file",
    })
    .transform((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
    })); //instanceof kiểm tra phải là file hay không, refine kiểm tra có dữ liệu hay không

export const createProductSchema = z
    .object({
        name: z.string({ required_error: "Trường tên sản phẩm là bắt buộc" }),
        description: z
            .string({ required_error: "Trường mô tả là bắt buộc" })
            .min(10, {
                message: "Mô tả phải chứa nhiều hơn 10 ký tự",
            }),
        price: z.coerce
            .number({ required_error: "Trường giá là bắt buộc" })
            .min(100, "Giá phải lớn hơn $1.00"),
        type: z.string({ required_error: "Trường kiểu là bắt buộc" }),
        brand: z.string({ required_error: "Trường nhãn hàng là bắt buộc" }),
        quantityInStock: z.coerce
            .number({ required_error: "Trường số lượng là bắt buộc" })
            .min(1, "Số lượng phải lớn hơn 1"),
        pictureUrl: z.string().optional(),
        file: fileSchema.optional(),
    })
    .refine((data) => data.pictureUrl || data.file, {
        message: "Vui lòng cung cấp ảnh",
        path: ["file"],
    });

export type CreateProductSchema = z.infer<typeof createProductSchema>; // làm cho typescript hiểu được cấu trúc và check lỗi interface
