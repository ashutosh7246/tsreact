import React, { Component } from 'react';
import { OTPService } from './otpServivce';
import { LocalStorageService } from "../../../services/localStorageService";
import OTPView from './otpView';
import ReactGA from 'react-ga';

export default class OTP extends React.Component {

  public props: any;
  public busy: any;

  constructor(props: any) {
    super(props);
    this.verifyOTP = this.verifyOTP.bind(this);
  }
  localStorageService = new LocalStorageService
  otpService = new OTPService

  state = {
    otp: '',
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
    ReactGA.pageview('OTP Page');
    // this.setState({isLoading:true});
    let userData: any = localStorage.getItem('userData');
    let otpData = JSON.parse(userData);
    if (!otpData ||
      !otpData.data ||
      !otpData.data.time ||
      !otpData.data.dummyOtp ||
      !otpData.data.userRefId) {
      this.clearAndGoToLogin();
      return;
    }
  }

  clearAndGoToLogin = () => {
    localStorage.clear();
    this.props.history.push("/login");
  }

  verifyOTP() {
    this.setState({ isLoading: true });
    let userData: any = localStorage.getItem('userData');
    let otpData = JSON.parse(userData);
    let data = {
      time: otpData.data.time,
      dummyOtp: otpData.data.dummyOtp,
      otp: this.state.otp,
      userRefId: otpData.data.userRefId
    }
    this.busy = this.otpService.verifyOTP(data, this.verifyOTPSuccess, this.verifyOTPError);
  }

  verifyOTPSuccess = (result: any) => {
    console.log('verifyOTPSuccess', result);
    this.setState({ isLoading: false });
    if (result.success) {
      localStorage.clear();
      this.localStorageService.create();
      let userData = {
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        isPasswordChanged: result.user.isPasswordChanged,
        role: result.auth.role,
        userId: result.user.userId,
        _id: result.user._id
      };
      let tokenData = {
        accessToken: result.auth.accessToken,
        refreshToken: result.auth.refreshToken
      };
      this.localStorageService.setValue('email', userData.email);
      this.localStorageService.setValue('firstName', userData.firstName);
      this.localStorageService.setValue('lastName', userData.lastName);
      this.localStorageService.setValue('isPasswordChanged', userData.isPasswordChanged);
      this.localStorageService.setValue('role', userData.role);
      this.localStorageService.setValue('userId', userData.userId);
      this.localStorageService.setValue('_id', userData._id);
      this.localStorageService.setValue('accessToken', tokenData.accessToken);
      this.localStorageService.setValue('refreshToken', tokenData.refreshToken);
      this.props.history.push("/");
    } else {
      if (result.isExpired) {
        this.clearAndGoToLogin();
      } else {
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: 'Wrong otp.'
          }
        });
      }
    }
  }

  verifyOTPError = (error: any) => {
    console.log('verifyOTPError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Wrong otp'
      }
    });
  }

  resendOTP = () => {
    this.setState({ otp: '' });
    this.setState({ isLoading: true });
    let userData: any = localStorage.getItem('userData');
    let otpData = JSON.parse(userData);
    let data = {
      time: otpData.data.time,
      dummyOtp: otpData.data.dummyOtp,
      userRefId: otpData.data.userRefId
    };
    this.busy = this.otpService.resendOtp(data, this.resendOtpSuccess, this.resendOtpFailure);
  }

  resendOtpSuccess = (data: any) => {
    this.setState({ isLoading: false });
    if (data.success) {
      localStorage.setItem('userData', JSON.stringify(data));
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Success',
          body: 'OTP sent to your registered email.'
        }
      });
    } else {
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Error',
          body: 'Error in re-sending otp!'
        }
      });
    }
  }

  resendOtpFailure = (error: any) => {
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in re-sending otp!'
      }
    });
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
      <OTPView
        setOTP={(otp: any) => this.setState({ otp: otp.target.value })}
        //   setEmail={(email) => {this.setState({email:email.target.value})}}
        //   resetEmail={this.clearEmail} 
        //   resetPassword={this.clearPassword}
        // submit={this.registerClientId}
        submit={this.verifyOTP}
        resendOTP={this.resendOTP}
        //   googleLogin={this.handleGoogleLogin}
        //   facebookLogin={this.handleFacebookLogin}
        clearMessage={this.clearMessage}
        //   validateEmail={(email) => {this.setState({emailError: this.validate('email', this.state.email)})}}
        //   validatePassword={(password) => {this.setState({passwordError: this.validate('password', this.state.password)})}}
        value={this.state} />
    );
  }
}
