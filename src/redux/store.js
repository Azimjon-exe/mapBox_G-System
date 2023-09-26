import { createStore } from "redux";
import reducer from "./reduser";

const store = createStore(reducer);

const dispatch = store.dispatch;
export { dispatch };

export default store;
