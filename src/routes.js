import React from 'react';

import {Route, IndexRoute} from 'react-router';

import App from './containers/App/App.js';
import Home from './components/Home/Home.jsx'
import AuthPage from './containers/AuthPage/AuthPage.jsx';
import LoggedInLayout from './containers/LoggedInLayout/LoggedInLayout.jsx';
import AboutPage from './components/AboutPage/AboutPage.jsx';
import MapPage from './containers/MapPage/MapPage.jsx';
import NotFound from './components/NotFound/NotFound.jsx'
import userApi from './api/user';

/*eslint-disable*/
export const routes = (
    <div>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/auth" component={AuthPage}/>
            <Route component={LoggedInLayout} onEnter={requireAuth}>
                <Route path="/map" component={MapPage}/>
                <Route path="/about" component={AboutPage}/>
            </Route>
        </Route>
        <Route path='*' component={NotFound} />
    </div>
);

function requireAuth(nextState, replace) {
    if (!userApi.__isLoggedIn) {
        replace({
            pathname: '/auth',
            state: {nextPathname: nextState.location.pathname}
        })
    }
}