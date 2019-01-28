import store from "../js/store/index";
import { changeName } from "../js/reducers/index";
import { changeAge } from "../js/reducers/index";

window.store = store;
window.changeName = changeName;
window.changeAge = changeAge;