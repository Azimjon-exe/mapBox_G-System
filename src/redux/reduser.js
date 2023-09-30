import {
  GLOBAL_MAP_INSTANS,
  ONLOUDED_MAP,
  POPUP_HOVER_INSTANS,
  POPUP_INSTANS,
} from "./types";

const initialState = {
  globalMapInstans: null,
  popupInstans: null,
  popupHoverInstans: null,
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
    case POPUP_INSTANS:
      return { ...state, popupInstans: action.payload };
    case POPUP_HOVER_INSTANS:
      return { ...state, popupHoverInstans: action.payload };
    default:
      return state;
  }
};

export default reducer;
