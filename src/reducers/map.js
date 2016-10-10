import {
    MAP_REQUEST,
    MAP_SUCCESS,
    MAP_FAIL,

    MARKER_ONCLICK_SUCCESS,
    MARKER_ONCLICK_FAIL,

    MARKER_ONAUTOCOMPLETE_REQUEST,
    MARKER_ONAUTOCOMPLETE_SUCCESS,
    MARKER_ONAUTOCOMPLETE_FAIL,

    GET_MARKER_FROM_LIST_SUCCESS,
} from '../constants/map';

const initialState = {
    error: '',
    fetching: false,
    markersData: {}
};

export default function map(state = initialState, action) {

    switch (action.type) {
        case MAP_REQUEST:
            return {...state, fetching: true, error: ''}
        case MAP_SUCCESS:
            return {...state, fetching: false, error: ''}
        case MAP_FAIL:
            return {...state, fetching: false, error: action.payload}

        case MARKER_ONCLICK_SUCCESS:
            return {...state, markersData: action.payload, error: ''}
        case MARKER_ONCLICK_FAIL:
            return {...state, error: action.payload}

        case MARKER_ONAUTOCOMPLETE_REQUEST:
            return {...state, error: ''}
        case MARKER_ONAUTOCOMPLETE_SUCCESS:
            return {...state, markersData: action.payload, error: ''}
        case MARKER_ONAUTOCOMPLETE_FAIL:
            return {...state, error: action.payload}

        case GET_MARKER_FROM_LIST_SUCCESS:
            return {...state, markersData: action.payload, err: ''};
        default:
            return state
    }
}