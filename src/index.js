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

// import Denver from './fonts/denver-serial-bold.ttf';
// injectGlobal`
//   @font-face {
//     font-family : 'Denver';
//     src: local('Denver'), url(${Denver}) format('ttf');
//   }
// `;

const Routes = (props) => (
    <Router >
      <Switch>
        {/* <Route exact path={`${process.env.PUBLIC_URL}/about`} component={About}></Route> */}
        <Route exact path={process.env.PUBLIC_URL + "/about"} component={About} />
        <Route exact path={process.env.PUBLIC_URL + "/competitions"} render={routeProps => <Competitions {...routeProps} />} />
        <Route exact path={process.env.PUBLIC_URL + "/competitions/:uid"} render={routeProps => <Competitions {...routeProps} />} />
        <Route exact path={process.env.PUBLIC_URL + "/contestants"} render={routeProps => <Contestants {...routeProps} />} />
        <Route exact path={process.env.PUBLIC_URL + "/contestants/:uid"} render={routeProps => <Contestants {...routeProps}/>} />
        <Route component={App}/>
      </Switch>
    </Router>
  );

ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
