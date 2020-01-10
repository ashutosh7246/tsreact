import React, { Component } from 'react';
import { RegisterService } from './registerService';
import { LocalStorageService } from "../../services/localStorageService";
import RegisterView from './registerView';
import * as validator from '../../services/validator';
// import validatejs from '../../Login/node_modules/validate';
// import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
// import ReactGA from '../../Home/node_modules/react-ga';

import ReactGA from 'react-ga';

// social auth //
// import { loginWithGoogle } from "../../socialAuth/auth";
// import { loginWithFacebook } from "../../socialAuth/auth";
// import { firebaseAuth } from "../../socialAuth/authConstants";
const firebaseAuthKey = "firebaseAuthInProgress";
// const appTokenKey = "appToken";
// social auth //

export default class Register extends React.Component {

  busy: any;

  localStorageService = new LocalStorageService;
  registerService = new RegisterService;

  public props: any;
  public state: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isLoading: false,
    apiReaspose: false,
    message: {
      type: '',
      body: ''
    }
  }

  constructor(props: any) {
    super(props);
    this.registerUser = this.registerUser.bind(this);
  }

  componentWillMount() {
    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-124601541-1');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview('Register Page');
    if (this.localStorageService.getValue('accessToken')) {
      this.props.history.push("/");
      return;
    } else if (localStorage.getItem('userData')) {
      this.props.history.push("/otp");
      return;
    }
  }

  registerUser() {
    this.setState({ isLoading: true });
    var data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    console.log(data);
    this.busy = this.registerService.registerUser(data, this.registerSuccess, this.registerError);
  }

  registerSuccess = (result: any) => {
    console.log('registerSuccess', result);
    this.setState({ isLoading: false });
    if (result.success) {
      this.props.history.push("/login");
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Success',
          body: 'User registered'
        }
      });
    } else {
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Error',
          body: 'Error in registering user.'
        }
      });
    }
  }

  registerError = (error: any) => {
    console.log('registerError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error inregistering user.'
      }
    });
  }

  goToLogin = () => {
    this.props.history.push("/login");
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
      <RegisterView
        setFirstName={(firstName: any) => this.setState({ firstName: firstName.target.value })}
        setLastName={(lastName: any) => this.setState({ lastName: lastName.target.value })}
        setEmail={(email: any) => this.setState({ email: email.target.value })}
        setPassword={(password: any) => this.setState({ password: password.target.value })}
        setConfirmPassword={(confirmPassword: any) => this.setState({ confirmPassword: confirmPassword.target.value })}
        submit={this.registerUser}
        goToLogin={this.goToLogin}
        clearMessage={this.clearMessage}
        value={this.state} />
    );
  }
}
