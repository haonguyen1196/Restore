// import { zodResolver } from "@hookform/resolvers/zod";
import {
    createProductSchema,
    CreateProductSchema,
} from "../../lib/schemas/createProductSchema";
import { FieldValues, useForm } from "react-hook-form";
import { Box, Button, Grid2, Paper, Typography } from "@mui/material";
import AppTextInput from "../../app/shared/components/AppTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchFilterQuery } from "../catalog/catalogApi";
import AppSelectInput from "../../app/shared/components/AppSelectInput";
import AppDropzone from "../../app/shared/components/AppDropzone";
import { Product } from "../../app/models/product";
import { useEffect } from "react";
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi";
import { handleApiError } from "../../lib/util";

type Props = {
    setEditMode: (value: boolean) => void;
    product: Product | null;
    refetch: () => void;
    setSelectedProduct: (value: Product | null) => void;
};

export default function ProductForm({
    setEditMode,
    product,
    refetch,
    setSelectedProduct,
}: Props) {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { isSubmitting },
    } = useForm<CreateProductSchema>({
        mode: "onTouched",
        resolver: zodResolver(createProductSchema),
    }); // useForm hook quản lý form, <CreateProductSchema> giúp typescript hiểu được kiểu dữ liệu của form
    //  onTouched kiểm tra lỗi người dùng khi chạm vào input và rời đi
    // zodResolver kết nối zod vs react hook form kiểm tra dữ liệu trong form và hiển thị lỗi
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const watchFile = watch("file");
    const { data } = useFetchFilterQuery();

    useEffect(() => {
        if (product) reset(product);

        return () => {
            if (watchFile) URL.revokeObjectURL(watchFile.preview); //cleanup đường dẫn tạm thời của anh khi chọn ảnh khác
        };
    }, [product, reset, watchFile]); // nếu có truyền product vào component thì là edit mode và điền dữ liệu vào form bằng hàm reset

    const createFormData = (items: FieldValues) => {
        const formData = new FormData(); // chuyển formdata để hỗ trợ form gửi file
        for (const key in items) {
            formData.append(key, items[key]);
        }

        return formData;
    };

    const onSubmit = async (data: CreateProductSchema) => {
        try {
            const formData = createFormData(data);

            if (watchFile) formData.append("file", watchFile);

            if (product)
                await updateProduct({
                    id: product.id,
                    data: formData,
                }).unwrap();
            // dùng unwrap để ném lỗi về catch khi request thất bại
            else await createProduct(formData).unwrap();
            setEditMode(false); // quay lại list product
            setSelectedProduct(null); // set lại giá trị fiel là null
            refetch(); // refetch lại new list product
        } catch (error) {
            console.log(error);
            handleApiError<CreateProductSchema>(error, setError, [
                "brand",
                "description",
                "file",
                "name",
                "pictureUrl",
                "price",
                "quantityInStock",
                "type",
            ]);
        }
    };

    return (
        <Box component={Paper} sx={{ p: 4, maxWidth: "large", mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Chi tiết sản phẩm
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid2 container spacing={3}>
                    <Grid2 size={12}>
                        <AppTextInput
                            control={control}
                            name="name"
                            label="Tên sản phẩm"
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        {data?.brands && (
                            <AppSelectInput
                                items={data.brands}
                                control={control}
                                name="brand"
                                label="Thương hiệu"
                            />
                        )}
                    </Grid2>
                    <Grid2 size={6}>
                        {data?.types && (
                            <AppSelectInput
                                items={data.types}
                                control={control}
                                name="type"
                                label="Loại"
                            />
                        )}
                    </Grid2>
                    <Grid2 size={6}>
                        <AppTextInput
                            control={control}
                            type="number"
                            name="price"
                            label="Giá"
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <AppTextInput
                            control={control}
                            type="number"
                            name="quantityInStock"
                            label="Số lượng trong kho"
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <AppTextInput
                            control={control}
                            multiline
                            rows={4}
                            name="description"
                            label="Mô tả"
                        />
                    </Grid2>
                    <Grid2
                        size={12}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <AppDropzone name="file" control={control} />
                        {watchFile ? (
                            <img
                                src={watchFile.preview}
                                alt="xem trước ảnh"
                                style={{ maxHeight: 200 }}
                            />
                        ) : product?.pictureUrl ? (
                            <img
                                src={product?.pictureUrl}
                                alt="xem trước ảnh"
                                style={{ maxHeight: 200 }}
                            />
                        ) : null}
                    </Grid2>
                </Grid2>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mt: 3 }}
                >
                    <Button
                        onClick={() => setEditMode(false)}
                        variant="contained"
                        color="inherit"
                    >
                        Hủy
                    </Button>
                    <Button
                        loading={isSubmitting}
                        variant="contained"
                        color="success"
                        type="submit"
                    >
                        Gửi
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
