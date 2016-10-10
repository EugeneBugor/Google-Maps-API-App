import React, {Component, PropTypes} from 'react';
import './MapLayout.less';

let styles = {
    height: "100%"
};


export default class Map extends Component {
    static propTypes = {
        getMarkerOnClick: PropTypes.func.isRequired
    };
    getMarker = () => {
        if(this.move) {
            return;
        }

        this.props.getMarkerOnClick();
    };

    onDown = () => {
        this.move = false;
    };

    render = () => (
        <div className="Map">
            <div id="map"
                 style={styles}
                 onMouseUp={this.getMarker}
                 onMouseDown={this.onDown}
            ></div>
        </div>
    )

}