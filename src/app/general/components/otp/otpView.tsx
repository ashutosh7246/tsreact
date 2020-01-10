import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './otpStyle.css';
import Loader from '../comman/loader/loader';
import Message from '../comman/message/message';
// import ErrorTag from '../errorTag/errorTag';

export default class OTPView extends React.Component {

    public props: any;
    
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="LoginFormCon">
                <div className='LoginForm'>
                    <div>
                        <label className='loginLabel'>
                            Check your email for OTP
                    </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="usr-otp"
                            placeholder='OTP'
                            onChange={this.props.setOTP.bind(this)} />
                    </div>
                    <div>
                        <button
                            type="button"
                            className='loginBt'
                            onClick={this.props.submit.bind(this)}>
                            Submit
                    </button>
                        <button
                            type="button"
                            className='loginBt'
                            onClick={this.props.resendOTP.bind(this)}>
                            Resend OTP
                    </button>
                    </div>
                </div>
                <Loader value={this.props.value.isLoading} />
                <Message clearMessage={this.props.clearMessage.bind(this)} apiReaspose={this.props.value.apiReaspose} messageContent={this.props.value.message} />
            </div>
        )
    }
}