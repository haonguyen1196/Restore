import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import {
    AppBar,
    Badge,
    Box,
    IconButton,
    List,
    ListItem,
    Toolbar,
    Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

type Props = {
    toggleDarkMode: () => void;
    darkMode: boolean;
};

const midLinks = [
    { title: "catalog", path: "/catalog" },
    { title: "about", path: "/about" },
    { title: "contact", path: "/contact" },
];

const rightLinks = [
    { title: "login", path: "/login" },
    { title: "register", path: "/register" },
];

const navStyles = {
    color: "inherit",
    typography: "h6",
    textDecoration: "none",
    "&:hover": {
        color: "grey.500",
    },
    "&.active": {
        color: "#baecf9",
    },
};

export default function Navbar({ toggleDarkMode, darkMode }: Props) {
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
                        RE-STORE
                    </Typography>
                    <IconButton onClick={toggleDarkMode} sx={{ marginLeft: 2 }}>
                        {darkMode ? (
                            <LightMode sx={{ color: "yellow" }} />
                        ) : (
                            <DarkMode />
                        )}
                    </IconButton>
                </Box>

                <List sx={{ display: "flex" }}>
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
                    <IconButton size="large" sx={{ color: "inherit" }}>
                        <Badge badgeContent="4" color="secondary">
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
        </AppBar>
    );
}
