import React, { Component } from 'react';
import { ChangePasswordService } from './changePasswordService';
import { LocalStorageService } from "../../services/localStorageService";
import ChangePasswordView from './changePasswordView';
import ReactGA from 'react-ga';

export default class ChangePassword extends React.Component {

  public props: any;
  public busy: any;

  constructor(props: any) {
    super(props);
    this.changePassword = this.changePassword.bind(this);
  }
  localStorageService = new LocalStorageService
  changePasswordService = new ChangePasswordService

  state = {
    currentPassword: '',
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

  componentWillMount() {
    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-124601541-1');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview('Change Password Page');
  }

  changePassword() {
    this.setState({ isLoading: true });
    var data = {
      userId: this.localStorageService.getValue('_id'),
      currentPassword: this.state.currentPassword,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    console.log(data);
    this.busy = this.changePasswordService.changePassword(data, this.changePasswordSuccess, this.changePasswordError);
  }

  changePasswordSuccess = (result: any) => {
    console.log('changePasswordSuccess', result);
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
          body: 'Error updating user password.'
        }
      });
    }
  }

  changePasswordError = (error: any) => {
    console.log('changePasswordError', error);
    this.setState({ currentPassword: '' });
    this.setState({ email: '' });
    this.setState({ password: '' });
    this.setState({ confirmPassword: '' });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error updating user password.'
      }
    });
  }

  gotToDashboard = () => {
    this.props.history.push("/");
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
      <ChangePasswordView
        setCurrentPassword={(currentPassword: any) => this.setState({ currentPassword: currentPassword.target.value })}
        setEmail={(email: any) => this.setState({ email: email.target.value })}
        setPassword={(password: any) => this.setState({ password: password.target.value })}
        setConfirmPassword={(confirmPassword: any) => this.setState({ confirmPassword: confirmPassword.target.value })}
        submit={this.changePassword}
        gotToDashboard={this.gotToDashboard}
        clearMessage={this.clearMessage}
        value={this.state} />
    );
  }
}
