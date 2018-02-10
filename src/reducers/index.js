import { combineReducers } from 'redux';
import tabReducer from './tabReducer';
import userReducer from './userReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
    tab: tabReducer,
    user: userReducer,
    settings: settingsReducer
})