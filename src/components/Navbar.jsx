import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);

  const menuItems = isPublicPage
    ? [
        { label: "Login", to: "/login" },
        { label: "Register", to: "/register" },
      ]
    : [
        { label: "Jobs", to: "/jobs" },
        { label: "Candidate", to: "/candidate-dashboard" },
        { label: "Employer", to: "/employer-dashboard" },
        { label: "Logout", action: handleLogout },
      ];

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Job Board
          </Button>
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMenu} size="large">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              {menuItems.map((item) =>
                item.action ? (
                  <MenuItem key={item.label} onClick={() => { item.action(); handleClose(); }}>
                    {item.label}
                  </MenuItem>
                ) : (
                  <MenuItem key={item.label} component={Link} to={item.to} onClick={handleClose}>
                    {item.label}
                  </MenuItem>
                )
              )}
            </Menu>
          </>
        ) : (
          <>
            {menuItems.map((item) =>
              item.action ? (
                <Button key={item.label} color="inherit" onClick={item.action}>
                  {item.label}
                </Button>
              ) : (
                <Button key={item.label} color="inherit" component={Link} to={item.to}>
                  {item.label}
                </Button>
              )
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
