import {
    Button,
    Menu,
    Fade,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import { useState } from "react";
import { User } from "../models/user";
import { History, Inventory, Logout, Person } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";
import { Link } from "react-router-dom";

type Props = {
    user: User;
};

export default function UserMenu({ user }: Props) {
    const [logout] = useLogoutMutation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                color="inherit"
                size="large"
                sx={{ fontSize: "1.1rem" }}
                onClick={handleClick}
            >
                {user.email}
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>Hồ sơ</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="orders">
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    <ListItemText>Đơn hàng</ListItemText>
                </MenuItem>
                {user.roles.includes("Admin") && (
                    <MenuItem component={Link} to="inventory">
                        <ListItemIcon>
                            <Inventory />
                        </ListItemIcon>
                        <ListItemText>Kho hàng</ListItemText>
                    </MenuItem>
                )}

                <Divider />
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>Đăng xuất</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}
