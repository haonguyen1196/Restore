import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import {
    AppBar,
    Badge,
    Box,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    Toolbar,
    Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { useFetchBasketQuery } from "../../features/basket/basketApi";

const midLinks = [
    { title: "sản phẩm", path: "/catalog" },
    { title: "về chúng tôi", path: "/about" },
    { title: "liên hệ", path: "/contact" },
];

const rightLinks = [
    { title: "đăng nhập", path: "/login" },
    { title: "đăng ký", path: "/register" },
];

const navStyles = {
    color: "inherit",
    typography: "h6",
    textDecoration: "none",
    whiteSpace: "nowrap",
    "&:hover": {
        color: "grey.500",
    },
    "&.active": {
        color: "#baecf9",
    },
};

export default function Navbar() {
    const { isLoading, darkMode } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const { data: basket } = useFetchBasketQuery();

    const itemCount =
        basket?.items.reduce((sum, item) => (sum += item.quantity), 0) || 0;

    return (
        <AppBar position="fixed">
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        component={NavLink}
                        to={""}
                        variant="h6"
                        sx={navStyles}
                    >
                        STORE
                    </Typography>
                    <IconButton
                        onClick={() => dispatch(setDarkMode())}
                        sx={{ marginLeft: 2 }}
                    >
                        {darkMode ? (
                            <LightMode sx={{ color: "yellow" }} />
                        ) : (
                            <DarkMode />
                        )}
                    </IconButton>
                </Box>

                <List sx={{ display: "flex", paddingLeft: "56px" }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: "flex" }}>
                    <IconButton
                        component={Link}
                        to="/basket"
                        size="large"
                        sx={{ color: "inherit" }}
                    >
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{ display: "flex" }}>
                        {rightLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>
            {isLoading && (
                <Box>
                    <LinearProgress color="secondary" />
                </Box>
            )}
        </AppBar>
    );
}
