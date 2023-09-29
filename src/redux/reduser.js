import { GLOBAL_MAP_INSTANS, ONLOUDED_MAP } from "./types";

const initialState = {
  globalMapInstans: null,
  onloudedMap: false,
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

    default:
      return state;
  }
};

export default reducer;
