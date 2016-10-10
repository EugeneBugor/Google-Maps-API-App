import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as mapActions from '../../actions/MapActions';

import MapCtrlBar from '../MapCtrlBar/MapCtrlBar.jsx';
import MapLayout from '../../components/MapLayout/MapLayout.jsx';

import CircularProgress from 'material-ui/CircularProgress';
import './MapPage.less';

const styles = {
    left: '45%',
    top: '40%',
    position: 'absolute'
};

class MapPage extends Component {
    componentDidMount() {
        const {buildMap} = this.props.mapActions;
        buildMap();
    }
    render() {
        const {fetching, markersData} = this.props.map;
        const {getMarkerOnClick, getMarkerOnAutocomplete, getMarkerFromList} = this.props.mapActions;
        return (
            <div className="MapPage">
                {fetching ? <CircularProgress size={2} style={styles}/> : null}
                <MapLayout getMarkerOnClick={getMarkerOnClick} />
                <MapCtrlBar getMarkerOnAutocomplete={getMarkerOnAutocomplete}
                            markersData={markersData}
                            fetching={fetching}
                            getMarkerFromList={getMarkerFromList}
                />
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        map: state.map
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapPage)