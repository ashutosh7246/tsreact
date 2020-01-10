import React, { Component } from 'react';
import { ForgotPasswordService } from './forgotPasswordService';
import { LocalStorageService } from "../../services/localStorageService";
import ForgotPasswordView from './forgotPasswordView';
// import { validator } from '../../services/validator';
// import validatejs from 'validate';
// import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';

// social auth //
// import { loginWithGoogle } from "../../services/socialAuth/auth";
// import { loginWithFacebook } from "../../services/socialAuth/auth";
// import { firebaseAuth } from "../../services/socialAuth/authConstants";
// const firebaseAuthKey = "firebaseAuthInProgress";
// const appTokenKey = "appToken";
// social auth //

export default class ForgotPassword extends React.Component {

  public props: any;
  public busy: any;

  constructor(props: any) {
    super(props);
    this.forgotPassword = this.forgotPassword.bind(this);
  }
  localStorageService = new LocalStorageService
  forgotPasswordService = new ForgotPasswordService

  state = {
    email: '',
    isLoading: false,
    apiReaspose: false,
    message: {
      type: '',
      body: ''
    }
  }

  componentWillMount() {

    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-124601541-1');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview('Forgot Password Page');

    if (this.localStorageService.getValue('accessToken')) {
      this.props.history.push("/");
      return;
    } else if (localStorage.getItem('userData')) {
      this.props.history.push("/otp");
      return;
    }
  }

  forgotPassword() {
    this.setState({ isLoading: true });
    var user = {
      email: this.state.email
    }
    this.busy = this.forgotPasswordService.forgotPassword(user, this.passwordChangedSuccess, this.passwordChangedError);
  }

  passwordChangedSuccess = (result: any) => {
    this.setState({ email: '' });
    console.log('passwordChangedSuccess', result);
    this.setState({ isLoading: false });
    if (result.success) {
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Success',
          body: 'Please check your email for updated password!'
        }
      });
    } else {
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Error',
          body: 'Error in reseting password!'
        }
      });
    }
  }

  passwordChangedError = (error: any) => {
    this.setState({ email: '' });
    console.log('passwordChangedError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in reseting password!'
      }
    });
  }

  login = () => {
    this.props.history.push('/login');
  }

  clearMessage = () => {
    this.setState({
      apiReaspose: false,
      message: {
        type: '',
        body: ''
      }
    });
  }

  render() {
    return (
      <ForgotPasswordView
        setEmail={(email: any) => { this.setState({ email: email.target.value }) }}
        submit={this.forgotPassword}
        login={this.login}
        clearMessage={this.clearMessage}
        value={this.state} />
    );
  }
}
