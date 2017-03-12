/*eslint-disable*/
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers/main';
import thunk from 'redux-thunk';

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );

    if (process.env.NODE_ENV === `development`) {
        const createLogger = require(`redux-logger`);
        const logger = createLogger();
        middlewares.push(logger);
    }

    if (module.hot) {
        module.hot.accept('../reducers/main', () => {
            const nextRootReducer = require('../reducers/main');
            store.replaceReducer(nextRootReducer);
        })
    }
    return store;
}