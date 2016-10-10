import React, {Component, PropTypes} from 'react';
import userApi from '../../api/user';
import {List, ListItem} from 'material-ui/List';

import './ListMarkers.less'

export default class ListMarkers extends Component {
    static propTypes = {
        onUpdateMarker: PropTypes.func.isRequired,
        onGettingMarkerFromList: PropTypes.func.isRequired
    };

    deleteMarker = (e) => {
        e.stopPropagation();

        const {onUpdateMarker} = this.props;
        const userName = userApi.__userData.username;
        const data = e.target.getAttribute('data').split(',');

        userApi.__userData.markers.forEach((item, i)=> {
            if (item.place_id == data[2]) {
                userApi.__userData.markers.splice(i, 1)
            }
        });

        onUpdateMarker(userName, userApi.__userData.markers);
    };


    onClick = (e) => {
        const mark = e.target.childNodes[0].getAttribute('data').split(',')
        this.props.onGettingMarkerFromList(mark[0], mark[1], mark[2])
    };

    render() {
        var markers_list = userApi.__userData.markers.map((item, i) => {
            return ( <div key={i}>

                <ListItem onClick={this.onClick}
                          style={{overflow: "auto", wrap: 'none'}}
                >
                    <button onClick={this.deleteMarker}
                            data={`${Number(item.geometry.location.lat) ? item.geometry.location.lat
                                : item.geometry.location.lat()},
                                ${Number(item.geometry.location.lng) ? item.geometry.location.lng
                                : item.geometry.location.lng()},${item.place_id}`}>
                    </button>
                    {item.formatted_address}
                </ListItem>
            </div>)
        }).reverse();
        return (
            <div className="ListMarkers">
                <List>
                    {markers_list}
                </List>
            </div>
        )
    }
}