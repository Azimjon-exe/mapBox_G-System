import { dispatch } from "./store";
import { GLOBAL_MAP_INSTANS, ONLOUDED_MAP, POPUP_HOVER_INSTANS, POPUP_INSTANS} from "./types";

export const GlobalMapInstans = (mapInstans) => {
    dispatch({type: GLOBAL_MAP_INSTANS, payload: mapInstans});
}
export const PopupInstans = (popupInstans) => {
    dispatch({type: POPUP_INSTANS, payload: popupInstans});
}
export const PopupHoverInstans = (popupHoverInstans) => {
    dispatch({type: POPUP_HOVER_INSTANS, payload: popupHoverInstans});
}
export const OloudedMap = (onloudedMap) => {
    dispatch({type: ONLOUDED_MAP, payload: onloudedMap});
}

