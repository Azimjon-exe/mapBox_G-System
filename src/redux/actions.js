import { dispatch } from "./store";
import { GLOBAL_MAP_INSTANS, ONLOUDED_MAP, ON_LOUDED_MAP, ROUTE_BOOL, ROUTE_ID, ROUTE_STR, SOURS_ID} from "./types";

export const GlobalMapInstans = (mapInstans) => {
    dispatch({type: GLOBAL_MAP_INSTANS, payload: mapInstans});
}

export const OloudedMap = (onloudedMap) => {
    dispatch({type: ONLOUDED_MAP, payload: onloudedMap});
}

export const LoadedMap = (on) => {
    dispatch({type: ON_LOUDED_MAP, payload: on});
}