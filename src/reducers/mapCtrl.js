import {
    UPDATE_MARKER_REQUEST,
    UPDATE_MARKER_SUCCESS,
    UPDATE_MARKER_FAIL,

    GET_CLOSEST_OBJECT_REQUEST,
    GET_CLOSEST_OBJECT_SUCCESS,
    GET_CLOSEST_OBJECT_FAIL,


} from '../constants/mapCtrl';

const initialState = {
    updatedMarkers: [],
    closestObjs: [],
    error: ''
};

export default function mapCtrl(state = initialState, action) {

    switch (action.type) {
        case UPDATE_MARKER_REQUEST:
            return {...state, err: ''}
        case UPDATE_MARKER_SUCCESS:
            return {...state, updatedMarkers: action.payload, err: ''}
        case UPDATE_MARKER_FAIL:
            return {...state, err: action.payload}

        case GET_CLOSEST_OBJECT_REQUEST:
            return {...state, err: ''}
        case GET_CLOSEST_OBJECT_SUCCESS:
            return {...state, closestObjs: action.payload, error: ''}
        case GET_CLOSEST_OBJECT_FAIL:
            return {...state, error: action.payload}



        default:
            return {...state};
    }
}