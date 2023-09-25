import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import MapPage from "../map/map";
import { Outlet, useNavigate } from "react-router-dom";

function DrawerAppBar() {
    const globalMapInstans = useSelector((state) => state.globalMapInstans)
  const navItems = useSelector((state) => state.navItems);
  let navigate = useNavigate();
  const layerId = 'clusters';
    const layerId1 = 'cluster_icon';
    const layerId2 = 'cluster_label';
    
    if (
      globalMapInstans &&
      globalMapInstans.getLayer(layerId)&&
      globalMapInstans.getLayer(layerId1)&&
      globalMapInstans.getLayer(layerId2)
    ) {
      globalMapInstans.removeLayer(layerId);
      globalMapInstans.removeLayer(layerId1);
      globalMapInstans.removeLayer(layerId2);
    }
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "none",
        }}
      >
        <Toolbar
          className="toolbar"
          sx={{
            borderRadius: "20px",
            mt: 1,
            width: "90%",
            boxShadow: 5,
            boxShadow: "0px 0px 20px 8px rgba(2, 71, 254, 0.5) inset",
          }}
        >
          <Typography
            onClick={() => navigate("/")}
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
          >
            Qalqon 3D MAP
          </Typography>
          <Box>
            {navItems.map((item, index) => (
              <Button
                key={item.id}
                onClick={() => navigate(item.to)}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "1rem",
                  mr: index + 1 === navItems.length ? 0 : 5,
                }}
              >
                {item.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component={"main"}
        sx={{
          width: "100%",
          height: "100vh",
          position: "relative",
        }}
      >
        <Outlet />
        <Box
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100vh",
          }}
        >
          <MapPage />
        </Box>
      </Box>
    </Box>
  );
}

export default DrawerAppBar;
