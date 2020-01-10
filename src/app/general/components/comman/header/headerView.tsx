import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './headerStyle.css'
import { AuthGuardService } from "../../../services/authGuardService";

const authGuard = () => {
    var authGuardService = new AuthGuardService
    let res = authGuardService.canActivate();
    return res;
}

export default class HeaderView extends React.Component {

    public props: any;

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <div className="navbar-brand">React Web Demo</div>
                    </div>
                    {
                        authGuard()
                            ?
                            <ul className="hamburgerBtCon nav navbar-nav navbar-right">
                                <li><span className='hamburgerBt' onClick={this.props.openSideNav.bind(this)} >&#9776;</span></li>
                            </ul>
                            :
                            null
                    }
                </div>
            </nav>
        )
    }
}