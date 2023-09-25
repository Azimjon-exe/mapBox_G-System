import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import DrawerAppBar from "./pages/dashboard";
import { CssBaseline } from "@mui/material";
import GayiXodimlari from "./pages/gayi-xodimlari";
import Kameralar from "./pages/cameralar";
import Dorixonalar from "./pages/dorixonalar";
import Xonadonlar from "./pages/xonadonlar";

const routes = [
  {
    id: 1,
    path: "cameralar",
    element: <Kameralar />,
  },
  {
    id: 2,
    path: "gayi_xodimlari",
    element: <GayiXodimlari />,
  },
  {
    id: 3,
    path: "dorixonalar",
    element: <Dorixonalar />,
  },
  {
    id: 4,
    path: "xonadonlar",
    element: <Xonadonlar />,
  },
];

function App() {
  return (
    <Provider store={store}>
      <Router>
      <CssBaseline />
        <Routes>
          <Route path="/" element={<DrawerAppBar />}>
            {routes.map((item) => (
              <Route key={item.id} path={item.path} element={item.element} />
            ))} 
          </Route>
        </Routes>
    </Router>
    </Provider>
  );
}

export default App;
