import { Link, useParams } from "react-router-dom";
import { useFetchOrderDetailedQuery } from "./orderApi";
import {
    Box,
    Button,
    Card,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import { format } from "date-fns";
import {
    currencyFormat,
    formatAddressString,
    formatPaymentString,
} from "../../lib/util";

export default function OrderDetailedPage() {
    const { id } = useParams();

    const { data: order, isLoading } = useFetchOrderDetailedQuery(+id!);

    if (isLoading)
        return <Typography variant="h5">Đang tải đơn hàng...</Typography>;
    if (!order)
        return <Typography variant="h5">Không tìm thấy đơn hàng</Typography>;

    return (
        <Card sx={{ p: 2, maxWidth: "md", mx: "auto" }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h5" align="center">
                    Đơn hàng #{order.id}
                </Typography>
                <Button component={Link} to="/orders" variant="outlined">
                    Quay lại trang đơn hàng
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box>
                <Typography variant="h6" fontWeight="bold">
                    Thông tin thanh toán và giao hàng
                </Typography>
                <Box component="dl">
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Địa chỉ giao hàng
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {formatAddressString(order.shippingAddress)}
                    </Typography>
                </Box>
                <Box component="dl">
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Thông tin thanh toán
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {formatPaymentString(order.paymentSummary)}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
                <Typography variant="h6" fontWeight="bold">
                    Chi tiết đơn hàng
                </Typography>

                <Box component="dl">
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Địa chỉ eamil
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {order.buyerEmail}
                    </Typography>
                </Box>
                <Box component="dl">
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Trạng thái đơn hàng
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {order.orderStatus}
                    </Typography>
                </Box>
                <Box component="dl">
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Thời gian
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {format(order.orderDate, "dd MMM yyyy")}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TableContainer>
                <Table>
                    <TableBody>
                        {order?.orderItems.map((item) => (
                            <TableRow
                                key={item.productId}
                                sx={{
                                    borderBottom:
                                        "1px solid rgba(224, 224, 224, 1)",
                                }}
                            >
                                <TableCell sx={{ py: 4 }}>
                                    <Box
                                        display="flex"
                                        gap={3}
                                        alignItems="center"
                                    >
                                        <img
                                            src={item.pictureUrl}
                                            alt={item.name}
                                            style={{
                                                width: 40,
                                                height: 40,
                                            }}
                                        />
                                        <Typography>{item.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ p: 4 }}>
                                    x {item.quantity}
                                </TableCell>
                                <TableCell align="right" sx={{ p: 4 }}>
                                    {currencyFormat(item.price * item.quantity)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mx={3}>
                <Box
                    component="dl"
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Tổng
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {currencyFormat(order.subtotal)}
                    </Typography>
                </Box>
                <Box
                    component="dl"
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Giảm
                    </Typography>
                    <Typography
                        component="dd"
                        variant="body2"
                        fontWeight="300"
                        color="green"
                    >
                        {currencyFormat(order.discount)}
                    </Typography>
                </Box>
                <Box
                    component="dl"
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Phí vận chuyển
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {currencyFormat(order.deliveryFee)}
                    </Typography>
                </Box>
                <Box
                    component="dl"
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography
                        component="dt"
                        variant="subtitle1"
                        fontWeight="500"
                    >
                        Tổng cộng
                    </Typography>
                    <Typography component="dd" variant="body2" fontWeight="300">
                        {currencyFormat(order.total)}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}
