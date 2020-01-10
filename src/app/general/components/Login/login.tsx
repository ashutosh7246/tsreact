import React, { Component } from 'react';
import { LoginService } from './loginService';
import { LocalStorageService } from "../../services/localStorageService";
import LoginView from './loginView';
import { validator } from '../../services/validator';
import validatejs from 'validate.js';
// import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';

// social auth //
import { loginWithGoogle } from "../../services/socialAuth/auth";
import { loginWithFacebook } from "../../services/socialAuth/auth";
import { firebaseAuth } from "../../services/socialAuth/authConstants";
const firebaseAuthKey = "firebaseAuthInProgress";
// const appTokenKey = "appToken";
// social auth //

export default class Login extends React.Component {

  public props: any;
  public busy: any;

  constructor(props: any) {
    super(props);
    this.registerClientId = this.registerClientId.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }
  localStorageService = new LocalStorageService;
  loginService = new LoginService;

  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    isLoading: false,
    apiReaspose: false,
    message: {
      type: '',
      body: ''
    },
    uuid: ''
  }

  handleFacebookLogin() {
    localStorage.setItem('loginBy', 'facebook');
    this.setState({ isLoading: true });
    loginWithFacebook()
      .catch((error: any) => {
        this.setState({ isLoading: false });
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: error
          }
        });
        localStorage.removeItem(firebaseAuthKey);
        this.localStorageService.clearLocalStorage();
      });
    localStorage.setItem(firebaseAuthKey, "1");
  }

  handleGoogleLogin() {
    localStorage.setItem('loginBy', 'google');
    this.setState({ isLoading: true });
    loginWithGoogle()
      .catch((error: any) => {
        this.setState({ isLoading: false });
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: error
          }
        });
        localStorage.removeItem(firebaseAuthKey);
        this.localStorageService.clearLocalStorage();
      });
    localStorage.setItem(firebaseAuthKey, "1");
  }

  componentWillMount() {

    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-216405141-1');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview('Login Page');

    this.setState({ isLoading: true });

    // if (localStorage.getItem(appTokenKey)) {
    //     this.props.history.push("/");
    //     return;
    // }

    if (this.localStorageService.getValue('accessToken')) {
      this.props.history.push("/");
      return;
    } else if (localStorage.getItem('userData')) {
      this.props.history.push("/otp");
      return;
    }

    firebaseAuth().onAuthStateChanged((user: any) => {
      this.setState({ isLoading: false });
      if (user) {
        user = JSON.stringify(user);
        user = JSON.parse(user);

        // store the token
        localStorage.removeItem(firebaseAuthKey);
        this.localStorageService.create();
        this.localStorageService.setValue('loginType', 'social');
        this.localStorageService.setValue('email', user.email);
        this.localStorageService.setValue('firstName', user.displayName);
        this.localStorageService.setValue('accessToken', user.accessToken);
        this.localStorageService.setValue('refreshToken', user.refreshToken);
        this.localStorageService.setValue('userPhotoURL', user.photoURL);

        // here you could authenticate with you web server to get the
        // application specific token so that you do not have to
        // authenticate with firebase every time a user logs in
        // localStorage.setItem(appTokenKey, user.uid);

        if ((localStorage.getItem('auth') && localStorage.getItem('user'))) {
          this.props.history.push("/")
        }
      }
    });
  }

  validate = (fieldName: any, value: any) => {
    console.log('fieldName value', fieldName + '   ' + value);
    var formValues: any = {}
    formValues[fieldName] = value
    console.log('formValues', formValues);
    var formFields: any = {}
    formFields[fieldName] = validator[fieldName]
    console.log('formFields', formFields);
    const result = validatejs(formValues, formFields)
    if (result) {
      console.log('validate result', result)
      return result[fieldName][0]
    }
    return null
  }

  registerClientId() {
    localStorage.clear();
    const emailErr = this.validate('email', this.state.email)
    const passwordErr = this.validate('password', this.state.password)
    console.log('emailError', emailErr);
    console.log('passwordError', passwordErr)

    this.setState({
      emailError: emailErr,
      passwordError: passwordErr
    })

    if (!emailErr && !passwordErr) {
      this.setState({ isLoading: true });
      var uuid = this.generateUUID();
      uuid = uuid.concat(this.state.email);
      localStorage.setItem('uuid', uuid);
      this.setState({ uuid: uuid });
      var params = {
        clientId: uuid
      };
      var loginService = new LoginService;
      loginService.registerClientId(params, this.registerClientIdSuccess, this.registerClientIdError);
    }
  }

  registerClientIdSuccess = (result: any) => {
    console.log('registerClientIdSuccess', result);
    var loginModel = {
      email: this.state.email,
      password: this.state.password,
      grantType: 'password'
    };
    this.busy = this.loginService.authenticateUser(loginModel, this.loginSuccess, this.loginError);
  }

  registerClientIdError = (error: any) => {
    console.log('registerClientIdError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in registering client.'
      }
    });
  }

  authenticate() {
    this.setState({ isLoading: true });
    var loginModel = {
      email: this.state.email,
      password: this.state.password,
      grantType: 'password'
    };
    this.busy = this.loginService.authenticateUser(loginModel, this.loginSuccess, this.loginError);
  }

  loginSuccess = (result: any) => {
    console.log('loginSuccess', result);
    this.setState({ isLoading: false });
    if (result.success) {
      localStorage.setItem('userData', JSON.stringify(result));
      this.props.history.push("/otp");
    } else {
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Error',
          body: 'Wrong credentials.'
        }
      });
    }
    // if (result.errorCode) {
    //   this.setState({
    //     apiReaspose:true,
    //     message: {
    //       type: 'Error',
    //       body: 'Wrong credentials.'
    //     }});
    // } else {
    //   const auth = result;
    //   this.localStorageService.create();
    //   this.localStorageService.setValue('accessToken', auth.access_token);
    //   this.localStorageService.setValue('refreshToken', auth.refresh_token);
    //   this.localStorageService.setValue('uuid', this.state.uuid);

    //   const model = {
    //       email: this.state.email
    //   };
    //   this.busy = this.loginService.loginUser(model, this.loginUserSuccess, this.loginUserError);
    // }
  }

  loginError = (error: any) => {
    console.log('loginError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in login.'
      }
    });
  }

  loginUserSuccess = (result: any) => {
    console.log('loginUserSuccess', result);
    if (result.lenght > 0 && result[0].errorCode) {
      if (result[0].errorCode === 401) {
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: 'Wrong credentials.'
          }
        });
      } else {
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: 'System error.'
          }
        });
      }
    } else {
      this.setState({ isLoading: false });
      result = result.result;
      if (result.roles[0] === 'ROLE_SUPER' || result.roles[1] === 'ROLE_SUPER') {
        this.localStorageService.setValue('userId', result.id);
        this.localStorageService.setValue('isAccessTokenExpired', 0);
        this.localStorageService.setValue('userEmail', result.email);
        this.localStorageService.setValue('userImage', result.image);
      }
    }
    this.props.history.push('/');
  }

  loginUserError = (error: any) => {
    console.log('loginUserError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in user login.'
      }
    });
  }

  generateUUID = () => {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = ((d + Math.random() * 16) % 16) | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  clearEmail = () => {
    //   this._username.setNativeProps({ text: '' });
  }

  clearPassword = () => {
    //   this._password.setNativeProps({ text: '' });
  }

  register = () => {
    this.props.history.push('/register');
  }

  forgotPassword = () => {
    this.props.history.push('/forgot-password');
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
      <LoginView
        setPassword={(password: any) => this.setState({ password: password.target.value })}
        setEmail={(email: any) => { this.setState({ email: email.target.value }) }}
        resetEmail={this.clearEmail}
        resetPassword={this.clearPassword}
        // submit={this.registerClientId}
        submit={this.authenticate}
        register={this.register}
        forgotPassword={this.forgotPassword}
        googleLogin={this.handleGoogleLogin}
        facebookLogin={this.handleFacebookLogin}
        clearMessage={this.clearMessage}
        validateEmail={(email: any) => { this.setState({ emailError: this.validate('email', this.state.email) }) }}
        validatePassword={(password: any) => { this.setState({ passwordError: this.validate('password', this.state.password) }) }}
        value={this.state} />
    );
  }
}
