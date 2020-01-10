import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import {
  HashRouter,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Header from './header/header';
import Home from '../Home/home';
import SideNav from './sidenav/sidenav';
import Overlay from './overlay/overlay';
import Footer from './footer/footer';
import Login from '../Login/login';
import Register from '../register/register';
import ForgotPassword from '../forgotPassword/forgotPassword';
import ChangePassword from '../changePassword/changePassword';
import OTP from '../otp/otp';
// import NoConnection from '../noConnection/noConnection';
// import {IsLoggedIn} from "../../common/isLoggedIn.js";
import { AuthGuardService } from "../../services/authGuardService";
// import { Offline, Online } from 'react-detect-offline';
import { Offline, Online } from '../../../connect';
// import { check, watch } from 'is-offline';
// import isOnline from 'is-online';

const SecureRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props =>
    (authGuard() ?
      (
        <div className="mainContainer">
          <Online>
            <Header />
            {authGuard() ? <SideNav {...props} /> : null}
            {authGuard() ? <Overlay /> : null}
            <Component {...props} />
            <Footer />
          </Online>
          <Offline><NotFound /></Offline>
        </div>
      )
      :
      (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    )} />
)
const LoggedIn = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !authGuard() ? (
      <div className="mainContainer">
        <Online>
          <Header />
          {authGuard() ? <SideNav {...props} /> : null}
          {authGuard() ? <Overlay /> : null}
          <Component {...props} />
          <Footer />
        </Online>
        <Offline><NotFound /></Offline>
      </div>
    ) : (
        <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
      )
  )} />
)
const authGuard = () => {
  var authGuardService = new AuthGuardService
  let res = authGuardService.canActivate();
  return res;
}

class NotFound extends Component {
  render() {
    return (
      <div style={styles.notFoundCon}>
        {/* <Link style={styles.notFoundLink} to="/">Page not found.....click to continue</Link> */}
        <Link to="/">Page not found.....click to continue</Link>
      </div>
    )
  }
}

var styles = {
  notFoundCon: {
    height: '100%',
    background: 'rgb(44, 62, 80)'
  },
  notFoundLink: {
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

export default class Routing extends Component {

  public props: any;

  constructor(props: any) {
    super(props);
  }

  render() {
    console.log('authGuard1');
    return (
      <HashRouter>
        <Switch>
          <SecureRoute
            exact
            path="/"
            component={Home} />

          <SecureRoute
            exact
            path="/change-password"
            component={ChangePassword} />

          <LoggedIn
            exact
            path="/login"
            component={Login} />

          <LoggedIn
            exact
            path="/otp"
            component={OTP} />

          <LoggedIn
            exact
            path="/register"
            component={Register} />

          <LoggedIn
            exact
            path="/forgot-password"
            component={ForgotPassword} />

          <Route path='/notfound' component={NotFound} />

          <Redirect to="/" />
        </Switch>
      </HashRouter>
    );
  }
}