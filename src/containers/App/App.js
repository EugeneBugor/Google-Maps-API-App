import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import userApi from '../../api/user';

import { Drawer, AppBar, MenuItem } from 'material-ui';

import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';
import baseTheme from '../../../node_modules/material-ui/styles/baseThemes/lightBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

import './App.less';

export default class App extends Component {
    state = {
        open: false
    };

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static childContextTypes = {
        muiTheme: PropTypes.object.isRequired
    };

    handleToggle = () => {
        this.setState({open: !this.state.open});
    };

    onSign = (e) => {
        e.cancelBubble = true;
        if (userApi.__isLoggedIn) {
            window.localStorage.token = '';
            userApi.__isLoggedIn = false;
        }
    };

    render() {
        const auth = window.localStorage.token && (userApi.__isLoggedIn == true);

        let currentRouteName = this.props.location.pathname.charAt(1).toUpperCase()
            + this.props.location.pathname.slice(2);
        let log = auth ? 'Log Out' : 'Log In';

        return (
            <div className="App">
                <AppBar
                    title={currentRouteName ? currentRouteName : 'App'}
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onTouchTap={this.handleToggle}
                >
                    <Drawer width={200} openSecondary={false} open={this.state.open}>
                        <AppBar title="App" onTouchTap={this.handleToggle}/>
                        <Link to="/">
                            <MenuItem>Home</MenuItem>
                        </Link>

                        <Link to="/map">
                            <MenuItem>Map</MenuItem>
                        </Link>
                        <Link to="/about">
                            <MenuItem>About</MenuItem>
                        </Link>
                        <Link to="/auth" onClick={this.onSign}>
                            <MenuItem>{log}</MenuItem>
                        </Link>
                        {userApi.__isLoggedIn ? <MenuItem>Hello, {userApi.__userData.username}!</MenuItem> : null}
                    </Drawer>
                </AppBar>

                {this.props.children}

            </div>
        )
    }
}
