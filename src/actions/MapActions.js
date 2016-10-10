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

import GM from '../api/GM';

export function getMarkerOnClick() {
    return function (dispatch) {
        GM.getMarkerOnClick()
            .then((markerData) => {
                dispatch({
                    type: MARKER_ONCLICK_SUCCESS,
                    payload: markerData
                })
            })
            .catch((err) => {
                dispatch({
                    type: MARKER_ONCLICK_FAIL,
                    payload: err
                })
            })
    }
}

export function getMarkerOnAutocomplete() {
    return function (dispatch) {
        dispatch({
            type: MARKER_ONAUTOCOMPLETE_REQUEST
        });

        GM.getMarkerOnAutocomplete()
            .then((markerData) => {
                dispatch({
                    type: MARKER_ONAUTOCOMPLETE_SUCCESS,
                    payload: markerData
                })
            })
            .catch((err) => {
                dispatch({
                    type: MARKER_ONAUTOCOMPLETE_FAIL,
                    payload: err
                })
            })
    }
}

export function getMarkerFromList(lat, lng, place_id) {
    return function (dispatch) {
        dispatch({
            type: GET_MARKER_FROM_LIST_SUCCESS,
            payload: GM.getMarkerFromList(lat, lng, place_id)
        })
    }
}

export function buildMap() {
    return function (dispatch) {
        dispatch({
            type: MAP_REQUEST
        });
        setTimeout(() => {
            GM.drawMap()
                .then(() => {
                    dispatch({
                        type: MAP_SUCCESS
                    })
                })
                .catch((err) => {
                    dispatch({
                        type: MAP_FAIL,
                        payload: err
                    })
                });
        }, 1000);
    }
}