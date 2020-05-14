import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Global } from '@emotion/core';
import { resets } from './styles';
import { Initialize, Setup, Config } from './routes'
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';

import 'antd/dist/antd.css';

const App: React.FC = () => {

    return (
        <Provider store={store}>
            <Global styles={resets} />
            <Router>
                <Switch>
                    <Route path='/' exact>
                        <Initialize />
                    </Route>
                    <Route path='/setup'>
                        <Setup />
                    </Route>
                    <Route path='/config'>
                        <Config />
                    </Route>
                </Switch>
            </Router>
        </Provider>
    )

}

ReactDOM.render(<App />, document.getElementById('root'))