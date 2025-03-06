import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useFetchOrdersQuery } from "./orderApi";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../lib/util";

export default function OrdersPage() {
    const { data: orders } = useFetchOrdersQuery();
    const navigate = useNavigate();

    if (!orders)
        return <Typography variant="h5">Không tìm thấy đơn hàng</Typography>;

    return (
        <Container maxWidth="md">
            <Typography variant="h5" gutterBottom align="center">
                Đơn hàng của bạn
            </Typography>
            <Paper sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Đơn hàng</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Tổng</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow
                                key={order.id}
                                hover
                                onClick={() => navigate(`/orders/${order.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell align="center">
                                    #{order.id}
                                </TableCell>
                                <TableCell>
                                    {format(order.orderDate, "dd MMM yyyy")}
                                </TableCell>
                                <TableCell>
                                    {currencyFormat(order.total)}
                                </TableCell>
                                <TableCell>{order.orderStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}
