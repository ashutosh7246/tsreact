import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './overlayStyle.css';

export default class Overlay extends Component {

    public props: any;
    
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div id='mysidenavOverlay' className='sidenavOverlay'></div>
        )
    }
}