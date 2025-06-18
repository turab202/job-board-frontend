import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Jobs", to: "/jobs" },
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" },
    { label: "Candidate", to: "/candidate-dashboard" },
    { label: "Employer", to: "/employer-dashboard" },
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
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMenu}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  component={Link}
                  to={item.to}
                  onClick={handleClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={Link}
                to={item.to}
              >
                {item.label}
              </Button>
            ))}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

