import React, {Component, PropTypes} from 'react';

import {Link} from 'react-router';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';
import baseTheme from '../../../node_modules/material-ui/styles/baseThemes/lightBaseTheme';
import userApi from '../../api/user';

export default class LoggedInLayout extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}