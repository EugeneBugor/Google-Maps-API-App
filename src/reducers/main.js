import {combineReducers} from 'redux';
import map from './map';
import mapCtrl from './mapCtrl';
import { reducer as form } from 'redux-form';

export default combineReducers({
    map,
    mapCtrl,
    form
});