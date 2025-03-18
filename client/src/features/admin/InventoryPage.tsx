import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { useFetchProductsQuery } from "../catalog/catalogApi";
import { currencyFormat } from "../../lib/util";
import { Delete, Edit } from "@mui/icons-material";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "../catalog/catalogSlice";
import { useState } from "react";
import ProductForm from "./ProductForm";
import { Product } from "../../app/models/product";
import { useDeleteProductMutation } from "./adminApi";

export default function InventoryPage() {
    const productParams = useAppSelector((state) => state.catalog);
    const { data, refetch } = useFetchProductsQuery(productParams);
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [deleteProduct] = useDeleteProductMutation();

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setEditMode(true);
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id);
            refetch();
        } catch (error) {
            console.log(error);
        }
    };

    if (editMode)
        return (
            <ProductForm
                setEditMode={setEditMode}
                product={selectedProduct}
                refetch={refetch}
                setSelectedProduct={setSelectedProduct}
            />
        );

    return (
        <>
            <Box display="flex" justifyContent="space-between">
                <Typography sx={{ p: 2 }} variant="h4">
                    Kho hàng
                </Typography>
                <Button
                    onClick={() => setEditMode(true)}
                    size="large"
                    variant="contained"
                    sx={{ m: 2 }}
                >
                    Tạo
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Sản phẩm</TableCell>
                            <TableCell align="right">Giá</TableCell>
                            <TableCell align="center">Kiểu</TableCell>
                            <TableCell align="center">Thương hiệu</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data &&
                            data.items.map((product) => (
                                <TableRow
                                    key={product.id}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {product.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Box display="flex" alignItems="center">
                                            <img
                                                src={product.pictureUrl}
                                                alt={product.name}
                                                style={{
                                                    height: 50,
                                                    marginRight: 20,
                                                }}
                                            />
                                            <span>{product.name}</span>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        {currencyFormat(product.price)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {product.type}
                                    </TableCell>
                                    <TableCell align="center">
                                        {product.brand}
                                    </TableCell>
                                    <TableCell align="center">
                                        {product.quantityInStock}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            onClick={() =>
                                                handleSelectProduct(product)
                                            }
                                            startIcon={<Edit />}
                                        ></Button>
                                        <Button
                                            onClick={() =>
                                                handleDeleteProduct(product.id)
                                            }
                                            startIcon={<Delete />}
                                            color="error"
                                        ></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <Box sx={{ m: 1 }}>
                    {data?.pagination && data.items.length > 0 && (
                        <AppPagination
                            metadata={data.pagination}
                            onPageChange={(page: number) =>
                                dispatch(setPageNumber(page))
                            }
                        />
                    )}
                </Box>
            </TableContainer>
        </>
    );
}
