import { dispatch } from "./store";
import { GLOBAL_MAP_INSTANS, ONLOUDED_MAP} from "./types";

export const GlobalMapInstans = (mapInstans) => {
    dispatch({type: GLOBAL_MAP_INSTANS, payload: mapInstans});
}

export const OloudedMap = (onloudedMap) => {
    dispatch({type: ONLOUDED_MAP, payload: onloudedMap});
}

