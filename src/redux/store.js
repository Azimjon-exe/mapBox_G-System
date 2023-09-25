import { createStore } from "redux";
import reducer from "./reduser";

const store = createStore(reducer);
console.log(store);

const dispatch = store.dispatch;
export { dispatch };

export default store;
