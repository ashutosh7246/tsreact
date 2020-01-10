import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './registerStyle.css';
import Loader from '../comman/loader/loader';
import Message from '../comman/message/message';
import ErrorTag from '../comman/errorTag/errorTag';

export default class RegisterView extends React.Component {

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
                            Sign-Up
                    </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="reg-usr-first-name"
                            placeholder='First Name'
                            onChange={this.props.setFirstName.bind(this)} />
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="reg-usr-last-name"
                            placeholder='Last Name'
                            onChange={this.props.setLastName.bind(this)} />
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="reg-usr-email"
                            placeholder='Email'
                            onChange={this.props.setEmail.bind(this)} />
                    </div>
                    <div>
                        <input
                            type="password"
                            className='loginInput'
                            id="reg-usr-password"
                            placeholder='Password'
                            onChange={this.props.setPassword.bind(this)} />
                    </div>
                    <div>
                        <input
                            type="text"
                            className='loginInput'
                            id="reg-usr-confirm-password"
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
                            onClick={this.props.goToLogin.bind(this)}>
                            Login
                    </button>
                    </div>
                </div>
                <Loader value={this.props.value.isLoading} />
                <Message clearMessage={this.props.clearMessage.bind(this)} apiReaspose={this.props.value.apiReaspose} messageContent={this.props.value.message} />
            </div>
        )
    }
}