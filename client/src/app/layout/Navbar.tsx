import { DarkMode, LightMode } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

type Props = {
    toggleDarkMode: () => void;
    darkMode: boolean;
};

export default function Navbar({ toggleDarkMode, darkMode }: Props) {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6">RE-STORE</Typography>
                <IconButton onClick={toggleDarkMode} sx={{ marginLeft: 2 }}>
                    {darkMode ? (
                        <LightMode sx={{ color: "yellow" }} />
                    ) : (
                        <DarkMode />
                    )}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
