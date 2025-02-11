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
import { History, Logout, Person } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";

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
                <MenuItem>
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    <ListItemText>Đơn hàng</ListItemText>
                </MenuItem>
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
