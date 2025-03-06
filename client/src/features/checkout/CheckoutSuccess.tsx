import {
    Box,
    Button,
    Container,
    Divider,
    Paper,
    Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Order } from "../../app/models/order";
import {
    currencyFormat,
    formatAddressString,
    formatPaymentString,
} from "../../lib/util";

export default function CheckoutSuccess() {
    const { state } = useLocation(); // lấy state được request mang theo
    const order = state.data as Order;

    if (!order) return <Typography>Không thể truy cập đơn hàng</Typography>;

    return (
        <Container maxWidth="md">
            <>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Cảm ơn bạn đã đặt hàng
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Đơn hàng của bạn <strong>#{order.id}</strong> đã được đặt
                    thành công
                </Typography>

                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        md: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">
                            Thời gian
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {order.orderDate}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">
                            Phương thức thanh toán
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {formatPaymentString(order.paymentSummary)}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">
                            Địa chỉ giao hàng
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {formatAddressString(order.shippingAddress)}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">
                            Tổng tiền
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {currencyFormat(order.total)}
                        </Typography>
                    </Box>
                </Paper>

                <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/orders/${order.id}`}
                    >
                        Thông tin đơn hàng
                    </Button>
                    <Button
                        component={Link}
                        to={`/catalog`}
                        variant="outlined"
                        color="primary"
                    >
                        Tiếp tục mua sắm
                    </Button>
                </Box>
            </>
        </Container>
    );
}
