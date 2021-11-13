import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './style/tailwind.css';
import { NavBar, VideoPlayer, Videos } from './components';

const App = ({ video }) => {
  return (
    <Router>
      <div className='relative'>
        <NavBar />
        <Switch>
          <Route path='/watch/:id' component={VideoPlayer} exact />
          <Route path='/' component={Videos} exact />
        </Switch>
      </div>
    </Router>
  );
};

const mapStateToProp = ({ app }) => ({ video: app.video });
export default connect(mapStateToProp, {})(App);
