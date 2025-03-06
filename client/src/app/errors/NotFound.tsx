import { SearchOff } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <Paper
            sx={{
                height: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 6,
            }}
        >
            <SearchOff sx={{ fontSize: 100 }} color="primary" />
            <Typography gutterBottom variant="h3">
                Oops - Không tìm thấy trang liên quan
            </Typography>
            <Button fullWidth component={Link} to="/catalog">
                Quay lại cửa hàng
            </Button>
        </Paper>
    );
}
