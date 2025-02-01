import { useParams } from "react-router-dom";
import {
    Button,
    Divider,
    Grid2,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useFetchProductDetailQuery } from "./catalogApi";
import {
    useAddBasketItemMutation,
    useFetchBasketQuery,
    useRemoveBasketItemMutation,
} from "../basket/basketApi";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductDetails() {
    const { id } = useParams();
    const [removeBasketItem] = useRemoveBasketItemMutation();
    const [addBasketItem] = useAddBasketItemMutation();
    const { data: basket } = useFetchBasketQuery();
    const [quantity, setQuantity] = useState(0);

    const item = basket?.items.find((x) => x.productId === +id!);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
    }, [item]);

    const { data: product, isLoading } = useFetchProductDetailQuery(
        id ? +id : 0
    );

    if (isLoading || !product) return <div>Đang tải...</div>;

    const handleUpdateBasket = () => {
        const updateQuantity = item
            ? Math.abs(quantity - item.quantity)
            : quantity;
        if (!item || quantity > item.quantity) {
            addBasketItem({ product, quantity: updateQuantity });
        } else {
            removeBasketItem({
                productId: product.id,
                quantity: updateQuantity,
            });
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.currentTarget.value;

        if (value >= 0) setQuantity(value);
    };

    const productDetails = [
        { label: "Tên sản phẩm", value: product.name },
        { label: "Mô tả", value: product.description },
        { label: "Loại", value: product.type },
        { label: "Nhãn hàng", value: product.brand },
        { label: "Số lượng trong kho", value: product.quantityInStock },
    ];

    return (
        <Grid2 container spacing={6} maxWidth={"lg"} mx={"auto"}>
            <Grid2 size={6}>
                <img
                    src={product.pictureUrl}
                    alt={product.name}
                    style={{ width: "100%" }}
                />
            </Grid2>
            <Grid2 size={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h4" color="secondary">
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <TableContainer>
                    <Table sx={{ "& td": { fontSize: "1rem" } }}>
                        <TableBody>
                            {productDetails.map((detail, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        {detail.label}
                                    </TableCell>
                                    <TableCell>{detail.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid2 container spacing={2} marginTop={3}>
                    <Grid2 size={6}>
                        <TextField
                            type="number"
                            variant="outlined"
                            fullWidth
                            label="Số lượng thêm vào giỏ hàng"
                            value={quantity}
                            onChange={handleInputChange}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <Button
                            onClick={handleUpdateBasket}
                            disabled={
                                item?.quantity === quantity ||
                                (!item && quantity === 0)
                            }
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            sx={{ height: "55px" }}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    );
}
