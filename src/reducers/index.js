import { combineReducers } from 'redux';
import tabReducer from './tabReducer';
import userReducer from './userReducer';
import navReducer from './navReducer';

export default combineReducers({
    tab: tabReducer,
    user: userReducer,
    //nav: navReducer
})