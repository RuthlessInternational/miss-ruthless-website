import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
  } from 'react-router-dom'


import './index.css';

import App from './App';
import Competitions from './components/Competitions';
import Contestants from './components/Contestants';
import About from './components/About';

import registerServiceWorker from './registerServiceWorker';

const Routes = (props) => (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path={"/about"} component={About} />
        <Route exact path={"/competitions"} render={routeProps => <Competitions {...routeProps} />} />
        <Route exact path={"/competitions/:uid"} render={routeProps => <Competitions {...routeProps} />} />
        <Route exact path={"/contestants"} render={routeProps => <Contestants {...routeProps} />} />
        <Route exact path={"/contestants/:uid"} render={routeProps => <Contestants {...routeProps}/>} />
        <Route component={App}/>
      </Switch>
    </Router>
  );

ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
