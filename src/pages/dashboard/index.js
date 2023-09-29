import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import MapPage from "../map/map";
import { Outlet, useNavigate } from "react-router-dom";
// import { RouteBool, RouteStr } from "../../redux/actions";
// import { ROUTE_STR } from "../../redux/types";

function DrawerAppBar() {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  // const onloudedMap = useSelector((state) => state.onloudedMap);
  const navItems = useSelector((state) => state.navItems);

  let navigate = useNavigate();

  const propRemove = () => {
    const sourceId = "earthquakes";
    const layerId = "clusters";
    const layerId1 = "unclustered-point";
    const layerId2 = "cluster-count";
    const imageId = "icon";
    if (globalMapInstans.getSource(sourceId))
      globalMapInstans.removeSource(sourceId);
    if (globalMapInstans.getLayer(layerId))
      globalMapInstans.removeLayer(layerId);
    if (globalMapInstans.getLayer(layerId1))
      globalMapInstans.removeLayer(layerId1);
    if (globalMapInstans.getLayer(layerId2))
      globalMapInstans.removeLayer(layerId2);
    if (globalMapInstans.hasImage(imageId))
      globalMapInstans.removeImage(imageId);
  };

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
            boxShadow: "0px 0px 20px 8px rgba(2, 71, 254, 0.5) inset",
            backdropFilter: "blur(5px)",
          }}
        >
          <Box component="div" sx={{ flexGrow: 1, cursor: "pointer" }}>
            <Typography
              variant="h6"
              component={"span"}
              onClick={() => {
                navigate("/");
                propRemove();
              }}
            >
              Qalqon 3D MAP
            </Typography>
          </Box>
          <Box>
            {navItems.map((item, index) => (
              <Button
                key={item.id}
                onClick={() => {
                  navigate(item.to);
                  // propRemove()
                }}
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
