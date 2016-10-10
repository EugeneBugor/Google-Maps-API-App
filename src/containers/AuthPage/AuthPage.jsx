import React, {Component, PropTypes} from 'react';
import Form from '../../components/Form/Form.jsx'

import userApi from '../../api/user';
import './AuthPage.less'

export default class AuthPage extends Component {
    constructor(props, context) {
        super(props);
        if (userApi.__isLoggedIn) {
            context.router.replace('/');
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    rerender = () => {
        this.forceUpdate();
    }

    componentDidUpdate() {
        if (userApi.__isLoggedIn) {
            const {location} = this.props;

            if (location.state && location.state.nextPathname) {
                this.context.router.replace(location.state.nextPathname)
            } else {
                this.context.router.replace('/about');
            }
        }
    }

    render() {
        return (
            <center>
                <Form rerender={this.rerender} />
            </center>
        )
    }
}