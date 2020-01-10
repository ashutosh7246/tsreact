import React, { Component } from 'react';
import '../../Home/node_modules/bootstrap/dist/css/bootstrap.min.css';
import './footerStyle.css';

export default class Footer extends Component {

    public props: any;

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="Footer">
                <div className='FooterText'>
                    Copyright © 2018 React Web and Desktop Demo. All Rights Reserved.
                </div>
            </div>
        )
    }
}