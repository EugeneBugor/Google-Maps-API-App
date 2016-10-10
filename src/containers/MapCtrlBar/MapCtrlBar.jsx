import React, {Component, PropTypes} from 'react';
import ListClosestObjs from '../../components/ListClosestObjs/ListClosestObjs.jsx'
import ListMarkers from '../ListMarkers/ListMarkers.jsx'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as mapCtrlActions from '../../actions/MapCtrlActions';
import {FlatButton, TextField} from 'material-ui';
import userApi from '../../api/user';

import './MapCtrlBar.less'

const styles = {
    height: "40px",
    lineHeight: "20px",
    width: "500px",
    color: "black"
}

const inputStyles = {
    width: "80%"
}

class MapCtrlBar extends Component {
    static propTypes = {
        fetching: PropTypes.bool.isRequired,
        markersData: PropTypes.object,
        getMarkerOnAutocomplete: PropTypes.func.isRequired,
        getMarkerFromList: PropTypes.func.isRequired
    };

    state = {
        toggle: false
    };

    toggleOnClick = (e) => {
        if (e.target.tagName == "INPUT" && this.state.toggle) {
            this.setState({toggle: false});
        } else if (e.target.tagName == "SPAN") {
            this.setState({toggle: !this.state.toggle});
        }
    };

    onAutocomplete = () => {
        this.props.getMarkerOnAutocomplete();
    }

    onSaveMarkers = () => {
        let same = false;
        if (!this.props.markersData || !this.props.markersData.place_id) return;
        userApi.__userData.markers.forEach(item=> {
            if (item == this.props.markersData) same = true;
        });
        if (!same){
            const {onUpdateMarker} = this.props.mapCtrlActions;
            userApi.__userData.markers.push(this.props.markersData)

            const updatedMarkers = userApi.__userData.markers;
            const userName = userApi.__userData.username;
            onUpdateMarker(userName, updatedMarkers);
        } else {
            return;
        }
    };

    onGettingClosestObjs = (type) => {
        const {getClosestObjs} = this.props.mapCtrlActions;
        const marker = this.props.markersData;

        function isEmpty(marker) {
            for (var prop in marker) {
                if (marker.hasOwnProperty(prop))
                    return false;
            }
            return true;
        }

        if (isEmpty(marker)) {
            return;
        } else {
            getClosestObjs(marker.geometry.location.lat, marker.geometry.location.lng, type)
        }
    }

    onGettingMarkerFromList = (lat, lng, place_id) => {
        const {getMarkerFromList} = this.props;
        getMarkerFromList(lat, lng, place_id)
    }

    render() {
        const {toggle} = this.state;
        const label = toggle ? "▲" : "▼";
        const {onUpdateMarker} = this.props.mapCtrlActions;
        return (
            <div className="MapCtrlBar"
                 style={this.props.fetching ? {display: 'none'} : null}
            >
                <TextField
                    id="pac-input"
                    onFocus={this.onAutocomplete}
                    placeholder=''
                    hintText="Search"
                    style={styles}
                />
                <FlatButton className="button-toggle-ctrlBar"
                            style={styles}
                            label={label}
                            onClick={this.toggleOnClick}/>
                {toggle ? <div>
                    <FlatButton className="button-save"
                                style={{marginTop: 20, width: 500}}
                                onClick={this.onSaveMarkers}
                                label="Save" primary={true}/>
                    <ListClosestObjs onGettingClosestObjs={this.onGettingClosestObjs}/>

                    <ListMarkers onUpdateMarker={onUpdateMarker}
                                 onGettingMarkerFromList={this.onGettingMarkerFromList}
                    />
                </div>
                    : null}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        mapCtrl: state.mapCtrl
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mapCtrlActions: bindActionCreators(mapCtrlActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapCtrlBar);