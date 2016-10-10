import {
    UPDATE_MARKER_REQUEST,
    UPDATE_MARKER_SUCCESS,
    UPDATE_MARKER_FAIL,

    GET_CLOSEST_OBJECT_REQUEST,
    GET_CLOSEST_OBJECT_SUCCESS,
    GET_CLOSEST_OBJECT_FAIL

} from '../constants/mapCtrl';

import updateMarkers from '../api/updateMarkers';
import GM from '../api/GM';


export function onUpdateMarker(username, markers) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_MARKER_REQUEST
        })
        updateMarkers.update(username, markers)
            .then((updatedMarkers)=> {
                dispatch({
                    type: UPDATE_MARKER_SUCCESS,
                    payload: updatedMarkers
                });
            })
            .catch(err => {
                dispatch({
                    type: UPDATE_MARKER_FAIL,
                    payload: err
                })
            })
    }
}

export function getClosestObjs(lat, lng, type) {
    return function (dispatch) {
        dispatch({
            type: GET_CLOSEST_OBJECT_REQUEST
        })
        GM.getClosestObjs(lat, lng, type)
            .then((closestObjs)=> {
                dispatch({
                    type: GET_CLOSEST_OBJECT_SUCCESS,
                    payload: closestObjs
                })
            })
            .catch((err)=> {
                dispatch({
                    type: GET_CLOSEST_OBJECT_FAIL,
                    payload: err
                })
            })
    }
}

