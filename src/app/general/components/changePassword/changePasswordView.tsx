import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './changePasswordStyle.css';
import Loader from '../comman/loader/loader';
import Message from '../comman/message/message';
import ErrorTag from '../comman/errorTag/errorTag';

export default class ChangePasswordView extends React.Component {

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
                            Change Password
                    </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="cp-usr-current-password"
                            placeholder='Current Password'
                            onChange={this.props.setCurrentPassword.bind(this)} />
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="cp-usr-email"
                            placeholder='Email'
                            onChange={this.props.setEmail.bind(this)} />
                    </div>
                    <div>
                        <input
                            type="password"
                            className='loginInput'
                            id="cp-usr-password"
                            placeholder='Password'
                            onChange={this.props.setPassword.bind(this)} />
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="cp-usr-confirm-password"
                            placeholder='Confirm Password'
                            onChange={this.props.setConfirmPassword.bind(this)} />
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
                            onClick={this.props.gotToDashboard.bind(this)}>
                            Cancel
                    </button>
                    </div>
                </div>
                <Loader value={this.props.value.isLoading} />
                <Message clearMessage={this.props.clearMessage.bind(this)} apiReaspose={this.props.value.apiReaspose} messageContent={this.props.value.message} />
            </div>
        )
    }
}