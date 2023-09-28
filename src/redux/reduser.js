import {
  GLOBAL_MAP_INSTANS,
  ONLOUDED_MAP,
  ON_LOUDED_MAP,
  ROUTE_BOOL,
  ROUTE_ID,
  ROUTE_STR,
} from "./types";

const initialState = {
  globalMapInstans: null,
  onloudedMap: false,
  loadedMap: () => {},
  navItems: [
    {
      id: 1,
      title: "Kameralar",
      to: "/cameralar",
    },
    {
      id: 2,
      title: "Gayi xodimlari",
      to: "/gayi_xodimlari",
    },
    {
      id: 3,
      title: "Dorixonalar",
      to: "/dorixonalar",
    },
    {
      id: 4,
      title: "Xonadonlar",
      to: "/xonadonlar",
    },
    {
      id: 5,
      title: "Unversitetlar",
      to: "/uversitetlar",
    },
  ],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_MAP_INSTANS:
      return { ...state, globalMapInstans: action.payload };
    case ONLOUDED_MAP:
      return { ...state, onloudedMap: action.payload };
    case ON_LOUDED_MAP:
      return { ...state, loadedMap: action.payload };
    default:
      return state;
  }
};

export default reducer;
